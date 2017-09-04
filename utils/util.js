var app = getApp();

/**
 * 公共微信https请求封装
 * @param url
 * @param type
 * @param data
 * @param callBack
 */
function https(url, type, data, callBack, header) {
    var promiseFun = function (resolve, reject) {
        if (!data.isHideLoad) {
            wx.showLoading({
                title: '加载中',
                mask: true //防止触摸穿透
            })
        }
        wx.showNavigationBarLoading();
        wx.request({
            url: url,
            method: type,
            data: data,
            header: header ? header : ( {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + wx.getStorageSync('token')
            }),
            success: function (res) {
                resolve(res.data);
                callBack(res.data);
            },
            fail: function (error) {
                reject(error);
                showToast("请求失败");
            },
            complete: function (res) {
                wx.hideNavigationBarLoading();
                wx.hideLoading();
                wx.stopPullDownRefresh();
                console.log(res);
                if (res.statusCode === 401) {
                    showToast("请求未授权");
                }
                //错误日志统一处理 保存到服务器数据库
                if (res.data && res.data.code && res.data.code != 1001) {
                    getErrorlog({
                        url: url,
                        content: "微信小程序日志原因:" + res.data.message + ", 接口参数:" + JSON.stringify(data)
                    }, function (data) {
                        console.log(data);
                    })
                }
            }

        })
    }
    return new Promise(function (resolve, reject) {
        //接口API授权 type 1.是公共授权  2.登录授权
        if (!wx.getStorageSync("userid")) {
            authorization(1, function (data) {
                promiseFun(resolve, reject);
            });
        } else if (wx.getStorageSync("userid")) {
            authorization(2, function (data) {
                promiseFun(resolve, reject);
            });
        }
    })


}

/**
 * 接口API授权 type 1.是公共授权  2.登录授权  immediately立刻执行授权
 */
function authorization(type, callback, immediately) {
    var that = this;
    if (type == 1) { //1.是公共授权
        //获取公共接口授权token  公共接口授权token两个小时失效  超过两个小时重新请求
        immediately = wx.getStorageSync("token") ? immediately : true
        if (!wx.getStorageSync("userid") && (immediately || (!wx.getStorageSync("token") || ((new Date().getTime() - new Date(wx.getStorageSync("expires_in")).getTime()) / 1000) >= 7199))) {
            wx.request({
                url: app.globalData.api + "/token",
                method: "POST",
                data: {grant_type: 'client_credentials', isHideLoad: true},
                header: {
                    'Authorization': 'Basic MTcwNjE0MDAwMTozNzliYjljNi1kNTYwLTQzMjUtYTQxMi0zMmIyMjRlMjg3NDc=',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var data = res.data;
                    if (data.access_token) {
                        wx.setStorageSync('token', data.access_token);//公共接口授权token
                        wx.setStorageSync('expires_in', new Date());//公共接口授权token 有效时间
                        wx.setStorageSync('tokentype', 1);//授权类型
                    }
                    callback.call(that, data)

                },
                fail: function (error) {
                    showToast("授权请求失败");
                },
                complete: function (res) {
                }
            })

        } else { //没有执行授权
            callback.call(that)
        }

    } else if (type == 2) {  //2.登录授权

        //获取登录接口授权token  登录接口授权token两个小时失效  超过两个小时重新请求
        immediately = wx.getStorageSync("expires_in") ? immediately : true
        if (wx.getStorageSync("userid") && (immediately || ((new Date().getTime() - new Date(wx.getStorageSync("expires_in")).getTime()) / 1000) >= 7199)) {
            wx.request({
                url: app.globalData.api + "/token",
                method: "POST",
                data: {
                    grant_type: 'password',
                    username: wx.getStorageSync("userid"),
                    password: wx.getStorageSync("usersecret"),
                    isHideLoad: true
                },
                header: {
                    'Authorization': 'Basic MTcwNjE0MDAwMTozNzliYjljNi1kNTYwLTQzMjUtYTQxMi0zMmIyMjRlMjg3NDc=',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var data = res.data;
                    if (data.access_token) {
                        wx.setStorageSync('token', data.access_token);//公共接口授权token
                        wx.setStorageSync('expires_in', new Date());//公共接口授权token 有效时间
                        wx.setStorageSync('tokentype', 2);//授权类型
                    } else {
                        that.showModal('收收提示', '登录过期，请重新登录', '登录', '取消', function (res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/account/login'
                                })
                            }
                        })
                    }
                    callback.call(that, data)

                },
                fail: function (error) {
                    showToast("授权请求失败");
                },
                complete: function (res) {
                }
            })

        } else { //没有执行授权
            callback.call(that)
        }

    }
}

/**
 *   格式化时间
 *  对Date的扩展，将 Date 转化为指定格式的String
 *  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *  例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *  (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function (fmt) { //
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 格式化金额 s金额  n格式小数位数
 */
function formatMoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

/**
 * 隐藏部分信息 如手机  188****2302  潘**
 */
function hidePartInfo(str, type) {
    if (!str) {
        return;
    }
    if (type == 'name') { //姓名信息
        return str.replace(str.length >= 3 ? str.substr(1, 2) : str.substr(1, 1), str.length >= 3 ? '**' : '*');
    }
    if (type == 'phone') { //手机信息
        return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    if (type == 'address') { //地址信息
        return str.replace(str.substring(str.lastIndexOf(','), str.length), '*****');
    }
    if (type == 'bankcard') { //银行卡
        return "**** **** **** " + str.substring(str.length - 4, str.length);
    }
}


/**
 * 是否登录提示
 */
function isLoginModal(isShow) {
    if (!wx.getStorageSync("userid")) {
        if (isShow) {
            wx.showModal({
                title: '收收提示',
                content: "登录收收,体验更完善功能",
                showCancel: true,
                confirmColor: "#00ACFF",
                confirmText: "登录",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/account/login'
                        })
                        console.log('用户点击确定');
                    } else if (res.cancel) {
                        //返回上一页
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '/pages/account/login'
            })
        }
        return true;
    } else {
        return false;
    }
    return true;
}


/**
 * Toast提示框
 */
function showToast(title, icon, duration) {
    wx.showToast({
        title: title || "",
        icon: icon || 'success',
        duration: duration || 2000
    })
}

/**
 * ​Modal显示模态弹窗
 */
function showModal(title, content, confirmText, cancelText, callback, showCancel) {
    var that = this;
    wx.showModal({
        title: title,
        content: content,
        confirmText: confirmText,
        cancelText: cancelText,
        showCancel: showCancel || true,
        confirmColor: "#00ACFF",
        cancelColor: "#33cd5f",
        success: function (res) {
            callback.call(that, res)
            /*          if (res.confirm) {
                          console.log('用户点击确定')
                      } else if (res.cancel) {
                          console.log('用户点击取消')
                      }*/
        }
    })
}

/**
 * toolTip方法 type 1是提示色 2是警告色,
 * navigationType 导航类型  navigate  redirect reLaunch back switchTab
 */
function toolTip(that, msg, type, url, navigationType) {
    //提示字段值
    that.setData(
        {
            popMsg: msg,
            popType: type == 1 ? "tool-tip-message-success" : "tool-tip-message"
        }
    );
    if (url) {
        /*   showToast(msg);*/
        setTimeout(function () { //切换页面之前为了显示提示信息
            if (url == 'back') {
                //返回上一页
                wx.navigateBack({
                    delta: 1
                })
            } else if (navigationType == 'redirect') {
                wx.redirectTo({
                    url: url
                })
            } else if (navigationType == 'reLaunch') {
                wx.reLaunch({
                    url: url
                })
            } else if (navigationType == 'switchTab') {
                wx.switchTab({
                    url: url
                })
            } else {
                wx.navigateTo({
                    url: url
                })
            }
        }, 800);


    }
}

/**
 * 调用验证表单方法
 */
function wxValidate(e, that, callback) {
    toolTip(that, "")
    const params = e.detail.value
    /*    console.log(params);*/
    if (!that.WxValidate.checkForm(e)) {
        const error = that.WxValidate.errorList
        //提示字段值
        toolTip(that, error[0].msg)
        /*      console.log(error)*/

        return false
    } else {
        callback.call(this)
    }
}

/**
 * 改变验证码按钮状态
 */
function verifyCodeBtn(e, that) {
    if (((e.currentTarget.id == 'user' || e.currentTarget.id == 'account') && (/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value))) || ((e.currentTarget.id == 'email') && (/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e.detail.value)))) {
        that.setData({
            vcdisabled: false
        })
    } else if (((e.currentTarget.id == 'user' || e.currentTarget.id == 'account') && !(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value))) || ((e.currentTarget.id == 'email') && !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e.detail.value)))) {
        that.setData({
            vcdisabled: true
        })
    }
}

/**
 * 获取验证码公共方法
 */
function getVerifyCode(account, that, callback) {
    var second = 120,
        timePromise = undefined;
    timePromise = setInterval(function () {
        if (second <= 0) {
            clearInterval(timePromise);
            that.setData({
                paracont: "重发验证码",
                vcdisabled: false

            })
        } else {
            that.setData({
                paracont: second + "秒后重试",
                vcdisabled: true

            })
            second--;
        }
    }, 1000, 122);

    if ((/^1(3|4|5|7|8)\d{9}$/.test(account))) {//手机号
        this.https(app.globalData.api + "/api/util/send_sms_validcode/" + account, "GET", {},
            function (data) {
                if (data.code == 1001) {
                    callback.call(this, data)
                }
            }
        )
    } else if ((/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(account))) { //邮箱
        this.https(app.globalData.api + "/api/util/send_email_validcode", "GET", {email: account},
            function (data) {
                if (data.code == 1001) {
                    callback.call(this, data)
                }
            }
        )
    }

}

/**
 * 点击tab切换
 */
function swichNav(e, that) {
    if (that.data.currentTab === e.target.dataset.current) {
        return false;
    } else {
        that.setData({
            currentTab: e.target.dataset.current
        })
    }
}

/**
 * 微信授权登录
 */
function wxLogin() {
    var that = this;
    //调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid）
    if (!(wx.getStorageSync("openid") && wx.getStorageSync("userid"))) { //微信授权登录 获取openid
        wx.login({
            success: function (res) {
                if (res.code) {
                    //根据微信Code获取对应的openId
                    that.https(app.globalData.api + "/api/wc/GetOpenid", "GET", {
                            code: res.code,
                            UserLogID: wx.getStorageSync("userid") || "",
                            client: "xcx",
                            isHideLoad: true
                        },
                        function (data) {
                            if (data.code == 1001) {
                                if (data.data.OpenId != null && data.data.OpenId != "") {
                                    wx.setStorageSync("openid", data.data.OpenId);//微信openid
                                }
                                if (data.data.UserLogID != null && data.data.UserLogID != "") {
                                    wx.setStorageSync("userid", data.data.UserLogID);
                                }
                                if (data.data.usersecret != null && data.data.usersecret != "") {
                                    wx.setStorageSync("usersecret", data.data.usersecret);
                                }
                                if (wx.getStorageSync("userid")) {//如果已登录
                                    //登录授权
                                    that.authorization(2, function (data) {

                                    }, true);
                                    //根据会员ID获取会员账号基本信息
                                    that.getUserInfo(function () {

                                    });
                                } else { //绑定账号
                                    wx.navigateTo({
                                        url: '/pages/account/binduser'
                                    })
                                }

                            } else {
                                showToast(data.message)
                            }

                        })

                } else {
                    console.log('获取微信用户登录状态失败！' + res.errMsg);
                }
            }
        });
    }
}

/**
 * 根据会员ID获取会员账号基本信息
 */
function getUserInfo(callback) {
    var that = this;
    this.https(app.globalData.api + "/api/user/get/" + wx.getStorageSync("userid"), "GET", {isHideLoad: true},
        function (data) {
            if (data.code == 1001) {
                wx.setStorageSync("user", data.data);
                var services = data.data.services;
                //用户会员类型  0 无 1信息提供者  2回收者
                wx.setStorageSync("usertype", (services == null || services.length == 0) ? 1 : (services.length == 1 && services.indexOf('1') != -1) ? 1 : 2); //默认是信息供应者
                /*                if (services == null || services.length == 0) {//旧会员 完善信息
                                    that.showModal('收收提示', '尊敬的用户,您好！旧会员需完善资料后才能进行更多的操作！', '完善资料', '暂不完善', function (res) {
                                        if (res.confirm) {
                                            wx.navigateTo({
                                                url: '/pages/account/organizingdata'
                                            })
                                        }
                                    })

                                }*/
                callback.call(this, data)
            }
        }
    )
}

/**
 * 获取省市县数据
 */
function getAddressPCCList(that, item, level, callback) {
    //获取省份信息
    if (!item) {
        this.https(app.globalData.api + "/api/addr/getplist", "GET", {},
            function (data) {
                if (data.code == 1001) {
                    wx.pageScrollTo({
                        scrollTop: 0
                    })
                    that.setData({
                        isShowPCC: true,
                        addressinfo: data.data
                    })

                } else {
                    toolTip(that, data.message)
                }

            }
        )
        return;
    }
    //获取市信息
    if (item.Level == 1) {
        this.https(app.globalData.api + "/api/addr/getclist", "GET", {pid: item.ID},
            function (data) {
                if (data.code == 1001) {
                    wx.pageScrollTo({
                        scrollTop: 0
                    })
                    that.setData({
                        addressinfo: data.data
                    })

                } else {
                    toolTip(that, data.message)
                }

            }
        )
    }
    //获取县或地区信息
    if (item.Level == 2) {
        this.https(app.globalData.api + "/api/addr/getdlist", "GET", {cid: item.ID},
            function (data) {
                if (data.code == 1001) {
                    wx.pageScrollTo({
                        scrollTop: 0
                    })
                    that.setData({
                        addressinfo: data.data
                    })

                } else {
                    toolTip(that, data.message)
                }

            }
        )
    }

    //获取最后一级地址信息 关闭modal
    if (level == item.Level || item.Level == 3) {
        that.setData({
            isShowPCC: false,
            addresspcd: item.MergerName,
            addressone: item,
            longitude: null,//自动详情经度
            latitude: null,//自动详情纬度
            handlongitude: item.Lng,//手动经度
            handlatitude: item.Lat//手动纬度
        })
    }
}

/**
 * 获取当前位置 省市县数据
 */
function getCurrentCity(that, level, callback) {
    /*    that.setData({
            isShowSearch: true
        })*/
    this.https("https://restapi.amap.com/v3/geocode/regeo", "GET", {
            key: app.globalData.gaoDeKey,
            location: Number(that.data.handlongitude || wx.getStorageSync("longitude")).toFixed(6) + "," + Number(that.data.handlatitude || wx.getStorageSync("latitude")).toFixed(6),
            radius: 3000,//	查询POI的半径范围。取值范围：0~3000,单位：米
            extensions: 'all',//返回结果控制
            batch: false, //batch=true为批量查询。batch=false为单点查询
            roadlevel: 0 //可选值：1，当roadlevel=1时，过滤非主干道路，仅输出主干道路数据
        },
        function (data) {
            var addressComponent = data.regeocode.addressComponent;
            that.setData({
                city: addressComponent.city.length == 0 ? addressComponent.province : addressComponent.city,
                addresspois: data.regeocode.pois,
                ssx: (addressComponent.province + addressComponent.city + (level == 2 ? "" : addressComponent.district)),//省市县
                addrdetail: addressComponent.township + addressComponent.streetNumber.street
            })
            callback(data)
        }
    ).then(function () {
        https(app.globalData.api + "/api/addr/getssx", "GET", {
                ssx: that.data.ssx, level: level
            },
            function (data) {
                if (data.code == 1001) {
                    that.setData({
                        addressone: data.data
                    })
                } else {
                    toolTip(that, data.message)
                }

            }
        )
    })
}

/**
 * 获取通过用POI的关键字进行条件搜索数据
 */
function getSearchAddress(that, addrname, callback) {
    this.https("https://restapi.amap.com/v3/place/text", "GET", {
            key: app.globalData.gaoDeKey,
            keywords: addrname,//查询关键词
            city: that.data.city || "深圳",
            extensions: 'all'//返回结果控制
        },
        function (data) {
            that.setData({
                addresspois: data.pois

            })
        }
    )
}


/**
 * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用；当用户点击“显示在聊天顶部”时，此接口可继续调用
 */
function getLocation(that, callback) {
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
            wx.setStorageSync("longitude", res.longitude);//经度
            wx.setStorageSync("latitude", res.latitude);//纬度
        }
    })
}

/**
 * 打开地图选择位置
 */
function chooseLocation(that, callback) {
    wx.chooseLocation({
        success: function (res) {
            var address = res.address.toString();
            var end = Number(address.indexOf("区") == -1 ? address.indexOf("县") : address.indexOf("区")) + 1;
            var ssx = address.substring(0, end);
            if (that.data.ssx.indexOf(ssx) == -1) {//不是同一个省市县地区
                that.setData({
                    ssx: address.substring(0, end)
                })
                https(app.globalData.api + "/api/addr/getssx", "GET", {
                        ssx: ssx, level: 3
                    },
                    function (data) {
                        if (data.code == 1001) {
                            that.setData({
                                addressone: data.data
                            })
                        } else {
                            toolTip(that, data.message)
                        }

                    }
                )
            }
            that.setData({
                addressname: res.name,//位置名称
                latitude: res.latitude,//纬度
                longitude: res.longitude,//经度
            })
            console.log(res);
            callback.call(this, res)
        }
    })
}

/**
 * 打开相机或者相册
 */
function uploadActionSheet(that, callback) {
    wx.showActionSheet({
        itemList: ['从手机相册选择', '拍照'],
        itemColor: "#00ACFF",
        success: function (res) {
            if (res.tapIndex == 0) { //从手机相册选择
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        //上传文件
                        uploadFile(res, that, callback)
                    }
                })
            } else if (res.tapIndex == 1) { //拍照
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'],
                    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        //上传文件
                        uploadFile(res, that, callback)
                    }
                })
            }

        },
        fail: function (res) {
            console.log(res.errMsg)
        }
    })
}

/**
 * 上传文件
 */
function uploadFile(res, that, callback) {
    // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePaths = res.tempFilePaths;
    that.setData({
        imageList: [tempFilePaths]
    })
    wx.showLoading({
        title: '正在上传', mask: true //防止触摸穿透
    })
    wx.uploadFile({
        url: app.globalData.api + "/api/util/uploadimg/" + that.data.filename, //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],//要上传文件资源的路径
        name: 'file',//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        formData: {//HTTP 请求中其他额外的 form data
        },
        header: {"authorization": "Bearer " + wx.getStorageSync('token')}, //授权
        success: function (res) {
            console.log(res);
            var data = JSON.parse(res.data);
            callback(data)
            //do something
            that.setData({
                imgsPicAddr: [app.globalData.imgUrl + data.data]
            })

            toolTip(that, "上传成功", 1)

        }, fail: function (res) {
            toolTip(that, "上传失败")
        }, complete: function () {
            wx.hideLoading();
        }
    })
}

/**
 * 获取产品品类
 */
function getProductList(that, callback) {
    this.https(app.globalData.api + "/api/product/getgrplistnew", "GET", {isth: that.data.isth, isHideLoad: true},
        function (data) {
            callback.call(this, data)
        }
    )
}

/**
 * 错误信息收集 传到服务器
 */
function getErrorlog(data, callback) {
    var that = this;
    wx.request({
        url: app.globalData.api + "/api/util/errorlog",
        method: "POST",
        data: {
            key: wx.getStorageSync('userid') || "",
            url: data.url,
            content: data.content,
            isHideLoad: true
        },
        header: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        success: function (res) {
            var data = res.data;
            callback.call(that, data)
        }
    })
}


/**
 * 获得我的里面待处理和预警订单数 银行卡以及余额
 */
function getUserSum(that, callback) {
    this.https(app.globalData.api + "/api/orderreceipt/getsum/" + wx.getStorageSync('userid') + "/" + 24, "GET", {isHideLoad: true},
        function (data) {
            data.data.totalamount = formatMoney(data.data.totalamount, 2)
            data.data.account = formatMoney(data.data.account, 2)
            data.data.trzaccount = formatMoney(data.data.trzaccount, 2)
            that.setData({
                userSum: data.data
            })
            callback.call(this, data)
        }
    )
}

/**
 * 打电话
 */
function makePhoneCall(that, callback) {
    wx.makePhoneCall({
        phoneNumber: that.data.phoneNumber
    })
}

module.exports = {
    https: https,
    authorization: authorization,
    formatMoney: formatMoney,
    hidePartInfo: hidePartInfo,
    isLoginModal: isLoginModal,
    showToast: showToast,
    showModal: showModal,
    toolTip: toolTip,
    wxValidate: wxValidate,
    verifyCodeBtn: verifyCodeBtn,
    getVerifyCode: getVerifyCode,
    swichNav: swichNav,
    wxLogin: wxLogin,
    getUserInfo: getUserInfo,
    getAddressPCCList: getAddressPCCList,
    getCurrentCity: getCurrentCity,
    getSearchAddress: getSearchAddress,
    getLocation: getLocation,
    chooseLocation: chooseLocation,
    uploadActionSheet: uploadActionSheet,
    uploadFile: uploadFile,
    getProductList: getProductList,
    getUserSum: getUserSum,
    makePhoneCall: makePhoneCall
}

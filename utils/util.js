var app = getApp();

/**
 * 公共微信https请求封装
 * @param url
 * @param type
 * @param data
 * @param callBack
 */
function https(url, type, data, callBack, header) {
    if(!data.isShowLoad){
        wx.showLoading({
            title: '加载中',
        })
    }
    wx.request({
        url: url,
        method: type,
        data: data,
        header: header ? header : ( {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
        }),
        success: function (res) {
            console.log(res);
            if (res.data.code != 1001) {
                if (res.data.message) {
                    showToast(res.data.message)
                }

            }
            callBack(res.data);
        },
        fail: function (error) {
            console.log(error)
            showToast("请求失败:" + JSON.stringify(error))

        },
        complete: function () {
            wx.hideLoading();
            wx.stopPullDownRefresh();
        }
    })
}

/**
 * 接口API授权 type 1.是公共授权  2.登录授权
 */
function authorization(type, callback) {
    if (type == 1) { //1.是公共授权
        //获取公共接口授权token  公共接口授权token两个小时失效  超过两个小时重新请求
        if (!wx.getStorageSync("userid") && (!wx.getStorageSync("token") || wx.getStorageSync == "undefined" || ((new Date().getTime() - new Date(wx.getStorageSync("expires_in")).getTime()) / 1000) > 7199)) {
            this.https(app.globalData.api + "/token", "POST", {grant_type: 'client_credentials',},
                function (data) {
                    if (data.access_token) {
                        wx.setStorageSync('token', data.access_token);//公共接口授权token
                        wx.setStorageSync('expires_in', new Date());//公共接口授权token 有效时间
                    }
                    callback.call(this)

                }, {
                    'Authorization': 'Basic MTcwNjE0MDAwMTozNzliYjljNi1kNTYwLTQzMjUtYTQxMi0zMmIyMjRlMjg3NDc=',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            )
        }
    } else if (type == 2) {  //2.登录授权

    }

}

/**
 * 是否登录
 */
function isLogin() {
    return wx.getStorageSync("userid") ? true : false;
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
    }
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
 * 调用验证表单方法
 */
function wxValidate(e, that, callback) {
    const params = e.detail.value
    /*    console.log(params);*/
    if (!that.WxValidate.checkForm(e)) {
        const error = that.WxValidate.errorList
        showToast(error[0].msg);
        /*        wx.showModal({
                    title: '收收提示',
                    content: error[0].msg,
                    showCancel: false,
                    confirmColor: "#00ACFF",
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                })*/
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
    if (e.currentTarget.id == 'user' && (/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value))) {
        that.setData({
            vcdisabled: false
        })
    } else if (e.currentTarget.id == 'user' && !(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value))) {
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

    this.https(app.globalData.api + "/api/util/send_sms_validcode/" + account, "GET", {},
        function (data) {
            if (data.code == 1001) {
                callback.call(this, data)
            }
        }
    )
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

module.exports = {
    https: https,
    authorization: authorization,
    isLogin: isLogin,
    isLoginModal: isLoginModal,
    showToast: showToast,
    wxValidate: wxValidate,
    verifyCodeBtn: verifyCodeBtn,
    getVerifyCode: getVerifyCode,
    swichNav: swichNav
}

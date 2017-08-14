var app = getApp();

/**
 * 公共微信https请求封装
 * @param url
 * @param type
 * @param data
 * @param callBack
 */
function https(url, type, data, callBack, header) {

    /*    wx.showToast({
            title: '收收',
            icon: 'loading',
            duration: 500
        })*/
    /*    wx.showLoading({
            title: '加载中',
        })*/
    wx.request({
        url: url,
        method: type,
        data: data,
        header: header ? header : ( {
            "Content-Type": "json",
            "authorization": "Bearer " + wx.getStorageSync('token')
        }),
        success: function (res) {
            console.log(res);
            if (res.data.code != 1001) {
                /*        wx.hideLoading()
                        wx.hideToast();*/
                wx.showToast({
                    title: res.data.Msg,
                    icon: 'success',
                    duration: 2000
                })
            }
            callBack(res.data);
        },
        fail: function (error) {
            /*            wx.hideLoading()
             wx.hideToast();*/
            wx.showToast({
                title: "请求失败:" + JSON.stringify(error),
                icon: 'success',
                duration: 2000
            })
            console.log(error)
        },
        complete: function () {
            /*  wx.hideToast();*/
        }
    })
}

/**
 * 接口API授权 type 1.是公共授权  2.登录授权
 */
function authorization(type, callback) {
    if (type == 1) {
        //获取公共接口授权token  公共接口授权token两个小时失效  超过两个小时重新请求
        if (!wx.getStorageSync("userid") && (!wx.getStorageSync("token") || wx.getStorageSync == "undefined" || ((new Date().getTime() - new Date(wx.getStorageSync("expires_in")).getTime()) / 1000) > 7199)) {
            this.https(app.globalData.api + "/token", "POST", {grant_type: 'client_credentials'},
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
function isLoginModal() {
    wx.showModal({
        title: '友情提示',
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
}


/**
 * Toast提示框
 */
function showToast(title, icon, duration) {
    wx.showToast({
        title: title || "",
        icon: icon || 'success',
        duration: duration || 1500
    })
}

module.exports = {
    https: https,
    authorization: authorization,
    isLogin: isLogin,
    isLoginModal: isLoginModal,
    showToast: showToast,

}

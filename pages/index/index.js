//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
    data: {
        motto: '你好 收收',
        userInfo: {}
    },
    //事件处理函数
    /*  bindViewTap: function() {
        wx.navigateTo({
          url: '../logs/logs'
        })
      },*/
    /*  onLoad: function () {

        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
            userInfo:userInfo
          })
        })
      },*/
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        util.authorization(1, function () {
            //调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid）
            if (!wx.getStorageSync("openid")) { //初次授权登录 获取openid
                wx.login({
                    success: function (res) {
                        if (res.code) {
                            //根据微信Code获取对应的openId
                            util.https(app.globalData.api + "/api/wc/GetOpenid", "GET", {
                                    code: res.code,
                                    UserLogID: wx.getStorageSync("userid") || ""
                                },
                                function (data) {
                                    console.log(data);
                                    if (data.code == 1001) {
                                        wx.setStorageSync("openid", data.data.OpenId);//微信openid
                                        wx.setStorageSync("userid", data.data.UserLogID);
                                        wx.setStorageSync("usersecret", data.data.usersecret);
                                    }

                                })

                        } else {
                            console.log('获取用户登录状态失败！' + res.errMsg);
                        }
                    }
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})


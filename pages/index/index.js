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
        //接口API授权 type 1.是公共授权  2.登录授权
        if (!wx.getStorageSync("userid")) {
            util.authorization(1, function () {
                //微信授权登录
                util.wxLogin();
            });
        } else if (wx.getStorageSync("userid")) {
            util.authorization(2, function () {
            });
        }

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


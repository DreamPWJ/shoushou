// pages/account/setting.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        var that = this;
        util.getUserInfo(function (data) {
            that.setData({
                version: app.globalData.version,
                securitylevel: '未知'
            })
            var certstate = wx.getStorageSync('user').certstate;
            if (certstate.indexOf('2') == -1) {
                that.data.securitylevel = '极低';
            }
            if ((certstate.substr(0, 1) == 2 || certstate.substr(1, 1) == 2) || (certstate.substr(3, 1) == 2 || certstate.substr(4, 1) == 2)) {
                that.data.securitylevel = '中等';
            }
            if ((certstate.substr(0, 1) == 2 || certstate.substr(1, 1) == 2) && (certstate.substr(3, 1) == 2 || certstate.substr(4, 1) == 2)) {
                that.data.securitylevel = '较高';
            }
            if ((certstate.substr(0, 1) == 2 && certstate.substr(1, 1) == 2) && (certstate.substr(3, 1) == 2 || certstate.substr(4, 1) == 2)) {
                that.data.securitylevel = '高';
            }
            if ((certstate.substr(0, 1) == 2 && certstate.substr(1, 1) == 2) && (certstate.substr(3, 1) == 2 && certstate.substr(4, 1) == 2)) {
                that.data.securitylevel = '极高';
            }
            that.setData({
                securitylevel: that.data.securitylevel
            })
        })


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
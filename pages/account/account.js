// pages/account/account.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxUserInfo: wx.getStorageSync("wxUserInfo"),
        userSum: {
            account: '0.00',
            banknum:0
        }
    },

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
        util.isLoginModal();
        this.getAccountData();
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
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '收收分享',
            path: '/pages/account/account',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    /**
     * 获取我的数据
     */
    getAccountData: function () {
        var that = this;
        //根据会员ID获取会员账号基本信息
        util.getUserInfo(function (data) {
            that.setData({
                userdata: data.data
            })
        })
        //获得我的里面待处理和预警订单数 银行卡以及余额
        util.getUserSum(that, function (data) {

        })
        //获取微信用户信息
        if (!wx.getStorageSync("wxUserInfo")) {
            app.getUserInfo(function (data) {
                that.setData({
                    wxUserInfo: data
                })
            })
        }

    }
})
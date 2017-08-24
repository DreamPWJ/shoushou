// pages/wallet/wallet.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userSum: {
            account: '0.00',
            trzaccount: '0.00',
            banknum: 0
        },
        walletData: {
            kyamount: '0.00',
            djamount: '0.00'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        util.isLoginModal();

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
        //获得我的里面待处理和预警订单数 银行卡以及余额
        util.getUserSum(this, function (data) {

        })
        //个人账户信息
        /*      this.getWalletData();*/
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

    },
    /**
     * 个人账户信息
     */
    getWalletData: function () {
        var that = this;
        util.https(app.globalData.api + "/api/subaccount/get/" + wx.getStorageSync('userid'), "GET", {isHideLoad: true},
            function (data) {
                that.setData({
                    walletData: data.data
                })

            }
        )
    }
})
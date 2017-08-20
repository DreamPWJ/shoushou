// pages/wallet/recharge.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        paytype: [  //支付类型
            {value: 1, name: '微信支付', checked: 'true'},
        ],
        paydata:{},//支付数据
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
     * 用户支付
     */
    paymentSubmit: function (e) {
        var data = this.data.paydata;
        console.log(this.data.paydata);
        wx.requestPayment({
            'timeStamp': data.TimeStamp,
            'nonceStr': data.NonceStr,
            'package': data.PackAge,
            'signType': 'MD5',
            'paySign': data.PaySign,
            'success': function (res) {
                console.log(res);
            },
            'fail': function (res) {
                console.log(res);
            }
        })

    }
})
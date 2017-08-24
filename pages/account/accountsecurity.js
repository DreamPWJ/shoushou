// pages/account/accountsecurity.js
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
            var certstate = data.data.certstate;//获取认证状态参数
            that.setData({
                certstatestatus: ['未认证', '认证中', '已认证', '未通过'],
                phonestatus: certstate.substr(0, 1),//手机认证状态码
                emailstatus: certstate.substr(1, 1),//邮箱认证状态码
                secrecystatus: certstate.substr(2, 1),//保密认证状态码
                identitystatus: certstate.substr(3, 1),//身份认证状态码
                companystatus: certstate.substr(4, 1),//企业认证状态码
                bankstatus: certstate.substr(5, 1),//银行账号状态码
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
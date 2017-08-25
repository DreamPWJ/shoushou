// pages/account/accountinfo.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxUserInfo:wx.getStorageSync("wxUserInfo"),
        filename: 'User',
        imageList: [],//本地路径
        imgsPicAddr: [],//真实服务器图片信息数组
        uploadtype: 5,//上传媒体操作类型 1.卖货单 2 供货单 3 买货单 4身份证 5 头像
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAccountData();
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
     * 上传图片
     */
    uploadActionSheet: function (e) {
        var that = this;
        util.uploadActionSheet(this, function (data) {
            util.https(app.globalData.api + "/api/user/set_figure/" + wx.getStorageSync('userid'), "GET", {figure: app.globalData.imgUrl + data.data},
                function (data) {
                    wx.switchTab({
                        url: '/pages/account/account'
                    })
                }
            )
        })
    },
    /**
     * 获取我的数据
     */
    getAccountData: function () {
        var that = this;
        //根据会员ID获取会员账号基本信息
        util.getUserInfo(function (data) {
            var user=data.data;
            var certstate = user.certstate;//获取认证状态参数
            var usertype=wx.getStorageSync('usertype');
            that.setData({
                userdata: data.data,
                usertype:usertype,
                phonestatus:certstate.substr(0, 1),//手机认证状态码
                isOrganizingData:user.userext == null ? false : true,//是否完善资料
                services:usertype == 1?'信息提供者':'回收商'
            })
        })
    }
})
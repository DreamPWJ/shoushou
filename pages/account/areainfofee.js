// pages/account/areainfofee.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        usertype:wx.getStorageSync('usertype')
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
        //是否登录
        if(util.isLoginModal()) return;
        this.getAreaInfoFee();
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
     * 地区信息费数据
     */
    getAreaInfoFee: function () {
        var that = this;
        //获取当前位置 省市县数据
        util.getCurrentCity(that, 3, function (data) {
            wx.setNavigationBarTitle({
                title: that.data.city.replace("市", "地区") + "信息费标准"
            })
            util.https(app.globalData.api + "/api/util/getinformationlist", "GET", {areaname: that.data.city},
                function (data) {
                    if (data.code == 1001) {
                        that.setData({
                            areaInfoFee: data.data,
                            isNotData: (data.data == null || data.data.length == 0) ? true : false,
                        })
                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })

    }
})
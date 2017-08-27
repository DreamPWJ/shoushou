// pages/wallet/credited.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        hasData: true,
        creditedList: []
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
        var that = this;
        that.setData({
            page: 1
        }, function () {
            //获取待入账金额列表
            that.getCreditedList(1);
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
        var that = this;
        that.setData({
            page: 1
        }, function () {
            //获取待入账金额列表
            that.getCreditedList(1);
        })

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasData) {
            return;
        }
        //获取待入账金额列表
        this.getCreditedList(this.data.page);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 获取待入账金额列表
     */
    getCreditedList: function (page) {
        var that = this;
        util.https(app.globalData.api + "/api/dengji/getlistyj/" + page + "/" + 10, "GET", {
                userid: wx.getStorageSync("userid"),//用户id
                isHideLoad: true
            },
            function (data) {
                if (that.data.page == 1) {
                    that.setData({
                        creditedList: []
                    })
                }

                for (var index in data.data.data_list) {
                    that.data.creditedList.push(data.data.data_list[index]);
                }

                that.setData({
                    hasData: data.data.page_count == that.data.page ? false : true,
                    isNotData: (data.data == null || data.data.data_list.length == 0) ? true : false,
                    creditedList: that.data.creditedList.map(function (item) {
                        item.addtime = new Date(item.addtime.replace(/T/g, " ")).Format("yyyy-MM-dd")
                        return item
                    })
                })
                that.data.page++;

            }
        )
    }
})
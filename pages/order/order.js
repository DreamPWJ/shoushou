// pages/order/order.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0,   // tab切换
        page: 1,
        hasData: true,
        isNotData: true,
        orderListArr: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        util.isLoginModal();
        //获取消息列表
        this.getOrderList(this.data.page);
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
        if (!this.data.hasData) {
            return;
        }
        //获取消息列表
        this.getOrderList(this.data.page);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 获取订单列表
     */
    getOrderList: function (page) {
        var that = this;
        util.https(app.globalData.api + "/api/MessagePush/getlist", "GET", {
                page: page,//页码
                size: 10,//条数
                userid: wx.getStorageSync("userid"),//用户id
                isHideLoad: true
            },
            function (data) {
                if (that.data.page == 1) {
                    that.setData({
                        newsListArr: []
                    })
                }

                for (var index in data.data.data_list) {
                    that.data.newsListArr.push(data.data.data_list[index]);
                }

                that.setData({
                    hasData: data.data.page_count == that.data.page ? false : true,
                    isNotData: (data.data == null || data.data.data_list == 0) ? true : false,
                    newsList: that.data.newsListArr
                })
                that.data.page++;

            }
        )
    }
    ,
    /**
     * 滑动切换tab
     */
    bindChange: function (e) {
        this.setData({currentTab: e.detail.current});

    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        util.swichNav(e, this)
    }
})
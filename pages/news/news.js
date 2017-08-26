// pages/news/news.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        hasData: true,
        newsList: []
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
        //获取消息列表
        this.setData({
            page: 1
        })
        this.getNewsList(1);
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
        this.setData({
            page: 1
        })
        //获取消息列表
        this.getNewsList(this.data.page);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasData) {
            return;
        }
        //获取消息列表
        this.getNewsList(this.data.page);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 设置已读未读
     */
    updateNewsLook: function (type, id) {
        var that = this;
        util.https(app.globalData.api + "/api/MessagePush/setlook?look=" + type + '&ids=' + id, "POST", {},
            function (data) {
                if (data.code != 1001) {
                    util.toolTip(that, data.message);
                }
            }
        )
    },
    /**
     * 订单详情
     */
    newsDetails: function (e) {
        var item = e.currentTarget.dataset.item;
        if (item.relateno) {
            this.updateNewsLook(1, item.id);
            if (item.receipttype == 2) {
            } else {
                wx.navigateTo({
                    url: '../order/orderdetails?orderno=' + item.relateno
                })
            }

        }
    },
    /**
     * 获取消息列表
     */
    getNewsList: function (page) {
        var that = this;
        util.https(app.globalData.api + "/api/MessagePush/getlist", "GET", {
                page: page,//页码
                size:10,//条数
                userid: wx.getStorageSync("userid"),//用户id
                isHideLoad: true
            },
            function (data) {
                if (that.data.page == 1) {
                    that.setData({
                        newsList: []
                    })
                }

                for (var index in data.data.data_list) {
                    that.data.newsList.push(data.data.data_list[index]);
                }

                that.setData({
                    hasData: data.data.page_count == that.data.page ? false : true,
                    isNotData: (data.data == null || data.data.data_list.length == 0) ? true : false,
                    newsList: that.data.newsList
                })
                that.data.page++;

            }
        )
    }
})
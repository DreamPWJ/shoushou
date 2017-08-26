// pages/index/infofee.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        hasData: true,
        tradeList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        util.isLoginModal();
        this.setData({
            channel: options.channel||0
        })

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
        if (that.data.channel == 0) {
            wx.setNavigationBarTitle({
                title: "交易记录"
            })
        } else if (that.data.channel == 402) {
            wx.setNavigationBarTitle({
                title: "信息费收入"
            })
        }

        that.setData({
            page: 1
        }, function () {
            that.getInfoFee(1);
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
            that.getInfoFee(1);
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasData) {
            return;
        }
        this.getInfoFee(this.data.page);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 信息费数据 获取资金交易记录
     */
    getInfoFee: function (page) {
        var that = this;
        var data = {
            page: page,//页码
            size: 10,//条数
            channel: that.data.channel == 0 ? "" : that.data.channel,
        }
        util.https(app.globalData.api + "/api/subaccount/get_tradelist/" + wx.getStorageSync('userid'), "GET", data,
            function (data) {
                if (that.data.page == 1) {
                    that.setData({
                        tradeList: []
                    })
                }
                for (var index in data.data.data_list) {
                    that.data.tradeList.push(data.data.data_list[index]);
                }
                that.setData({
                    hasData: data.data.page_count == that.data.page ? false : true,
                    isNotData: (data.data == null || data.data.data_list.length == 0) ? true : false,
                    tradeList: that.data.tradeList.map(function (item) {
                        item.amount=util.formatMoney(item.amount,2);
                        item.preamount=util.formatMoney(item.preamount,2);
                        item.createtime= new Date(item.createtime.replace(/T/g," ")).Format("yyyy-MM-dd HH:mm")
                    return item
                    })
                })
                that.data.page++;
            }
        )
    }
})
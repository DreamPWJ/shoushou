// pages/order/orderdetails.js
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
        util.isLoginModal();
        this.setData({
            orderno: options.orderno
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
        //获取订单列表详情
        this.getOrderDetails(this.data.orderno);
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
     * 打电话
     */
    makePhoneCall:function (e) {
        this.setData({
            phoneNumber:e.currentTarget.dataset.phone
        })
        util.makePhoneCall(this)
    },
    /**
     * 关闭订单
     */
    closeOrder: function (e) {
        var that = this;
        util.showModal('收收提示', '您是否要关闭此订单?"是"点击"确定",否则请点击"取消', '确定', '取消', function (res) {
            if (res.confirm) {
                var orderno = e.currentTarget.dataset.orderno;
                util.https(app.globalData.api + "/api/dengji/cancel/" + orderno, "GET", {},
                    function (data) {
                        if (data.code == 1001) {
                            that.getOrderDetails(orderno);
                            util.toolTip(that, '订单关闭成功', 1);
                        } else {
                            util.toolTip(that, data.message);
                        }
                    }
                )
            }
        })
    },
    /**
     * 获取订单列表详情
     */
    getOrderDetails: function (orderno) {
        var that = this;
        util.https(app.globalData.api + "/api/dengji/getdetail/" + orderno, "GET", {},
            function (data) {
                if (data.code == 1001) {
                    data.data.addtime= new Date(data.data.addtime.replace(/T/g," ")).Format("yyyy-MM-dd HH:mm")
                    data.data.oraddtime= new Date(data.data.oraddtime.replace(/T/g," ")).Format("yyyy-MM-dd HH:mm")
                    data.data.appointtime= new Date(data.data.appointtime.replace(/T/g," ")).Format("yyyy-MM-dd HH:mm")
                    that.setData({
                        orderDetail: data.data
                    })
                } else {
                    util.toolTip(that, data.message);
                }
            }
        ).then(function () {
            util.https(app.globalData.api + "/api/dengji", "GET", {djno: that.data.orderDetail.djno},
                function (data) {
                    that.setData({
                        commentInfo: data.data
                    })
                })
        })
    }
    ,
})
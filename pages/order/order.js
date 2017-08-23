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
        unfpage: 1,
        page: 1,
        hasUnfData: true,
        hasData: true,
        unfinishedOrderListArr: [],
        orderListArr: []
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
        this.getOrderList(this.data.currentTab == 0 ? this.data.unfpage : this.data.page);
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

        /*        if (this.data.currentTab == 0) {
                    this.setData({
                        unfpage: 1
                    })
                }
                if (this.data.currentTab == 1) {
                    this.setData({
                        page: 1
                    })
                }
                //获取订单列表
                this.getOrderList(this.data.currentTab == 0 ? this.data.unfpage : this.data.page);*/
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.currentTab == 0) {
            if (!this.data.hasUnfData) {
                return;
            }
        }
        if (this.data.currentTab == 1) {
            if (!this.data.hasData) {
                return;
            }
        }

        //获取订单列表
        this.getOrderList(this.data.currentTab == 0 ? this.data.unfpage : this.data.page);
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
        util.https(app.globalData.api + "/api/dengji/getlist/" + page + "/" + 10, "GET", {
                DJNo: "",//登记单号(可为空)
                Type: "",//类型1.登记信息 2.登记货源(可为空)
                ORuserid: "",//接单人
                userid: wx.getStorageSync('userid'),//用户userid
                Category: "",//货物品类 多个用逗号隔开(可为空)
                HYType: "",//货物类别 0.未区分 1废料 2二手(可为空) 上门回收(2)接登记信息（0）的单;货场(3)接废料（1）二手商家（4）接二手的(2)
                State: that.data.currentTab == 0 ? "1,2,3,4,5" : "",//状态 0.已关闭 1.审核不通过 2.未审核 3.审核通过（待接单） 4.已接单 (待收货) 5.已收货（待付款） 6.已付款（待评价） 7.已评价 (可为空)
                longt: "", //当前经度（获取距离）(可为空)
                lat: "",//当前纬度（获取距离）(可为空)
                expiry: "",//小时 取预警数据 订单预警数据（72小时截至马上过期的（expiry=3表示取3小时内）
                isHideLoad:true
            },
            function (data) {
                if (that.data.currentTab == 0 && that.data.unfpage == 1) {
                    that.setData({
                        unfinishedOrderListArr: []
                    })
                }
                if (that.data.currentTab == 1 && that.data.page == 1) {
                    that.setData({
                        orderListArr: []
                    })
                }
                for (var index in data.data.data_list) {

                    if (that.data.currentTab == 0) {//未完成订单
                        that.data.unfinishedOrderListArr.push(data.data.data_list[index]);
                    }
                    if (that.data.currentTab == 1) {//所有订单
                        that.data.orderListArr.push(data.data.data_list[index]);
                    }
                }

                that.setData({
                    hasUnfData: data.data.page_count == that.data.unfpage ? false : true,
                    hasData: data.data.page_count == that.data.page ? false : true,
                    isNotunfinishedData: that.data.currentTab == 0 && (data.data == null || data.data.data_list == 0) ? true : false,
                    isNotData: that.data.currentTab == 1 && (data.data == null || data.data.data_list == 0) ? true : false,
                    unfinishedOrderList: that.data.unfinishedOrderListArr,
                    orderList: that.data.orderListArr
                })
                if (that.data.currentTab == 0) {//未完成订单
                    that.data.unfpage++;
                }
                if (that.data.currentTab == 1) {//所有订单
                    that.data.page++;
                }
                console.log(that.data);

            }
        )
    }
    ,
    /**
     * 滑动切换tab
     */
    bindChange: function (e) {
        this.setData({
            currentTab: e.detail.current,
            unfpage: 1,
            page: 1
        });

        this.getOrderList(1);
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        util.swichNav(e, this)


    }
})
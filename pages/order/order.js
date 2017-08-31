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
        hasUnfData: false,
        hasData: false,
        unfinishedOrderList: [],
        orderList: [],
        swiperBoxHeight: wx.getStorageSync('systeminfo').windowHeight-48
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
        if (util.isLoginModal()) return;

        var that = this;
        that.setData({
            unfpage: 1,
            page: 1
        }, function () {
            //获取订单列表
            that.getOrderList(1);
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
     * 关闭订单
     */
    closeOrder: function (e) {
        var that = this;
        util.showModal('收收提示', '您是否要关闭此订单?"是"点击"确定",否则请点击"取消', '确定', '取消', function (res) {
            if (res.confirm) {
                util.https(app.globalData.api + "/api/dengji/cancel/" + e.currentTarget.dataset.orderno, "GET", {},
                    function (data) {
                        if (data.code == 1001) {
                            that.setData({
                                unfpage: 1,
                                page: 1
                            }, function () {
                                //获取订单列表
                                that.getOrderList(1);
                            })

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
     * 去评论
     */
    evaluate: function (e) {
        var items = e.currentTarget.dataset.items;
        wx.navigateTo({
            url: "/pages/order/evaluate?no=" + items.djno + '&type=' + items.type
        })
    },
    /**
     * 获取订单列表
     */
    getOrderList: function (page) {
        var that = this;
        util.https(app.globalData.api + "/api/dengji/getlist/" + page + "/" + 8, "GET", {
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
                isHideLoad: page == 1 ? false : true
            },

            function (data) {
                if (that.data.currentTab == 0 && that.data.unfpage == 1) {
                    that.setData({
                        unfinishedOrderList: []
                    })
                }
                if (that.data.currentTab == 1 && that.data.page == 1) {
                    that.setData({
                        orderList: []
                    })
                }
                for (var index in data.data.data_list) {
                    if (that.data.currentTab == 0) {//未完成订单
                        that.data.unfinishedOrderList.push(data.data.data_list[index]);
                    }
                    if (that.data.currentTab == 1) {//所有订单
                        that.data.orderList.push(data.data.data_list[index]);
                    }
                }

                if (that.data.currentTab == 0) {//未完成订单
                    that.setData({
                        hasUnfData: data.data.page_count <= that.data.unfpage ? false : true,
                        isNotunfinishedData: (data.data == null || data.data.data_list.length == 0) ? true : false,
                        unfinishedOrderList: that.data.unfinishedOrderList.map(function (item) {
                            item.orname = item.type == 1 ? util.hidePartInfo(item.orname, 'name') : item.orname
                            item.addtime = new Date(item.addtime.replace(/T/g, " ").replace(/-/g, "/")).Format("yyyy-MM-dd HH:mm")
                            item.oraddtime = new Date(item.oraddtime.replace(/T/g, " ").replace(/-/g, "/")).Format("yyyy-MM-dd")
                            return item
                        }),
                        orderList: []
                    })
                    that.data.unfpage++;
                }
                if (that.data.currentTab == 1) {//所有订单
                    that.setData({
                        hasData: data.data.page_count <= that.data.page ? false : true,
                        isNotData: (data.data == null || data.data.data_list.length == 0) ? true : false,
                        unfinishedOrderList: [],
                        orderList: that.data.orderList.map(function (item) {
                            item.orname = item.type == 1 && item.orname ? util.hidePartInfo(item.orname, 'name') : item.orname
                            item.addtime = new Date(item.addtime.replace(/T/g, " ").replace(/-/g, "/")).Format("yyyy-MM-dd HH:mm")
                            item.oraddtime = new Date(item.oraddtime.replace(/T/g, " ").replace(/-/g, "/")).Format("yyyy-MM-dd")
                            return item
                        })
                    })
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
        var that = this;
        that.setData({
            currentTab: e.detail.current,
            unfpage: 1,
            page: 1
        }, function () {
            that.getOrderList(1);
        });


    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        util.swichNav(e, this)


    }
})
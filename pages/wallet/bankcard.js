// pages/wallet/bankcard.js
var app = getApp();
var util = require('../../utils/util.js');
var banks = require('../../utils/banks.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        hasData: false,
        bankCardList: []
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
            //获取自己的银行卡列表
            that.getBankCardList(1);
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        var that = this;
        that.setData({
            page: 1
        }, function () {
            //获取自己的银行卡列表
            that.getBankCardList(1);
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasData) {
            return;
        }
        //获取自己的银行卡列表
        this.getBankCardList(this.data.page);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * radio发生change事件
     */
    radioChange: function (e) {
        var that = this;
        //设置默认银行
        util.https(app.globalData.api + "/api/bank/setdefault/" + e.detail.value, "GET", {},
            function (data) {
                if (data.code == 1001) {
                    that.setData({
                        page: 1
                    }, function () {
                        //获取自己的银行卡列表
                        that.getBankCardList(1);
                    })
                } else {
                    util.toolTip(that, data.message)
                }

            }
        )
    },
    /**
     * 选择银行卡
     */
    selectBank: function (e) {
        var arr = getCurrentPages();//获取栈中全部页面的, 然后把数据写入相应页面
        if (arr[arr.length - 2]&&arr[arr.length - 2].route == 'pages/wallet/withdraw') {
            //返回上一页
            wx.navigateBack({
                delta: 1,
                success: function (res) {
                    arr[arr.length - 2].data.selectBank = e.currentTarget.dataset.item;
                }
            })
        }
    },
    /**
     * 获取自己的银行卡列表
     */
    getBankCardList: function (page) {
        var that = this;
        util.https(app.globalData.api + "/api/bank/get_list/" + wx.getStorageSync('userid'), "GET", {
                page: page,//页码
                size: 10,
                isHideLoad: true
            },
            function (data) {
                if (that.data.page == 1) {
                    that.setData({
                        bankCardList: []
                    })
                }

                for (var index in data.data.data_list) {
                    that.data.bankCardList.push(data.data.data_list[index]);
                }

                that.setData({
                    hasData: data.data.page_count <= that.data.page ? false : true,
                    isNotData: (data.data == null || data.data.data_list.length == 0) ? true : false,
                    bankCardList: that.data.bankCardList.map(function (item) {
                        item.logo = "icon-yinhang";
                        item.bgcolor = "#00A0FE";
                        item.accountno = util.hidePartInfo(item.accountno, "bankcard")
                        banks.map(function (items) {
                            if (items.name.indexOf(item.bankname) != -1 || item.bankname.indexOf(items.name) != -1) {
                                item.logo = items.logo;
                                item.bgcolor = items.color;
                            }
                        })
                        return item;
                    })
                })

                that.data.page++;

            }
        )
    }
})
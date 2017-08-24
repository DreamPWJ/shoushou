// pages/index/information.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isth: 1,////是否统货 1是 0否
        productList: [],
        activitytype: [  //活动类型
            {value: 0, name: '无', checked: 'true'}, {value: 1, name: '以旧换新'}
        ],
        imgUrl: app.globalData.imgUrl + '/'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInformationData();
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
     * 获取省市县数据
     */
    getAddressPCCList: function (e) {
        util.getAddressPCCList(this, e.target.dataset.item, 3, function () {

        })
    },
    /**
     * 获取附近地址数据
     */
    getCurrentCity: function (e) {
        util.getCurrentCity(this, 3, function () {

        })
    },
    /**
     * 选择打开附近地址
     */
    getAddressPois: function (e) {
        this.setData({
            isShowSearch: false,
            addressname: e.currentTarget.dataset.items.name
        })
    },
    /**
     * 打开地图选择位置
     */
    chooseLocation: function (e) {
        util.chooseLocation(this, function (data) {

        })
    },
    /**
     * 用户点击checkbox
     */
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        var that = this;
        that.data.productList.map(function (item, index) {
            if (e.detail.value.toString().indexOf(index) != -1) {//选中的
                that.data.productList[index].checked = true;
                that.setData({
                    productList: that.data.productList
                })
            } else {
                that.data.productList[index].checked = false;
                that.setData({
                    productList: that.data.productList
                })
            }

        })


    },
    /**
     * radio发生change事件
     */
    radioChange: function (e) {
        var that = this;
        if (e.target.dataset.current == 0) {
            console.log('活动类型radio发生change事件，携带value值为：', e.detail.value)
        } else if (e.target.dataset.current == 1) {
            console.log('所属厂商类型radio发生change事件，携带value值为：', e.detail.value)
            that.data.manufacteList.map(function (item, index) {
                if (index == e.detail.value) {
                    that.data.manufacteList[index].checked = true;
                    that.setData({
                        manufacteList: that.data.manufacteList
                    })
                } else {
                    that.data.manufacteList[index].checked = false;
                    that.setData({
                        manufacteList: that.data.manufacteList
                    })
                }

            })

        }
    },
    /**
     * 获取参考价格数据
     */
    getInformationData: function () {
        var that = this;
        //获取产品品类
        util.getProductList(that, function (data) {
            if (data.code == 1001) {
                that.setData({
                    productList: data.data
                })

            } else {
                util.toolTip(that, data.message)
            }

        })
        //获取当前位置 省市县数据
        util.getCurrentCity(that, 3, function () {

        })
        //获得所属厂商
        util.https(app.globalData.api + "/api/dengji/getlistmanufacte", "GET", {
                ShorteName: '',
                Name: '',
                GrpID: ''
            },
            function (data) {
                if (data.code == 1001) {
                    that.setData({
                        manufacteList: data.data
                    })
                } else {
                    util.toolTip(that, data.message)
                }
            }
        )
    }
})
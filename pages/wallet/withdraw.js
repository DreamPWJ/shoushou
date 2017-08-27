// pages/wallet/withdraw.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {},

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
     * 获取用户输入
     */
    bindChange: function (e) {
        inputContent[e.currentTarget.id] = e.detail.value;
    },
    /**
     * 用户提现
     */
    withdrawSubmit: function (e) {

        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                money: {  //验证规则 input name值
                    required: true,
                    money: true
                }
            },
            {
                money: { //提示信息
                    required: "请填写提现金额",
                },

            })
        util.wxValidate(e, that, function () {
            //提现
            util.https(app.globalData.api + "/api/subaccount/cash", "POST", {
                    userbankid: "", //银行id
                    userid: wx.getStorageSync("userid"),//用户userid
                    amount: inputContent.money, //金额
                },
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "工作日24小时之内到账", 1);
                        wx.switchTab({
                            url: '/pages/wallet/wallet'
                        })
                    } else {
                        util.toolTip(that, data.message)
                    }

                }
            )
        })


    }
})
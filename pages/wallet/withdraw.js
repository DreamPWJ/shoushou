// pages/wallet/withdraw.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userSum: {
            totalamount: '0.00',
            account: '0.00',
            trzaccount: '0.00',

        },
        showBank: "请添加银行"
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
        //获得我的里面待处理和预警订单数 银行卡以及余额
        util.getUserSum(that, function (data) {

        })
        var selectBank = that.data.selectBank;//上一个银行列表返回数据
        that.setData({
            selectBank: selectBank
        }, function () {
            if (that.data.selectBank) {
                var defaultBank = that.data.selectBank;
                that.setData({
                    defaultBank: defaultBank,
                    showBank: defaultBank.bankname + "(" + defaultBank.accountno.substring(defaultBank.accountno.length - 4) + ")"
                })
            } else {
                //获取默认银行卡
                util.https(app.globalData.api + "/api/bank/get_defualt/" + wx.getStorageSync('userid'), "GET", {},
                    function (data) {
                        if (data.code == 1001) {
                            var defaultBank = data.data;
                            that.setData({
                                defaultBank: defaultBank,
                                showBank: defaultBank.bankname + "(" + defaultBank.accountno.substring(defaultBank.accountno.length - 4) + ")"
                            })
                        }

                    }
                )
            }
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
        this.setData({
            inputmoney: e.detail.value,
            allmoney: undefined
        })
    },
    /**
     * 全部提现
     */
    allWithdrawal: function () {
        var allmoney = this.data.userSum.account.replace(/,/g, '');
        this.setData({
            allmoney: allmoney,
            inputmoney: allmoney
        })
    },
    /**
     * 用户提现
     */
    withdrawSubmit: function (e) {

        var that = this;
        if (!that.data.defaultBank) {
            util.toolTip(that, "没有添加银行卡");
            return;
        }

        //验证表单
        that.WxValidate = new WxValidate({
                money: {  //验证规则 input name值
                    required: true,
                    money: true,
                    min: 3,
                    max: Number(that.data.userSum.account.replace(/,/g, '')),
                }
            },
            {
                money: { //提示信息
                    required: "请填写提现金额",
                    min: "提现金额要大于3元",
                    max: "提现金额不能超过可用金额"
                },

            })
        util.wxValidate(e, that, function () {
            //提现
            util.https(app.globalData.api + "/api/subaccount/cash", "POST", {
                    userbankid: that.data.defaultBank.id, //银行id
                    userid: wx.getStorageSync("userid"),//用户userid
                    amount: that.data.allmoney || inputContent.money, //金额
                },
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "提现成功", 1);
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
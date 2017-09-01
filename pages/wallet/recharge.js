// pages/wallet/recharge.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容

Page({

    /**
     * 页面的初始数据
     */
    data: {
        paytype: [  //支付类型
            {value: 1, name: '微信支付', checked: 'true'},
        ]
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
     * 用户支付
     */
    paymentSubmit: function (e) {
        var that = this;
        if (inputContent.money == 0) {
            util.toolTip(that, "充值金额不能为零")
            return;
        }
        //验证表单
        that.WxValidate = new WxValidate({
                money: {  //验证规则 input name值
                    required: true,
                    money: true
                }
            },
            {
                money: { //提示信息
                    required: "请填写充值金额",
                },

            })
        util.wxValidate(e, that, function () {
            //微信公众号支付
            util.https(app.globalData.api + "/api/aop/wxpay_xcx", "POST", {
                    out_trade_no: new Date().getTime(),//订单号
                    subject: "收收充值",//商品名称
                    body: "收收充值详情",//商品详情
                    total_fee: inputContent.money, //总金额
                    userid: wx.getStorageSync("userid"),//用户userid
                    name: wx.getStorageSync('user').username,//用户名
                    openid: wx.getStorageSync("openid") //微信openid
                },
                function (data) {
                    if (data.code == 1001) {
                        wx.requestPayment({
                            'timeStamp': data.data.timestamp,
                            'nonceStr': data.data.nonce_str,
                            'package': data.data.prepay_id,
                            'signType': 'MD5',
                            'paySign': data.data.sign,
                            'success': function (res) {
                                console.log(res);
                                wx.switchTab({
                                    url: '/pages/wallet/wallet'
                                })
                            },
                            'fail': function (res) {
                                console.log(res);
                            }
                        })

                    } else {
                        util.toolTip(that, data.message)
                    }

                }
            )
        })


    }
})
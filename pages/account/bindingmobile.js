// pages/account/bindingmobile.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        paracont: "获取验证码",//验证码文字
        vcdisabled: true,//验证码按钮状态
        verifycode: ""//返回的验证码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       this.setData({
           status:options.status //认证状态
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
        util.verifyCodeBtn(e, this);
    },
    /**
     * 获取验证码
     */
    getVerifyCode: function (e) {
        var that = this;
        util.getVerifyCode(inputContent['account'], this, function (data) {
            that.setData({
                verifycode: data.data,
                verifyphone: inputContent['account']
            })
        })

    },
    /**
     * 用户提交
     */
    bindingmobileSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                account: {  //验证规则 input name值
                    required: true,
                    tel: true
                },
                verifycode: {
                    required: true,
                },

            },
            {
                account: { //提示信息
                    required: "请填写手机号码",
                },
                verifycode: { //提示信息
                    required: "请填写验证码"
                },

            })


        util.wxValidate(e, that, function () {
            if (that.data.verifycode != inputContent.verifycode) {
                util.toolTip(that, "验证码输入不正确")
                return;
            }
            if (that.data.verifyphone != inputContent.account) {
                util.toolTip(that, "验证码与手机号码不匹配")
                return;
            }

            util.https(app.globalData.api + "/api/user/authenticate_mobile/" + wx.getStorageSync('userid'), "GET", {
                    mobile: inputContent.account	//新用户号码
                },
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "绑定手机号成功", 1, 'back');
                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})
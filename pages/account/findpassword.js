// pages/account/findpassword.js
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
        verifycode: "",//返回的验证码
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
        util.verifyCodeBtn(e, this);
    },
    /**
     * 获取验证码
     */
    getVerifyCode: function (e) {
        var that = this;
        util.getVerifyCode(inputContent['account'], this, function (data) {
            that.setData({
                verifycode: data.data
            })
        })

    },
    /**
     * 用户提交
     */
    findpasswordSubmit: function (e) {
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
                password: {
                    required: true,
                    minlength: 6
                },
                confirmpassword: {
                    required: true,
                    minlength: 6
                },

            },
            {
                account: { //提示信息
                    required: "请填写真实手机号码",
                },
                verifycode: { //提示信息
                    required: "请填写验证码"
                },
                password: { //提示信息
                    required: "请填写密码",
                    minlength: "密码至少输入6个字符"
                },
                confirmpassword: { //提示信息
                    required: "请填写确认密码",
                    minlength: "确认密码至少输入6个字符"
                },

            })


        util.wxValidate(e, that, function () {
            if (inputContent.confirmpassword != inputContent.password) {
                util.toolTip(that, "两次输入的密码不一致")
                return;
            }
            if (that.data.verifycode != inputContent.verifycode) {
                util.toolTip(that, "验证码输入不正确")
                return;
            }
            //提交数据
            var data = {
                account: inputContent.account,
                password: inputContent.password,
                confirmpassword: inputContent.confirmpassword,
                code:inputContent.verifycode
            }
            console.log(data);

            util.https(app.globalData.api + "/api/user/find_password", "POST", data,
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "新密码设置成功", 1, '/pages/account/login');
                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})
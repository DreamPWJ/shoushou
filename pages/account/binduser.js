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
        //获取当前位置 省市县数据
        util.getCurrentCity(this, 2, function (data) {

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
        util.verifyCodeBtn(e, this);
    },
    /**
     * 获取验证码
     */
    getVerifyCode: function (e) {
        var that = this;
        util.getVerifyCode(inputContent['user'], this, function (data) {
            that.setData({
                verifycode: data.data,
                verifyphone: inputContent['user'] //验证的手机号
            })
        })

    },
    /**
     * 用户是否存在
     */
    isUserExist: function () {
/*        var that = this;
        util.https(app.globalData.api + "/api/user/exist/" + inputContent.user, "GET", {},
            function (data) {
                if (data.code == 1001) {
                    util.toolTip(that, "账号已存在,请重新输入");
                    that.setData({
                        vcdisabled: true
                    })
                }
            }
        )*/
    },
    /**
     * 绑定提交
     */
    binduserSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                user: {  //验证规则 input name值
                    required: true,
                    tel: true
                },
                verifycode: {
                    required: true,
                },
                invitecode: {
                    required: that.data.addressone.isinvitecode == "0" ? true : false,
                }
            },
            {
                user: { //提示信息
                    required: "请填写手机号码",
                },
                verifycode: { //提示信息
                    required: "请填写验证码"
                },
                invitecode: { //提示信息
                    required: "请填写邀请码"
                }
            })


        util.wxValidate(e, that, function () {
            /*     console.log(wx.getSystemInfoSync().platform);*/

            if (that.data.verifycode != inputContent.verifycode) {
                util.toolTip(that, "验证码输入不正确")
                return;
            }
            if (that.data.verifyphone != inputContent.user) {
                util.toolTip(that, "验证码与手机号码不匹配")
                return;
            }
            //注册数据
            var register = {
                account: inputContent.user,
                password: "",
                confirmpassword: "",
                code: inputContent.verifycode,
                client: 3,
                openID: wx.getStorageSync("openid"),
                invitecode: inputContent.invitecode,
                services: [1],
                areacode: that.data.addressone.ID
            }
            console.log(register);
            util.https(app.globalData.api + "/api/user/bind_user", "POST", register,
                function (data) {
                    if (data.code == 1001) {
                        wx.setStorageSync("userid", data.data.userid);
                        wx.setStorageSync("usersecret", data.data.usersecret);

                        //接口API授权 type 1.是公共授权  2.登录授权
                        util.authorization(2, function () {
                            util.toolTip(that, "绑定成功", 1, "/pages/index/index", 'reLaunch');//直接登录
                            //根据会员ID获取会员账号基本信息
                            util.getUserInfo(function (data) {

                            })
                        }, true);

                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})
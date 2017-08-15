// pages/account/login.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0    // tab切换
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数

        //删除记住用户信息
        wx.removeStorageSync("userid");
        wx.removeStorageSync("usersecret");
        wx.removeStorageSync("user");
        wx.removeStorageSync("token");
        wx.removeStorageSync("expires_in");
        util.authorization(1, function () {
            //调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid）
            /*            if (!wx.getStorageSync("openid")) { //初次授权登录 获取openid
                            wx.login({
                                success: function (res) {
                                    if (res.code) {
                                        //根据微信Code获取对应的openId
                                        util.https(app.globalData.api + "/api/wc/GetOpenid", "GET", {
                                                code: res.code,
                                                UserLogID: wx.getStorageSync("userid") || ""
                                            },
                                            function (data) {
                                                console.log(data);
                                                if (data.code == 1001) {
                                                    wx.setStorageSync("openid", data.data.OpenId);//微信openid
                                                    wx.setStorageSync("userid", data.data.UserLogID);
                                                    wx.setStorageSync("usersecret", data.data.usersecret);
                                                }

                                            })

                                    } else {
                                        console.log('获取用户登录状态失败！' + res.errMsg);
                                    }
                                }
                            });
                        }*/
        });

        //验证表单
        this.WxValidate = new WxValidate({
                account: {  //验证规则 input name值
                    required: true,
                    tel: true
                },
                password: {
                    required: true,
                    minlength: 6,
                    maxlength: 18
                },
            },
            {
                account: { //提示信息
                    required: "请填写真实手机号码",
                },
                password: { //提示信息
                    required: "请填写密码",
                    minlength: "密码至少输入6个字符",
                    maxlength: "密码最多输入18个字符"
                }
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
        inputContent[e.currentTarget.id] = e.detail.value
    },
    /**
     * 登录提交
     */
    loginSubmit: function (e) {
        util.wxValidate(e, this.WxValidate);
        /*     console.log(wx.getSystemInfoSync().platform);*/
        //用户登录
        util.https(app.globalData.api + "/api/user/login", "POST", {
                account: inputContent.account,
                password: inputContent.password,
                client: 0,
                openID: wx.getStorageSync("openid")
            },
            function (data) {
                console.log(data);
            }
        )
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    }
})
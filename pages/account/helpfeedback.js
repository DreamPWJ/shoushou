// pages/account/helpfeedback.js
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
     * 用户提交
     */
    helpfeedbackSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                title: {  //验证规则 input name值
                    required: true
                },
                content: {  //验证规则 input name值
                    required: true
                },

            },
            {
                title: { //提示信息
                    required: "请填写反馈标题",
                },
                content: { //提示信息
                    required: "请填详细反馈描述",
                },

            })
        util.wxValidate(e, that, function () {

            var data = {
                userid: wx.getStorageSync('userid'),
                Title: inputContent.title,
                Content: inputContent.content,
            }
            util.https(app.globalData.api + "/api/AboutUs/addincollect", "POST", data,
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "提交反馈成功", 1, 'back')
                    } else {
                        util.toolTip(that, data.message)
                    }
                }
            )
        });
    }
})
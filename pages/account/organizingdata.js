// pages/account/organizingdata.js
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
     * 完善资料提交
     */
    organizingdataSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                shopname: {
                    required: true,
                },
                addrdetail: {
                    required: true,
                },
                user: {  //验证规则 input name值
                    required: true,
                    tel: true
                }
            },
            {

                shopname: { //提示信息
                    required: "请填写工作单位"
                },
                addrdetail: { //提示信息
                    required: "请填写详细地址"
                },
                user: { //提示信息
                    required: "请填写真实手机号码",
                }
            })


        util.wxValidate(e, that, function () {
            util.https(app.globalData.api + "/api/user/set_info", "POST", {
                    services: [1],
                    userid: wx.getStorageSync("userid"),
                    mobile: wx.getStorageSync("user").mobile,
                    shopname: inputContent.shopname,
                    addrdetail:inputContent.addrdetail,
                    addrcode:"",
                    img:"",
                },
                function (data) {
                    if (data.code == 1001) {

                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})
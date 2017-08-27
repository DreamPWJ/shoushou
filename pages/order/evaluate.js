// pages/order/evaluate.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        evaluateinfo: {
            star: 5
        }
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
     * 用户综合评价
     */
    evaluatestar: function (e) {
        this.setData({
            evaluateinfo: {
                star: e.currentTarget.dataset.start
            }
        })
    },
    /**
     * 用户提交
     */
    evaluateSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                remark: {  //验证规则 input name值
                    required: false
                },
            },
            {
                remark: { //提示信息
                    required: "请填写评价内容",
                },

            })
        util.wxValidate(e, that, function () {

            var data = {
                id: "",//编号
                djno: that.data.no,//登记单号
                type: that.data.type,//订单类型 1-	登记信息 2-	登记货源
                userid: wx.getStorageSync('userid'),//评论人
                score: that.data.evaluateinfo.star,//综合评分 1．1颗星 5. 5颗星（默认）
                service: that.data.evaluateinfo.service,//服务态度 1．	满意（默认） 2．	一般3．	差
                tranprice: that.data.evaluateinfo.tranprice,//交易价格 1．	合理（默认） 2．	一般3．	差
                updatetime: "",//最后修改时间
                remark: inputContent.remark || ""
            }
            util.https(app.globalData.api + "/api/dengji/comment", "POST", data,
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "提交评价成功", 1, 'back')
                    } else {
                        util.toolTip(that, data.message)
                    }
                }
            )
        });
    }
})
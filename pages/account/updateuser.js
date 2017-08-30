// pages/account/updateuser.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sexArr: [{value: 0, name: '保密'}, {value: 1, name: '男'}, {value: 2, name: '女'}]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            sex:options.sex
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
     * radio发生change事件
     */
    radioChange: function (e) {
        console.log('用户类型radio发生change事件，携带value值为：', e.detail.value)
        this.setData({
            sex: e.detail.value
        })
    },
    /**
     * 用户提交
     */
    updateuserSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate(
        )

        util.wxValidate(e, that, function () {
            util.https(app.globalData.api + "/api/user/modify_sex/" + wx.getStorageSync('userid') + "/" + (that.data.sex || 0), "POST", {
                },
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "性别修改成功", 1, 'back');
                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})
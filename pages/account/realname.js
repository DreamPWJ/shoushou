// pages/account/realname.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        filename: 'User',
        imageList: [],//本地路径
        imgsPicAddr: [],//真实服务器图片信息数组
        uploadtype: 4,//上传媒体操作类型 1.卖货单 2 供货单 3 买货单 4身份证 5 头像
        imgUrl: app.globalData.api + '/images/realname.png' //实名认证示例图片
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            status: options.status
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
        var that = this;
        //获取实名认证信息
        if (this.data.status == 2) {
            wx.setNavigationBarTitle({
                title: "实名认证信息"
            })
            util.https(app.globalData.api + "/api/user/get_identity/" + wx.getStorageSync('userid'), "GET", {},
                function (data) {
                    if (data.code == 1001) {
                        that.setData({
                            realname: data.data
                        })
                    } else {
                        util.toolTip(that, data.message)
                    }
                }
            )
        } else if (this.data.status == 1) {
            wx.setNavigationBarTitle({
                title: "修改实名认证"
            })
        }
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
     * 上传图片
     */
    uploadActionSheet: function (e) {
        util.uploadActionSheet(this, function () {

        })
    },
    /**
     * 预览图片
     */
    previewImage: function (e) {
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [e.currentTarget.dataset.imgurl] // 需要预览的图片http链接列表
        })
    },
    /**
     * 删除图片
     */
    deleteImg: function () {
        this.setData({
            imageList: [],//本地路径
            imgsPicAddr: [],//真实服务器图片信息数组
        })
    },
    /**
     * 用户提交实名认证
     */
    realnameSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                name: {  //验证规则 input name值
                    required: true
                },
                idno: {  //验证规则 input name值
                    required: true,
                    idcard: true
                },

            },
            {
                name: { //提示信息
                    required: "请填写真实姓名",
                },
                idno: { //提示信息
                    required: "请填真实身份证号码",
                },

            })
        util.wxValidate(e, that, function () {
            if (that.data.imageList.length == 0) {
                util.toolTip(that, "请先上传认证照片后再提交");
                return;
            }
            var data = {
                userid: wx.getStorageSync('userid'),
                name: inputContent.name,
                idno: inputContent.idno,
                frontpic: that.data.imgsPicAddr[0]
            }
            util.https(app.globalData.api + "/api/user/authenticate_idcard", "POST", data,
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "实名认证提交成功", 1, 'back')
                    } else {
                        util.toolTip(that, data.message)
                    }
                }
            )

        });
    }
})
// pages/account/organizingdata.js
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
        util.getCurrentCity(this, 3, function (data) {

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
        //附近搜索
        if (e.currentTarget.id == 'serachcontent') {
            util.getSearchAddress(this, e.detail.value, function () {

            })
        }
    },
    /**
     * 获取省市县数据
     */
    getAddressPCCList: function (e) {
        util.getAddressPCCList(this, e.target.dataset.item, 3, function () {

        })
    },
    /**
     * 获取附近地址数据
     */
    getCurrentCity: function (e) {
        util.getCurrentCity(this, 3, function () {

        })
    },
    /**
     * 选择打开附近地址
     */
    getAddressPois: function (e) {
        this.setData({
            isShowSearch: false,
            addressname: e.currentTarget.dataset.items.name
        })
    },
    /**
     * 打开地图选择位置
     */
    chooseLocation: function (e) {
        util.chooseLocation(this, function (data) {

        })
    },
    /**
     * 上传图片
     */
    uploadActionSheet: function (e) {
        util.uploadActionSheet(this, function () {

        })
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
            if (that.data.imageList.length == 0) {
                util.toolTip(that, "请先上传工作证照片后再提交");
                return;
            }
            util.https(app.globalData.api + "/api/user/set_info", "POST", {
                    services: [1],
                    userid: wx.getStorageSync("userid"),
                    mobile: wx.getStorageSync("user").mobile,
                    shopname: inputContent.shopname,
                    addrdetail: inputContent.addrdetail || that.data.addressname,//地址详情
                    addrcode: that.data.addressone.ID,
                    areacode: that.data.addressone.Code,
                    img: that.data.imageList[0],
                },
                function (data) {
                    if (data.code == 1001) {
                        util.getUserInfo(function (data) {
                            var user = wx.getStorageSync('user');
                            if (user.certstate.substr(3, 1) != 2) { //没有实名认证
                                util.toolTip(that, "完善资料提交成功", 1, "/pages/account/realname?status=0");
                            } else {
                                util.toolTip(that, "完善资料提交成功", 1, "/pages/index/index");
                            }
                        })

                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})
// pages/wallet/addbankcard.js
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
        verifycode: "",//返回的验证码,
        isdefault: 1 //默认
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
        var user = wx.getStorageSync('user');
        if (user.certstate.substr(3, 1) != 2) { //没有实名认证
            util.showModal('收收提示', '尊敬的用户,您好！为了您的账户安全，请先进行实名认证！', '实名认证', '暂不认证', function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/account/realname'
                    })
                } else if (res.cancel) {
                    //返回上一页
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
            return;
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
        util.verifyCodeBtn(e, this);
    },
    /**
     * 获取验证码
     */
    getVerifyCode: function (e) {
        var that = this;
// 获取用户个人实名认证信息
        var personsign = {};
        util.https(app.globalData.api + "/api/user/get_identity/" + wx.getStorageSync('userid'), "GET", {},
            function (data) {
                if (data.data != null) {
                    personsign = {
                        cardno: inputContent.accountno,
                        idno: data.data.idno,
                        mobile: inputContent.account,
                        name: data.data.name
                    }
                    that.setData({
                        accountname: data.data.name
                    })
                } else {
                    util.toolTip(that, "为了您的账户安全，实名认证后再添加银行卡");
                }
            }
        ).then(function () {
//发送实名认证码，返回实名认证服务id
            util.https(app.globalData.api + "/api/user/authenticate_sign", "POST", personsign,
                function (data) {
                    if (data.data.errCode == "0") {
                        that.setData({
                            serviceid: data.data.serviceId,
                        })
                    } else {
                        util.toolTip(that, "发送认证短信失败，请核实银行卡信息");
                    }
                }
            ).then(function () {
                util.getVerifyCode("", that, function (data) {

                })
            })
        })


    },
    /**
     * switch触发
     */
    switchChange: function (e) {
        console.log('switch 发生 change 事件，携带值为', e.detail.value)
        this.setData({
            isdefault: e.detail.value ? 1 : 0
        })

    },
    /**
     * 焦点失去 根据输入的银行卡号获取银行信息
     */
    getBankinfo: function () {
        var that = this;
        if (inputContent.accountno && inputContent.accountno.length > 15) {
            util.https(app.globalData.api + "/api/bank/get_cardinfo/" + inputContent.accountno, "GET", {},
                function (data) {
                    if (data.code == 1001) {
                        that.setData({
                            bankname:data.data.issname
                        })
                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        }
    },
    /**
     * 用户提交
     */
    addbankcardSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                accountno: {
                    required: true,
                    minlength: 16
                },
                bankname: {
                    required: true,
                    minlength: 4
                },
                branchname: {
                    required: true,
                    minlength: 4
                },
                account: {  //验证规则 input name值
                    required: true,
                    tel: true
                },
                verifycode: {
                    required: true,
                },


            },
            {
                accountno: { //提示信息
                    required: "请填写银行卡号",
                    minlength: "银行卡号至少输入16位"
                },
                bankname: { //提示信息
                    required: "请填写银行名称",
                    minlength: "银行名称至少输入4个字符"
                },
                branchname: { //提示信息
                    required: "请填写支行名称",
                    minlength: "支行名称至少输入4个字符"
                },
                account: { //提示信息
                    required: "请填写预留手机号码",
                },
                verifycode: { //提示信息
                    required: "请填写验证码"
                },


            })


        util.wxValidate(e, that, function () {

            //提交数据
            var data = {
                id: 0, 	// id
                bankname:that.data.bankname||inputContent.bankname,	//银行名称
                userid: wx.getStorageSync("userid"),	//用户id
                branchname: inputContent.branchname,	//支行名称
                accountno: inputContent.accountno,	//银行帐号
                accountname: that.data.accountname,	//开户人名称
                isdefault: that.data.isdefault, 	//是否默认0-	否（默认值）1-	是
                serviceid: that.data.serviceid,
                code: inputContent.verifycode
            }
            console.log(data);

            util.https(app.globalData.api + "/api/bank/add", "POST", data,
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "添加银行卡成功", 1, 'back');
                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})
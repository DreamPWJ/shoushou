// pages/wallet/withdraw.js
var app = getApp();
var util = require('../../utils/util.js');
var banks = require('../../utils/banks.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showChoosePay: false, //显示选择提现方式
    userSum: {
      totalamount: '0.00',
      account: '0.00',
      trzaccount: '0.00',
    },
    showBank: "请添加银行",
    userbankid:undefined,
    channel:1,
    banklist: [] //银行列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;
    //获得我的里面待处理和预警订单数 银行卡以及余额
    util.getUserSum(that, function (data) {

    })

    util.getBankList(that, { page: 1, size: 5, no: "" }, function (res) {
      if (res.code == 1001) {
        console.log(res)
        res.data.data_list.map(function (item) {
          item.showBank = item.bankname + "(" + item.accountno.substring(item.accountno.length - 4) + ")"
          item.logo = "icon-yinhang";
          item.bgcolor = "#00A0FE";
          item.accountno = util.hidePartInfo(item.accountno, "bankcard")

          banks.map(function (items) {
            if (items.name.indexOf(item.bankname) != -1 || item.bankname.indexOf(items.name) != -1) {
              item.logo = items.logo;
              item.bgcolor = items.color;
            }
          })
          return item;
        })
        that.setData({
          banklist: res.data.data_list
        })
      }
    })
  },
  /**
   * 选择提现方式
   */
  choosePay:function(e){
    var that=this
    var pamars = {
      userid: wx.getStorageSync("userid"),//用户userid
      amount: that.data.allmoney || inputContent.money, //金额
    }

    //微信提现
    if (e.currentTarget.dataset.channel==3){
      pamars.userbankid = wx.getStorageSync("openid") 
      pamars.channel=3
    }else{
      pamars.userbankid = e.currentTarget.dataset.id
      pamars.channel = 1
    }
    //关闭选择框
    that.closePop()
    //提现
    util.https(app.globalData.api + "/api/subaccount/cash", "POST", pamars,
      function (data) {
        if (data.code == 1001) {
          util.toolTip(that, "提现成功", 1, 'back');
          /*          wx.switchTab({
                        url: '/pages/wallet/wallet'
                    })*/
        } else {
          util.toolTip(that, data.message)
        }
      }
    )
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
    this.setData({
      inputmoney: e.detail.value,
      allmoney: undefined
    })
  },
  /**
   * 全部提现
   */
  allWithdrawal: function () {
    var allmoney = this.data.userSum.account.replace(/,/g, '');
    this.setData({
      allmoney: allmoney,
      inputmoney: allmoney
    })
  },
  /**
   * 用户提现
   */
  withdrawSubmit: function (e) {
    var that = this;
    //if (!that.data.defaultBank) {
    //  util.toolTip(that, "没有添加银行卡");
    //  return;
    //}

    //验证表单
    that.WxValidate = new WxValidate({
      money: {  //验证规则 input name值
        required: true,
        money: true,
        min: 10,
        max: Number(that.data.userSum.account.replace(/,/g, '')),
      }
    },
      {
        money: { //提示信息
          required: "请填写提现金额",
          min: "提现金额要大于10元",
          max: "提现金额不能超过可用金额"
        },

      })
    util.wxValidate(e, that, function () {
      that.setData({
        showChoosePay: true
      })
    })
  },
  /**
   * 关闭弹窗
   */
  closePop: function () {
    this.setData({
      showChoosePay: false
    })
  }
})
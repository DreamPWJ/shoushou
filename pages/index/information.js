// pages/index/information.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isth: 1,////是否统货 1是 0否
        acttype: 0,// 活动类型 0 无 1以旧换新
        productList: [],
        activitytype: [  //活动类型
            {value: 0, name: '无', checked: true}, {value: 1, name: '以旧换新'}
        ],
        imgUrl: app.globalData.imgUrl + '/'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInformationData();
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
        //是否登录
        if (util.isLoginModal()) return;
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
     * 用户点击checkbox
     */
    checkboxChange: function (e) {
        var that = this;
        that.data.productList.map(function (item, index) {
            if (e.detail.value.toString().indexOf(index) != -1) {//选中的
                that.data.productList[index].checked = true;
                that.setData({
                    productList: that.data.productList
                })
            } else {
                that.data.productList[index].checked = false;
                that.setData({
                    productList: that.data.productList
                })
            }

        })


    },
    /**
     * radio发生change事件
     */
    radioChange: function (e) {
        var that = this;
        if (e.target.dataset.current == 0) {
            that.data.activitytype.map(function (item, index) {
                if (index == e.detail.value) {
                    that.data.activitytype[index].checked = true;
                } else {
                    that.data.activitytype[index].checked = false;
                }
            })
            that.setData({
                activitytype: that.data.activitytype,
                acttype: e.detail.value
            })
        } else if (e.target.dataset.current == 1) {
            that.data.manufacteList.map(function (item, index) {
                if (index == e.detail.value) {
                    that.data.manufacteList[index].checked = true;
                    that.setData({
                        manufacteList: that.data.manufacteList
                    })
                } else {
                    that.data.manufacteList[index].checked = false;
                    that.setData({
                        manufacteList: that.data.manufacteList
                    })
                }

            })

        }
    },
    /**
     * 获取用户输入
     */
    bindChange: function (e) {
        inputContent[e.currentTarget.id] = e.detail.value;
    },
    /**
     * 获取参考价格数据
     */
    getInformationData: function () {
        var that = this;
        //获取产品品类
        util.getProductList(that, function (data) {
            if (data.code == 1001) {
                that.setData({
                    productList: data.data
                })

            } else {
                util.toolTip(that, data.message)
            }

        })
        //获取当前位置 省市县数据
        util.getCurrentCity(that, 3, function (data) {

        })
        //获得所属厂商
        util.https(app.globalData.api + "/api/dengji/getlistmanufacte", "GET", {
                ShorteName: '',
                Name: '',
                GrpID: ''
            },
            function (data) {
                if (data.code == 1001) {
                    that.setData({
                        manufacteList: data.data
                    })
                } else {
                    util.toolTip(that, data.message)
                }
            }
        )
    },
    /**
     * 登记信息数据提交
     */
    informationSubmit: function (e) {
        var that = this;
        if (that.data.acttype == 1) {//当用户选择“以旧换新”时，先判断用户有没有“完善信息”和“实名认证”，如果没有则必须先“完善信息”和“实名认证”
            var user = wx.getStorageSync('user');
            if (user.services == null || user.services.length == 0) { //没有完善信息
                util.showModal('登记提示', '尊敬的用户,您好！选择以旧换新类型必须先完善资料后才能操作！', '完善资料', '暂不完善', function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/account/organizingdata'
                        })
                    }
                })
                return;
            }
            if (user.certstate.substr(3, 1) != 2) { //没有实名认证
                util.showModal('登记提示', '尊敬的用户,您好！选择以旧换新类型必须先实名认证后才能操作！', '实名认证', '暂不认证', function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/account/realname'
                        })
                    }
                })

                return;
            }
        }

        //验证表单
        that.WxValidate = new WxValidate({
                name: {  //验证规则 input name值
                    required: true
                },
                motel: {  //验证规则 input name值
                    required: true,
                    tel: true
                },
                addrdetail: {
                    required: true
                }
            },
            {
                name: { //提示信息
                    required: "请填写姓名",
                },
                motel: { //提示信息
                    required: "请填写手机号码",
                },
                addrdetail: { //提示信息
                    required: "请填写地址详细信息",
                }
            })
        util.wxValidate(e, that, function () {
            var productList = [];//选中的品类数组
            var recyclingCategoryName = [];//回收品类名字数组
            var details = [];//登记信息详情
            that.data.productList.map(function (item, index) {
                if (item.checked) {
                    productList.push(item);
                    recyclingCategoryName.push(item.name);
                    item.details.map(function (items) {
                        details.push({
                            num: 1,//台数
                            grpid: items.grpid,//品类ID
                            proid: items.id,//产品ID
                            proname: items.name,//产品名称
                            unit: items.unit//单位ID
                        })
                    })
                }
            })
            if (productList.length == 0) {
                util.toolTip(that, "请选择品类再提交")
                return;
            }
            var manufactor = [];//厂商 单选
            that.data.manufacteList.map(function (item) {
                if (item.checked) {
                    manufactor.push(item.id);
                }
            })

            //登记提交数据
            var dengji = [{
                type: 1,//类型 1.	登记信息 2.	登记货源
                hytype: 0,//物类别 0.未区分 1废料 2二手 (登记信息时为0)
                userid: wx.getStorageSync('userid'),//登记人userid
                name: inputContent.name,//姓名
                motel: inputContent.motel,//手机
                addrdetail: inputContent.addrdetail || that.data.addressname,//地址详情
                acttype: that.data.acttype || 0,// 活动类型 0 无 1以旧换新
                longitude: that.data.longitude || that.data.handlongitude || wx.getStorageSync('longitude') || 0,//经度
                latitude: that.data.latitude || that.data.handlatitude || wx.getStorageSync('longitude') || 0,//纬度
                category: recyclingCategoryName.join(","),//货物品类 多个用逗号隔开
                manufactor: manufactor.join(","),//单选 所属厂商
                addrcode: that.data.addressone ? that.data.addressone.ID : 0,//地址code
                delivery: 1, //交货方式 1 上门回收(默认) 2 送货上门 登记信息直接用1
                details: details
            }];

            util.https(app.globalData.api + "/api/dengji/create", "POST", dengji,
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "登记信息提交成功", 1, '/pages/order/order', 'redirect')
                    } else {
                        util.toolTip(that, data.message)
                    }


                }
            )


        });

    }

})
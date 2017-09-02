// pages/wallet/bankcard.js
var app = getApp();
var util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        hasData: false,
        bankCardList: [],
        bankJsonArr: [{"name": "花旗银行", "logo": "icon-huaqiyinhang", "color": "#2f2267"}, {
            "name": "杭州银行",
            "logo": "icon-hangzhouyinhang",
            "color": "#00a5d7"
        }, {"name": "宁波银行", "logo": "icon-ningboyinhang", "color": "#f19339"}, {
            "name": "南京银行",
            "logo": "icon-nanjingyinhang",
            "color": "#d70812"
        }, {"name": "民生银行", "logo": "icon-minshengyinhang", "color": "#0070bf"}, {
            "name": "江西银行",
            "logo": "icon-jiangxiyinhang",
            "color": "#109988"
        }, {"name": "徽商银行", "logo": "icon-huishangyinhang", "color": "#c01c23"}, {
            "name": "江苏银行",
            "logo": "icon-jiangsuyinhang",
            "color": "#d5ab44"
        }, {"name": "广州农村商业银行", "logo": "icon-guangzhounongcunshangyeyinhang", "color": "#f9be08"}, {
            "name": "广州银行",
            "logo": "icon-guangzhouyinhang",
            "color": "#ad232b"
        }, {"name": "哈尔滨银行", "logo": "icon-haerbinyinhang", "color": "#333333"}, {
            "name": "河北银行",
            "logo": "icon-hebeiyinhang",
            "color": "#e2680f"
        }, {"name": "广发银行", "logo": "icon-guangfayinhang", "color": "#be1d1f"}, {
            "name": "汉口银行",
            "logo": "icon-hankouyinhang",
            "color": "#008aae"
        }, {"name": "北京银行", "logo": "icon-beijingyinhang", "color": "#e3131b"}, {
            "name": "光大银行",
            "logo": "icon-guangdayinhang",
            "color": "#6a1684"
        }, {"name": "包商银行", "logo": "icon-baoshangyinhang", "color": "#333333"}, {
            "name": "成都银行",
            "logo": "icon-chengduyinhang",
            "color": "#f39800"
        }, {"name": "重庆农村商业银行", "logo": "icon-zhongqingnongcunshangyeyinhang", "color": "#333333"}, {
            "name": "长沙银行",
            "logo": "icon-changshayinhang",
            "color": "#ed2024"
        }, {"name": "重庆银行", "logo": "icon-zhongqingyinhang", "color": "#333333"}, {
            "name": "渣打银行",
            "logo": "icon-zhadayinhang",
            "color": "#0071b0"
        }, {"name": "平安银行", "logo": "icon-pinganyinhang", "color": "#ff3204"}, {
            "name": "上饶银行",
            "logo": "icon-shangraoyinhang",
            "color": "#f6ab00"
        }, {"name": "乌鲁木齐商业银行", "logo": "icon-wulumuqishangyeyinhang", "color": "#f6ab00"}, {
            "name": "兴业银行",
            "logo": "icon-xingyeyinhang",
            "color": "#004186"
        }, {"name": "温州银行", "logo": "icon-wenzhouyinhang", "color": "#ef9b2c"}, {
            "name": "上海银行",
            "logo": "icon-shanghaiyinhang",
            "color": "#ffb200"
        }, {"name": "浦发银行", "logo": "icon-pufayinhang", "color": "#2d5082"}, {
            "name": "天津银行",
            "logo": "icon-tianjinyinhang",
            "color": "#005bab"
        }, {"name": "盛京银行", "logo": "icon-shengjingyinhang", "color": "#e32526"}, {
            "name": "招商银行",
            "logo": "icon-zhaoshangyinhang",
            "color": "#e31e25"
        }, {"name": "邮政银行", "logo": "icon-youzhengyinhang", "color": "#007047"}, {
            "name": "中国银行",
            "logo": "icon-zhongguoyinhang",
            "color": "#b81c22"
        }, {"name": "工商银行", "logo": "icon-gongshangyinhang", "color": "#e50012"}, {
            "name": "交通银行",
            "logo": "icon-03010000",
            "color": "#1d2087"
        }, {"name": "华夏银行", "logo": "icon-huaxiayinhang", "color": "#e50012"}, {
            "name": "中信银行",
            "logo": "icon-zhongxinyinhang",
            "color": "#bc1d21"
        }, {"name": "建设银行", "logo": "icon-jiansheyinhang", "color": "#0066b3"}, {
            "name": "农业银行",
            "logo": "icon-nongyeyinhang",
            "color": "#349080"
        }, {"name": "default", "logo": "icon-yinhang", "color": "#4e8bed"}]
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
        var that = this;
        that.setData({
            page: 1
        }, function () {
            //获取自己的银行卡列表
            that.getBankCardList(1);
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
        var that = this;
        that.setData({
            page: 1
        }, function () {
            //获取自己的银行卡列表
            that.getBankCardList(1);
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasData) {
            return;
        }
        //获取自己的银行卡列表
        this.getBankCardList(this.data.page);
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
        var that = this;
        //设置默认银行
        util.https(app.globalData.api + "/api/bank/setdefault/" + e.detail.value, "GET", {},
            function (data) {
                if (data.code == 1001) {
                    that.setData({
                        page: 1
                    }, function () {
                        //获取自己的银行卡列表
                        that.getBankCardList(1);
                    })
                } else {
                    util.toolTip(that, data.message)
                }

            }
        )
    },
    /**
     * 选择银行卡
     */
    selectBank: function (e) {
        var arr = getCurrentPages();//获取栈中全部页面的, 然后把数据写入相应页面
        console.log(arr);
        if (arr[arr.length - 2]&&arr[arr.length - 2].route == 'pages/wallet/withdraw') {
            //返回上一页
            wx.navigateBack({
                delta: 1,
                success: function (res) {
                    arr[arr.length - 2].data.selectBank = e.currentTarget.dataset.item;
                }
            })
        }
    },
    /**
     * 获取自己的银行卡列表
     */
    getBankCardList: function (page) {
        var that = this;
        util.https(app.globalData.api + "/api/bank/get_list/" + wx.getStorageSync('userid'), "GET", {
                page: page,//页码
                size: 10,
                isHideLoad: true
            },
            function (data) {
                if (that.data.page == 1) {
                    that.setData({
                        bankCardList: []
                    })
                }

                for (var index in data.data.data_list) {
                    that.data.bankCardList.push(data.data.data_list[index]);
                }

                that.setData({
                    hasData: data.data.page_count <= that.data.page ? false : true,
                    isNotData: (data.data == null || data.data.data_list.length == 0) ? true : false,
                    bankCardList: that.data.bankCardList.map(function (item) {
                        item.logo = "icon-yinhang";
                        item.bgcolor = "#00A0FE";
                        item.accountno = util.hidePartInfo(item.accountno, "bankcard")
                        that.data.bankJsonArr.map(function (items) {
                            if (items.name.indexOf(item.bankname) != -1 || item.bankname.indexOf(items.name) != -1) {
                                item.logo = items.logo;
                                item.bgcolor = items.color;
                            }
                        })
                        return item;
                    })
                })

                that.data.page++;

            }
        )
    }
})
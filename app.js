//app.js
App({
    onLaunch: function () {
        //启动时执行的初始化工作 全局只触发一次
        //存储当前经纬度地址到本地缓存
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                wx.setStorageSync("longitude", res.longitude);//经度
                wx.setStorageSync("latitude", res.latitude);//纬度
            }
        })
    },
    /**
     * 获取微信用户信息
     * @param cb
     */
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    wx.setStorageSync("wxUserInfo", res.userInfo);//用户微信数据
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },

    globalData: {
        api: "https://hs.api.boolv.com",//接口服务地址
        imgUrl: "http://f.boolv.com",//图片服务地址
        mobApi: "https://s.boolv.com",//手机服务地址
        gaoDeKey: '972cafdc2472d8f779c5274db770ac22',//高德web API服务key
        version: '0.1.0' //当前版本号
    }
})

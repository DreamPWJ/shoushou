//app.js
App({
  onLaunch: function () {
    //启动时执行的初始化工作 全局只触发一次
    wx.getSetting({
      success:function(res){
        if (!res.authSetting["scope.userLocation"]){
          wx.authorize({
            scope: 'scope.userLocation',
          })
        }
      }
    })
    //存储当前经纬度地址到本地缓存
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.setStorageSync("longitude", res.longitude);//经度
        wx.setStorageSync("latitude", res.latitude);//纬度
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: '获取定位失败，请确认是否开启定位功能',
          success:function(res){
            
          }
        })
      }
    })
    
    //监听网络状态变化
    wx.onNetworkStatusChange(function (res) {
      if (res.isConnected) {
        if (res.networkType == '2g')
          wx.showModal({
            title: '提示',
            content: '当前2G网络 为了不影响您使用 请切换4G或wifi',
            showCancel:false,
            success: function (res) {

            }
          })
      } else {
        wx.showModal({
          title: '提示',
          content: '网络无法连接 请检查网络设置',
          showCancel: false,
          success: function (res) {

          }
        })
      }

    })
    //同步获取系统信息
    try {
      var res = wx.getSystemInfoSync()
      wx.setStorageSync("systeminfo", res);//系统信息
    } catch (e) {
      // Do something when catch error
    }
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
    imgUrl: "http://f.boolv.com/",//图片服务地址
    mobApi: "https://s.boolv.com",//手机服务地址
    gaoDeKey: '076dd929f543c472de666e2bcad604b5',//高德web API服务key
    version: '0.9.7' //当前版本号
  }
})

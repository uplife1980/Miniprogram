//app.js

var Url = require('url.js');
App({
  globalData: {
    userid : ""
  },
  onLaunch: function () {
    var Url = require('url.js');
    var that=this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx09392aba647dbe03&secret=650307c831d52a8629fee1a5c0358881&js_code='+res.code+'&grant_type=authorization_code',
            header: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            success: function (res) {
              if(res.data.openid!=null){
                that.globalData.openId = res.data.openid;
                wx.request({
                  url: Url.Url() +'user/register',
                  data: {
                    userid: res.data.openid
                  },
                  header: {},
                  success: function (res) {
                  }
                })
              }else{
                console.log(res.data.errcode+" : "+res.data.errmsg);
              } 
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }else{
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId:null
  
  }
  
})
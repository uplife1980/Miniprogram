//app.js

var Url = require('url.js');
App({
  globalData: {
    userid : "",
    userInfo: null
  },
  onLaunch: function () {
    var Url = require('url.js');
    var that=this
  
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
   
  },
  globalData: {
    openId:null,
    
  }
  
})
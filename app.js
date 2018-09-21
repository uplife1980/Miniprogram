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
    wx.showTabBarRedDot({
      index:1
    })
    //新版本去除了getUserInfo
    // wx.getUserInfo({
    //   success:function(res){
        
    //     that.globalData.userInfo=res.userInfo
        
    //   }
    // })    
  
    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          wx.request({
            url: Url.Url()+'user/exchange',
            header:{
              'Content-Type': 'application/json'
            },
            data:{
              code:res.code
            },
            method: "GET",
            success:function(back){
              console.log(back)
                if(back.data.status==1){
                  that.globalData.openId = back.data.openid;
                
                wx.request({
                  url: Url.Url() +'user/register',
                  data: {
                    userid: back.data.openid
                  },
                  header: {},
                  success: function (res) {
                  }
                })
                }
            }
          })
          // console.log(res.code)
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx09392aba647dbe03&secret=650307c831d52a8629fee1a5c0358881&js_code='+res.code+'&grant_type=authorization_code',
          //   header: {
          //     'Content-Type': 'application/json'
          //   },
          //   method: "POST",
          //   success: function (res) {
          //     if(res.data.openid!=null){
          //       that.globalData.openId = res.data.openid;
          //       wx.request({
          //         url: Url.Url() +'user/register',
          //         data: {
          //           userid: res.data.openid
          //         },
          //         header: {},
          //         success: function (res) {
          //         }
          //       })
          //     }else{
          //       console.log(res.data.errcode+" : "+res.data.errmsg);
          //     } 
          //   },
          //   fail: function (res) { },
          //   complete: function (res) { },
          // })
        }else{
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
   
  },
  
})
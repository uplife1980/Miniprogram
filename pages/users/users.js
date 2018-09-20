//index.js
//获取应用实例
var app = getApp()

Page({
  data:{
    userInfo:null
  },
  onLoad:function(){
    wx.showShareMenu()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else  {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    }
  },
  showList:function() {
   
    wx.showActionSheet({
      // itemList: ['正在租用的书','租期已到的书','您发布的图书','购买的图书'],
      itemList: ['发布的图书', '购买的图书','被预定的图书'],
      success:function(res){
        wx.navigateTo({
          url: '../mybook/mybook?hidelist='+res.tapIndex,
        })
      }
    })
  }
  
})

//index.js
//获取应用实例
const app = getApp()
function jump(link){
  
}
Page({
  data: {
    userInfo: {},
    hasUserInfo: false
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../detail/detail'
  //   })
  // },
  onLoad: function () {
  },
  getUserInfo: function (e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
    })
  }
})

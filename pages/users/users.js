//index.js
//获取应用实例
const app = getApp()
function jump(link){
  
}
Page({
  showList:function() {
    wx.showActionSheet({
      // itemList: ['正在租用的书','租期已到的书','您发布的图书','购买的图书'],
      itemList: ['您发布的图书', '购买的图书'],
      success:function(res){
        wx.navigateTo({
          url: '../mybook/mybook?hidelist='+res.tapIndex,
        })
      }
    })
  }
  
})

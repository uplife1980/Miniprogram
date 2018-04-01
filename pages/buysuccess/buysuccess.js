// pages/buysuccess/buysuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    phone:options.phone
  })
  console.log(options)
  },

  backToIndex:function(){
    wx.switchTab({
      url: '../index/index',
    })
  }
})
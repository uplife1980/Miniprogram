// pages/maishu/maishu.js
Page({


  iwantpic: function (e) {
    wx.chooseImage({
      count: 0,
      sizeType: [],
      sourceType: [],
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  iwantcode:function(e){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  /**
   * 页面的初始数据
   */

  data: {
    input1: 'false',
    a: '11111'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
     showModel('成功!');
     console.log("1111")
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
 
  
})
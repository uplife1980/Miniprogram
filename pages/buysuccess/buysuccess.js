// pages/buysuccess/buysuccess.js
var app = getApp();
var Url = require('../../url.js');
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
      phone: options.phone
    })
  },
  //获取formID
  backToIndex: function (e) {
    var date = new Date() 

    wx.request({
      method: "POST",
      url: Url.Url() + 'user/saveFormId',
      data: {
        userid: app.globalData.openId,
        formid: e.detail.formId,
        date: date.getTime()
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      success: function (res) {
        console.log("userid: " + app.globalData.openId)
        console.log("formid: " + e.detail.formId)
        wx.reLaunch({
          url: '../index/index'
        })
      }
    })

  }
})
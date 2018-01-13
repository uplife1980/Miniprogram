var Url = require('../../url.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comfirm_hidden: true,
    cancel_hidden: true,
    booklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: Url.Url()+'bookdeal/viewnotconfirm',
      data: {
        openId: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: " GET",
      success: function (res) {
        that.setData({
          booklist: res.data.bookinfo
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  comfirm: function (e) {
    var that = this;
    var index = e.target.id.replace(/[^0-9]/ig, "");
    wx.request({
      url: '',
      data: {
        openId: app.globalData.openId,
        index: index,
        comfirm: 1
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        that.setData({
          comfirm_hidden: false
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  cancel: function (e) {
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var that = this
    wx.request({
      url: '',
      data: {
        openId: app.globalData.openId,
        index: index,
        cancel: 1
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        that.setData({
          cancel_hidden: false
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toastChange1: function () {
    this.setData({
      comfirm_hidden: true
    })
    wx.navigateTo({ url: '../needstop/needstop' })

  },
  toastChange2: function () {
    this.setData({
      cancel_hidden: true
    })
    wx.navigateTo({ url: '../needstop/needstop' })
  }
})
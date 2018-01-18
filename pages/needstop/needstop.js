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
      url: Url.Url()+'user/viewstopshare',
      data: {
        userid: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res)
        that.setData({
          booklist: res.data.books
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
      url: Url.Url() +'user/confirm',
      data: {
        userid: app.globalData.openId,
        bookid: that.data.booklist[index].id,
       
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
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
    console.log(e);
    console.log(index);
    wx.request({
      url: Url.Url() + 'user/cancel',
      data: {
        userid: app.globalData.openId,
        bookid: that.data.booklist[index].id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
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
    wx.switchTab({ url: '../users/users' })
  },
  toastChange2: function () {
    this.setData({
      cancel_hidden: true
    })
    wx.switchTab({url: '../users/users' })
  }
})
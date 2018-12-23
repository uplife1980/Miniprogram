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

  },
  // 复制电话到剪切板
  setClipBoard: function () {
    var that = this
    wx.setClipboardData({
      data: that.data.phone,
      success: function () {
        wx.showToast({ //用于没有搜索到书,第一次查看完所有图书也会显示
          image: '',
          icon: 'none',
          title: '复制成功',
          mask: true,
          success: function (res) {
            setTimeout(function () {
              wx.hideToast()
            }, 5000)
          }

        })
      }
    })
  }
})
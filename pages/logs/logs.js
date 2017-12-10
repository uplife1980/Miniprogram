var app = getApp();
Page({
  data: {
    array: ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '其他'],
    index: 0,
    suitId: 12345,
    disabled: 0,
    userinfo_hidden: true,
    hidden: true
  },
  toastChange: function () {
    this.setData({
      hidden: true
    })
  },
  bindchange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  
  userCheck: function (e) {
    var that = this

    wx.request({
      url: '',
      data: {
        "openId": app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        var that = this
        if (res.data.fail == 1) {
          that.setData({ userinfo_hidden:false })
        }
        else {
          formSubmit(e)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  userSubmit: function (e) {
    var that = this
    that.setData({
      userinfo_hidden: true,
      hidden: false
    })
    wx.request({
      url: '',
      data: {
        "sex": e.detail.value.sex,
        "tel": e.detail.value.tel,
        "grade": e.detail.value.grade,
        "address": e.detail.value.address
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })



  },
  formSubmit: function (e) {
    var that=this
    that.setData({
      hidden:false
    })
    wx.request({
      url: '',
      data: {
        "openId": app.globalData.openId,
        "index": suitId,
        "way": e.detail.value.way
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})
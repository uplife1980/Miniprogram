var app = getApp()
var Url = require('../../url.js');
Page({

  data: {
    openId: app.globalData.openId,
    hidden: true,
    comfirm: true,
    bought_list: [],
    borrowing_list: [],
    notborrow_list: [],
    neverborrow_list: [],
    xuming_hidden: true,
    img: '',
    display1: "none"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({          //获取已经购买图书
      url: Url.Url() + 'user/viewBookinhand',
      data: {
        userid: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          bought_list: res.data.bought,
          borrowing_list: res.data.renting,
          notborrow_list: res.data.outdate,
          neverborrow_list: res.data.rentable
        })
        var today = new Date;
        var borrowing_list = that.data.borrowing_list;
        for (var i in borrowing_list) {
          // var endDate = Date.parse(borrowing_list[i].period.replace('/-/g', '/'));
          var days = (borrowing_list[i].end_time - today.getTime()) / (1 * 24 * 60 * 60 * 1000);
          borrowing_list[i].days=parseInt(days) 
        }
        that.setData({
          borrowing_list: borrowing_list
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  renew: function () {        //续命
    var that = this
    that.setData({
      xuming_hidden: false
    })
  },
  iwantpic: function () {
    var that = this
    wx.chooseImage({
      count: 0,
      sizeType: ["compressed"],
      sourceType: [],
      success: function (res) {
        that.setData({
          display1: "block",
          img: res.tempFilePaths
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //续命表单提交
  renewFormSubmit: function (e) {
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var that=this;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    wx.request({
      url: Url.Url() + 'bookdeal/reRent',
      data: {
        userid: app.globalData.openId,
        bookid: parseInt(that.data.borrowing_list[index].id),
        period: parseInt(e.detail.value.period),
        onlycode: parseInt(request_id)

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
        
        wx.uploadFile({
          url: Url.Url() + 'upload/image',
          filePath: that.data.img[0],
          name: 'imagefile',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            onlycode:request_id
          },
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  updatePic: function (e) {          //上传新图片
    var that = this;
    var index = e.target.id.replace(/[^0-9]/ig, "");
    wx.chooseImage({
      count: 0,
      sizeType: ["compressed"],
      sourceType: [],
      success: function (res) {
        wx.uploadFile({
          url: Url.Url() + 'upload/image',
          filePath: res.tempFilePaths[0],
          name: 'imagefile',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            "onlycode": notborrowing_list[index].onlycode,
          },
          success: function (res) { },

        })

      },
    })
  },

  repeal1: function (e) {      //操作确认提示框
    this.setData({
      comfirm: false
    })
  },
  repeal: function (e) {       //撤销此单
    var index = e.target.id.replace(/[^0-9]/ig, "");

    wx.request({
      url: Url.Url() + 'rentable/cancel',
      data: {
        bookid: neverborrow_list[index].bookid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) { wx.navigateTo({ url: '../mybook/mybook' }) },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toastChange: function () {        //信息补全成功并跳转新页面
    this.setData({
      hidden: true
    })
  }
})
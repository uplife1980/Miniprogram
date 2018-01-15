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
        that.setData({
          bought_list: res.data.bought,
          borrowing_list: res.data.renting,
          notborrow_list: res.data.outdate,
          neverborrow_list: res.data.rentable
        })
        var today = new Date;
        console.log(that.data.neverborrow_list)

        var borrowing_list = that.data.borrowing_list;
        for (var i in borrowing_list) {
          // var endDate = Date.parse(borrowing_list[i].period.replace('/-/g', '/'));
          var days = (borrowing_list[i].end_time - today.getTime()) / (1 * 24 * 60 * 60 * 1000);
          borrowing_list[i].days = parseInt(days)
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
    var that = this;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    wx.request({
      url: Url.Url() + 'bookdeal/reRent',
      data: {
        userid: app.globalData.openId,
        bookid: that.data.borrowing_list[index].id,
        period: e.detail.value.period,
        onlycode: request_id
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
            onlycode: request_id
          },
          success:function(){
            wx.redirectTo({
              url: '../mybook/mybook',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  submitCancel:function(){
    this.setData({
      xuming_hidden:true
    })
  },
  updatePic: function (e) {          //上传新图片
    var that = this;
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    wx.chooseImage({
      count: 0,
      sizeType: ["compressed"],
      sourceType: [],
      success: function (res) {
        wx.uploadFile({
          url: Url.Url() + 'upload/updatepic',
          filePath: res.tempFilePaths[0],
          name: 'imagefile',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            bookid: that.data.notborrowing_list[index].id,
            onlycode:request_id
          }
        })
      }
    })
  },

  repeal1: function (e) {      //操作确认提示框
    this.setData({
      comfirm: false,
      tempIndex: e.currentTarget.id.replace(/[^0-9]/ig, "")
    })
  },
  repeal: function (e) {       //撤销此单
    var that=this
    wx.request({
      url: Url.Url() + 'rentable/cancel',
      data: {
        bookid: that.data.neverborrow_list[that.data.tempIndex].id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
         //最后一定会有一个button，navigateTo是进入，还需要再退出
         //改用局部刷新的方式，单独刷新一类图书。
         //统一加载
         //图片实物图太大，需要限制大小
         //wx.navigateTo({ url: '../mybook/mybook' }) 
         },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  repealCancel:function(){
    this.setData({
      comfirm:true
    })
  },
  toastChange: function () {        //信息补全成功并跳转新页面
    this.setData({
      hidden: true
    })
  }
})
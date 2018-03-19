var app = getApp()
var Url = require('../../url.js');
Page({
  data: {
    openId: app.globalData.openId,
    hidden: true,
    confirm: true,
    bought_list: [],
    borrowing_list: [],
    notborrow_list: [],
    neverborrow_list: [],
    xuming_hidden: true,
    img: '',
    display1: "none",
    bookid : 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({          
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
        var borrowing_list = that.data.borrowing_list;
        for (var i in borrowing_list) {
          var days = (borrowing_list[i].end_time - today.getTime()) / (1 * 24 * 60 * 60 * 1000);
          borrowing_list[i].days = parseInt(days)
        }
        that.setData({
          borrowing_list: borrowing_list
        })
        console.log(that.data)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  renew: function (e) {        //续命
    var index = e.target.id.replace(/[^0-9]/ig, "");
    console.log(index);
    var that = this
    that.setData({
      bookid:index,
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
    var that = this;
    var index = that.data.bookid;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    wx.request({
      url: Url.Url() + 'bookdeal/reRentintime',
      data: {
        userid  : app.globalData.openId,
        bookid  : that.data.borrowing_list[index].id,
        period  : e.detail.value.period,
        onlycode: request_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) { 
        console.log(res.data)
        var days = (res.data.rented.end_time - date.getTime()) / (1 * 24 * 60 * 60 * 1000);
        console.log(days)
        that.data.borrowing_list[index] = res.data.rented;
        console.log(that.data.borrowing_list[index])
        that.data.borrowing_list[index].days = parseInt(days)
        console.log(that.data.borrowing_list[index])
        that.setData({
          borrowing_list: that.data.borrowing_list
        })
       },
      fail: function (res) { },
      complete: function (res) { },
    })
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
      success: function () {
        that.setData({
          xuming_hidden: true
        })
      }
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
          url: Url.Url() + 'upload/image',
          filePath: res.tempFilePaths[0],
          name: 'imagefile',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            onlycode:request_id
          }
        }),
        wx.request({
          url: Url.Url() + '/bookdeal/updatepic',
          data : {
            onlycode: request_id,
            bookid: that.data.notborrow_list[index].id,
            //userid: app.globalData.openId
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          method: "POST",
          success: function (res) {
            that.data.notborrow_list[index] = res.data.rentable;
            that.setData({
                notborrow_list: that.data.notborrow_list
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  repeal1: function (e) {      //操作确认提示框
    this.setData({
      confirm: false,
      tempIndex: e.currentTarget.id.replace(/[^0-9]/ig, "")
    })
  },
  repeal: function (e) {       //撤销此单
    var that=this
    wx.request({
      url: Url.Url() + 'rentable/cancel',
      data: {
        bookid : that.data.neverborrow_list[that.data.tempIndex].id,
        userid : app.globalData.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
        console.log(res.data)
        that.setData({
          neverborrow_list : res.data.rentable,
          confirm : true
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  repealCancel:function(){
    this.setData({
      confirm:true
    })
  },
  toastChange: function () {        
    this.setData({
      hidden: true
    })
  }
})
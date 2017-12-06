// pages/maishu/maishu.js
var app = getApp();
Page({

  data: {
    input1: false,
    input2: true,
    isbn: '',
    img: '',
    img2: '',
    display1: "none",
    display2: "none",
    phone: "",
    error: ''
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
  iwantpic2: function () {
    var that = this
    wx.chooseImage({
      count: 0,
      sizeType: ["compressed"],
      sourceType: [],
      success: function (res) {
        that.setData({
          display2: "block",
          img2: res.tempFilePaths
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  iwantcode: function (e) {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        that.setData({
          isbn: res.result
        })
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  /**
   * 页面的初始数据
   */


  /**
   * 生命周期函数--监听页面加载
   */
  switch1: function () {
    var that = this.data.input1 == 0 ? 1 : 0
    this.setData({
      input1: that
    })
  },
  switch2: function () {
    var that = this.data.input2 == 0 ? 1 : 0
    this.setData({
      input2: that
    })
  },
  formCheck: function (e) {
    var that = this
    if (that.data.img[0] != null && that.data.img2[0] != null && e.detail.value.book != 0 && e.detail.value.isbn != 0 && e.detail.value.phone != 0 && (e.detail.value.borrow || e.detail.value.buy) != 0) {
      
        // formSubmit(e)

    }
    else
      that.setData({
        error: "信息没有填写完整,请检查!"
      })
  },
  formSubmit: function (e) {
    formCheck();
    var that = this;
    var date = new Date() //9+4
    var request_id = date.getTime() + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    wx.uploadFile({
      url: 'http://localhost:8082/BookShare/upload/uploading',
      filePath: that.data.img[0],
      name: 'imgsrc',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: { "onlycode": "001" },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.uploadFile({
      url: 'http://localhost:8082/BookShare/upload/uploading',
      filePath: that.data.img2[0],
      name: 'imgsrc2',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        "onlycode": "001",
        name: e.detail.value.book,//书的名字
        information: e.detail.value.isbn,//isbn号 
        borrowable: e.detail.value.maishu,//卖书的开关，1是卖，0是不卖
        rent_price: e.detail.value.borrow,//出租的价格
        rentable: e.detail.value.chuzu,//出租的开关，同卖书
        sale_price: e.detail.value.buy//买书的价格,
      },
      success: function (res) {


      },
      fail: function (res) { },
      complete: function (res) {
        console.log(e.detail.value.chuzu);
      },
    })

    wx.request({
      url: 'http://localhost:8082/BookShare/rentable/bookapplication',
      data: {
        name: e.detail.value.book,//书的名字
        information: e.detail.value.isbn,//isbn号 
        borrowable: e.detail.value.maishu,//卖书的开关，1是卖，0是不卖
        rent_price: e.detail.value.borrow,//出租的价格
        rentable: e.detail.value.chuzu,//出租的开关，同卖书
        sale_price: e.detail.value.buy//买书的价格
      },
      header: {
        //'content-type'  :   'application/json'
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {

        console.log(res.data.result)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  onLoad: function () {
    var that = this

    wx.request({
      url: 'https://localhost/request' + 'method?=getUserPhone',
      data: {
        "user": app.globalData.userInfo.nickName
      },

      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",

      success: function (res) {
        if (res.data.fail == 0) {
          that.setData({
            phone: res.data.phone
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

})
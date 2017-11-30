// pages/maishu/maishu.js
Page({
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

  data: {
    input1: false,
    input2: true,
    isbn: '',
    img: '',
    img2: '',
    display1: "none",
    display2:"none",
  },
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

  formSubmit: function (e) {
    var that = this;
    wx.uploadFile({
      url: '',
      filePath: that.data.img[0],
      name: 'imgsrc',
      header: { 'content-type': 'multipart/form-data' },
      formData: {},
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.uploadFile({
      url: '',
      filePath: that.data.img2[0],
      name: 'imgsrc2',
      header: { 'content-type': 'multipart/form-data' },
      formData: {},
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    
    wx.request({
      url: 'www.echohuiyin.com',
      data: {
        name: e.detail.value.name,//书的名字
        information: e.detail.value.isbn,//isbn号
        borrowable: e.detail.value.maishu,//卖书的开关，1是卖，0是不卖
        rent_price: e.detail.value.borrow,//出租的价格
        rentable: e.detail.value.chuzu,//出租的开关，同卖书
        sale_price: e.detail.value.buy//买书的价格
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: "POST",
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) {
        console.log("刚才提交的数据是:" + that.data)
      },
    })
  }
 
  
})
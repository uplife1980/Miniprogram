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
    error: '',
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
          isbn : res.result
        })
        // wx.request({
        //   url: "http://api.jisuapi.com/isbn/query?appkey=85c75335fa427fe4&isbn="+that.data.isbn,
        //   data: {},
        //   header: {},
        //   method:"POST",
        //   success: function(res) {
        //     console.log(res)
        //     //setData 设置书的信息，让一个request一起传过去
        //     },
        //   fail: function(res) {},
        //   complete: function(res) {},
        // })
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
  /*formCheck:function(e){
    var that=this;
    if (that.data.img[0] != null && that.data.img2[0] != null && e.detail.value.book != 0 &&  e.detail.value.isbn != 0 && e.detail.value.phone != 0&&(e.detail.value.borrow||e.detail.value.buy)!=0){
      that.setData({
        error: "信息没有填写完整,请检查!"
      })

      formSubmit(e);
    }
    else
      that.setData({
        error:"信息没有填写完整,请检查!"
    })
  },*/
  formSubmit: function (e) {
    var that = this;
    var date = new Date() //9+4
    var request_id = date.getTime()*10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  console.log(request_id)
    wx.uploadFile({
      url: 'http://localhost:8082/BookShare/upload/image',
      filePath: that.data.img[0],

      name: 'imagefile',
      header: { 
        'content-type': 'multipart/form-data'
         },
      formData: {
        "onlycode"  : request_id,
        "imagename" : "first"
        },
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.uploadFile({
      url: 'http://localhost:8082/BookShare/upload/image',
      filePath: that.data.img2[0],

      name: 'imagefile',
      header: { 
        'content-type': 'multipart/form-data'
         },
      formData: {
        "onlycode"  :   request_id,
        "imagename" :   "second"
        },
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    wx.request({
      url: 'http://localhost:8082/BookShare/rentable/bookapplication',
      data: {
        name        :   e.detail.value.book,//书的名字
        isbn        :   e.detail.value.isbn,//isbn号 
        rentbtn     :   e.detail.value.rentbtn,//出租的开关，同卖书
        sellbtn     :   e.detail.value.sellbtn,//卖书的开关，1是卖，0是不卖
        rent_price  :   (e.detail.value.rentbtn == false) ? 0 : e.detail.value.borrow,//出租的价格
        sale_price  :   (e.detail.value.sellbtn == false) ? 0 : e.detail.value.buy,//买书的价格
        onlycode    :   request_id,
        origin_tel  :   e.detail.value.phone
      },
      header: {
        //'content-type'  :   'application/json'
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
        console.log(res.data)
        if (res.data.result != "exist") {
          that.setData({
            isbn: res.data.result
          })
          wx.request({
            url: "http://api.jisuapi.com/isbn/query?appkey=85c75335fa427fe4&isbn=" + res.data.result,
            data: {},
            header: {},
            method: "POST",
            success: function (res) {     //把服务器没有的信息补全给服务器
              console.log(res)
                wx.request({
                  url: 'http://localhost:8082/BookShare/rentable/saveisbn',
                  data: {
                      title   : res.data.tile,
                      subtitle: res.data.subtitle,
                      pic     : res.data.pic,
                      author  : res.data.author,   
                      summary : res.data.summary,
                      isbn    : res.data.isbn      //还有其它字段          
                  },
                  header: {
                    //'content-type'  :   'application/json'
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                  },
                  method: "POST",
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {}
      ,
    })
  },
  onLoad: function () {
    var that = this

    wx.request({
      //url: 'https://localhost/request' + 'method?=getUserPhone',
      url: '',
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
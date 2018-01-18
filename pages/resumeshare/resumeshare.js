var Url = require('../../url.js');
var app = getApp();
Page({
  data: {
    bookid: 0,
    input1: false,
    input2: true,
    img: '',
    display1: "none",
    display2: "none",
    phone: '',
    error: '',
    userinfo_hidden: true,    //补全个人信息表
    checked_man: false,
    checked_woman: false,
    hidden: true,     //信息补全成功
    array: ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '其他', '保密'],
    index: 8,       //年级
    warning_hidden: true,
  },

  //从服务器获取用户信息
  onLoad: function (options) {
    var that = this
    console.log(options.bookid);
    that.setData({
      bookid : options.bookid
    }),
    wx.request({
      url: Url.Url() + 'user/getUserInfo',
      data: {
        userid: app.globalData.openId
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          that.setData({
            index: parseInt(res.data.result.grade),
            phone: res.data.result.phone
          })
          if (res.data.result.sex === "man") that.setData({ checked_man: true })
          else if (res.data.result.sex === "woman") that.setData({ checked_woman: true })
          else that.setData({ checked_secret: true })
        }
      },
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
    var that = this;
    var isbn = e.detail.value.isbn;
    var phone = e.detail.value.tel;
    if (that.data.img[0] == null) {
      console.log("图片没有填写,请检查!")
      that.setData({
        warning_hidden: false,
        promptText: "请上传图片"
      })
    } else if (phone == null || phone.length == 0) {
      console.log("没有输入电话号码,请检查!")
      that.setData({
        warning_hidden: false,
        promptText: "请输入电话号码"
      })
    } else if (e.detail.value.rentbtn == false && e.detail.value.sellbtn == false) {
      console.log("没有选择分享方式,请检查!")
      that.setData({
        warning_hidden: false,
        promptText: "请选择出租或者出售或者皆可"
      })
    } else if ((e.detail.value.rentbtn == true && e.detail.value.borrow == 0)) {
      console.log("没有输入出租价格,请检查!")
      that.setData({
        warning_hidden: false,
        promptText: "请输入出租价格"
      })
    } else if ((e.detail.value.sellbtn == true && e.detail.value.buy == 0)) {
      console.log("没有输入出售价格,请检查!")
      that.setData({
        warning_hidden: false,
        promptText: "请输入出售价格"
      })
    } else {
      that.formSubmit(e);
    }
  },
  formSubmit: function (e) {
    var that = this;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    //上传用户信息部分
    wx.request({
      url: Url.Url() + 'user/complementInfo',
      data: {
        userid: app.globalData.openId,
        sex: e.detail.value.sex,
        phone: e.detail.value.tel,
        grade: e.detail.value.grade
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) { },
    }),
      //上传图片部分
      wx.uploadFile({
        url: Url.Url() + 'upload/image',
        filePath: that.data.img[0],
        name: 'imagefile',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
          "onlycode": request_id,
        },
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      }),
      //上传书籍信息部分
      wx.request({
        url: Url.Url() + 'user/resumeshare',
        data: {
          bookid: parseInt(that.data.bookid),
          userid: app.globalData.openId,
          rentbtn: e.detail.value.rentbtn,//出租的开关，同卖书
          sellbtn: e.detail.value.sellbtn,//卖书的开关，1是卖，0是不卖
          rent_price: (e.detail.value.rentbtn == false) ? 0 : e.detail.value.borrow,//出租的价格
          sale_price: (e.detail.value.sellbtn == false) ? 0 : e.detail.value.buy,//买书的价格
          onlycode: request_id,//上传的图片名关键部分
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: "POST",
        success: function (res) { 
          console.log(res.data.result);
          that.setData({
            hidden: false
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
  },
  bindchange: function (e) {      //更改年级显示出来
    this.setData({
      index: e.detail.value
    })
  },
  submitTap: function () {        //信息补全
    this.setData({
      userinfo_hidden: false
    })
  },
  upComplete: function () {        //跳转新页面
    this.setData({
      hidden: true
    })
    wx.navigateBack({
      delta: 2,
    });
  },
  remain: function () {        //隐藏警告框
    this.setData({
      warning_hidden: true
    })
  }
})

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
    wx.showShareMenu()

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
    if (
      that.data.getcode == "primary" &&       //isbn存在
      that.data.img[0] != null &&             //图片存在
      e.detail.value.tel != '' &&             //电话不为空
      /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/.test(e.detail.value.tel) &&  //电话合法性
      e.detail.value.rentbtn || e.detail.value.sellbtn &&          //出租或者出售的按钮
      (parseFloat(e.detail.value.borrow) || parseFloat(e.detail.value.buy)) != null //出租或者出售的价格 .
    ) {
      return 1;
    }
    else {
      wx.showToast({
        title: '信息未正确填写',
        image: '',
        mask: true,
        success: function (res) { setTimeout(function () { wx.hideToast() }, 5000) },
        fail: function (res) { },
        complete: function (res) { },
      });
      return 0;
    }},
  formSubmit: function (e) {
    var that = this;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    if (that.formCheck(e) == 0) { return 0 }

 
      wx.request({
      url: Url.Url() + 'user/resumeshare',
        data: {
          userid: app.globalData.openId,
          bookid: parseInt(that.data.bookid),
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
            success: function (res) { //上传用户信息部分
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
                success: function (res) {
                  wx.showToast({
                    title: '提交成功！',
                    success: function () {
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../index/index'
                        }, 1500)
                      })
                    }
                  })
                },
              })
            },
            fail: function (res) { },
            complete: function (res) { },
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

  // remain: function () {        //隐藏警告框
  //   this.setData({
  //     warning_hidden: true
  //   })
  // }
})

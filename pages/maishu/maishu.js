// pages/maishu/maishu.js
var Url = require('../../url.js');
var app = getApp();
Page({
  data: {
    input1: false,
    input2: true,
    isbn: '',
    img: '',
    display1: "none",
    phone: '',
    userinfo_hidden: true,    //补全个人信息表
    checked_man: false,
    checked_woman: true,
    array: ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '其他', '保密'],
    index: 8,       //年级
  },

  //从服务器获取用户信息
  onLoad: function () {
    var that = this
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
          if (parseInt(res.data.result.sex) == 0) that.setData({ checked_man: true })
          else that.setData({ checked_woman: true })
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
  iwantcode: function (e) {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        if ((/977|978+[0-9]{10}/.test(res.result)))
          that.setData({
            isbn: res.result
          })
        else {
          that.setData({
            isbn: '扫描了非图书商品,或本书过老'
          })
        }
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
  submitTap: function () {        //按下提交订单之后
    this.setData({
      userinfo_hidden: false
    })
  },
  formCheck: function (e) {
    var that = this;
    console.log(e.detail)
    if (
      typeof (that.data.isbn) == 'number' &&      //isbn存在
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
    }
  },

  formSubmit: function (e) {
    var that = this;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    //上传用户信息部分
    var grade;
    var sex = (e.detail.value.checked_man === 0) ? "man" : "woman";     //0为男生，1为女生
    switch (e.detail.value.index) {
      case 0: grade = "大一"; break;
      case 1: grade = "大二"; break;
      case 2: grade = "大三"; break;
      case 3: grade = "大四"; break;
      case 5: grade = "研一"; break;
      case 6: grade = "研二"; break;
      case 7: grade = "研三"; break;
      case 8: grade = "其他"; break;
      case 9: grade = "保密"; break;
    }
    //上传图片部分
    if (that.formCheck(e) != 1) { return 0 }
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
      success: function (res) {
        that.setData({
          hidden: false
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    }),
      wx.request({
        url: Url.Url() + 'user/complementInfo',
        data: {
          userid: app.globalData.openId,
          sex: sex,
          phone: e.detail.value.tel,
          grade: e.detail.value.grade
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: "POST",
        success: function (res) { },
      }),
      //上传书籍信息部分
      wx.request({
        url: Url.Url() + 'rentable/bookapplication',
        data: {
          userid: app.globalData.openId,
          isbn: that.data.isbn,//isbn号 
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
          //图书不存在时去爬图书信息
          if (res.data.result != "exist") {
            that.setData({
              isbn: res.data.isbn
            })
            wx.request({
              url: "http://api.jisuapi.com/isbn/query?appkey=85c75335fa427fe4&isbn=" + that.data.isbn,
              data: {},
              header: {},
              method: "POST",
              //把服务器没有的信息补全给服务器
              success: function (res) {
                wx.request({
                  url: Url.Url() + 'rentable/saveisbn',
                  data: {
                    title: res.data.result.title,
                    subtitle: res.data.result.subtitle,
                    picture: res.data.result.pic,
                    author: res.data.result.author,
                    summary: res.data.result.summary,
                    isbn: res.data.result.isbn,
                    publisher: res.data.result.publisher,
                    pubplace: res.data.result.pubplace,
                    pubdate: res.data.result.pubdate,
                    page: res.data.result.pagestring,
                    price: res.data.result.price,
                    binding: res.data.result.binding,
                    isbn10: res.data.result.isbn10,
                    keyword: res.data.result.keyword,
                    edition: res.data.result.edition,
                    impression: res.data.result.impression,
                    language: res.data.result.language,
                    format: res.data.result.format,
                    category: res.data.result.class
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                  },
                  method: "POST"
                })
              },
              fail: function (res) { },
              complete: function (res) { }
            })
          }
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

  upComplete: function () {        //跳转新页面
    wx.showToast({
      title: '提交成功!',
      icon: '',
      image: '',
      mask: true,
      success: function (res) {
        setTimeout(function () {
          wx.switchTab({
            url: '../users/users'
          }, 1500)
        })
      },
    })
  }
})

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
    display2: "none",
    phone: "",
    error: '',
    userinfo_hidden: true,    //补全个人信息表
    checked_man: false,
    checked_woman: false,
    hidden: true,     //信息补全成功
    array: ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '其他', '保密'],
    index: 0,       //年级
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
            phone: parseInt(res.data.result.phone)
          })
            (res.data.result.sex == 0) ? that.setData({ checked_man: true }) : that.setData({ checked_woman: true })
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
        that.setData({
          isbn: res.result
        })
      },
      fail: function (res) { },
      complete: function (res) {
      },
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
    wx.request({
      url: Url.Url() + 'user/complementInfo',
      data: {
        userid: app.globalData.openId,
        sex: sex,
        phone: e.detail.value.tel,
        grade: e.detail.value.grade,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
        //上传书籍信息部分
        wx.request({
          url: Url.Url() + 'rentable/bookapplication',
          data: {
            userid: request_id,
            isbn: that.data.isbn,//isbn号 
            rentbtn: e.detail.value.rentbtn,//出租的开关，同卖书
            sellbtn: e.detail.value.sellbtn,//卖书的开关，1是卖，0是不卖
            rent_price: (e.detail.value.rentbtn == false) ? 0 : e.detail.value.borrow,//出租的价格
            sale_price: (e.detail.value.sellbtn == false) ? 0 : e.detail.value.buy,//买书的价格
            onlycode: request_id,//上传的图片名关键部分
          },
          header: {
            //'content-type'  :   'application/json'
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
                    method: "POST",
                  })


                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
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
              success: function (res) {
                that.setData({
                  hidden: false
                })
              },
              fail: function (res) { },
              complete: function (res) { },
            })

          },
          fail: function (res) { },
          complete: function (res) { }
          ,
        })
      },
    })



  },

  bindchange: function (e) {          //更改年级显示出来
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
    wx.switchTab({
      url: '../users/users'
    })
  }
})

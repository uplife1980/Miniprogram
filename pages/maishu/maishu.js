// pages/maishu/maishu.js
var Url = require('../../url.js');
var app = getApp();
Page({
  data: {
    input1: false,
    input2: false,
    isbn: '',
    img: '',
    display1: "none",
    phone: '',
    userinfo_hidden: true,    //补全个人信息表
    checked_man: false,
    checked_woman: true,
    array: ['预科','大一', '大二', '大三', '大四','大五', '研一', '研二', '研三', '博士','保密'],
    index: 10,       //年级
    // warning_hidden: true,
    getcode:"default",
    getpic:"default",
    showwarn:'',
    showModalStatus:"false"
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
      count: 1,
      sizeType: ["compressed"],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          display1: "block",
          img: res.tempFilePaths,
          getpic: "primary"
        })
      },
      fail: function (res) { 
       wx.showToast({
         title: '失败!',
       })
      },
      complete: function (res) { },
    })
  },
  iwantcode: function (e) {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        if (/(977|978|979)+[0-9]{10}/.test(res.result)){
          that.setData({
            isbn: res.result,
            getcode:"primary",
            showwarn:"ISBN为:"+res.result
          })
        
        }
        else {
          that.setData({
            getcode: "warn",
            showwarn:"扫描了非法条形码,或本书过老!"
          })
          wx
        }
      },
      fail: function (res) {
        that.setData({
          showwarn: '扫描了非法条形码,或本书过老!',
          getcode: "warn"
        })},
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
  // <<<<<<< HEAD
  submitTap: function () {        //按下提交订单之后
    this.setData({
      userinfo_hidden: false,
      continue_input:true
    })
  },
  formCheck: function (e) {
    var that = this;
    if (that.data.getcode != "primary")
      that.showWarn("isbn没有正确扫描")
    else if (that.data.img[0] == null)
      that.showWarn("没有上传图片!")
    else if (e.detail.value.tel == '')
      that.showWarn("没有填写手机号码")
    else if (/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(e.detail.value.tel)!=1)
      that.showWarn("手机号码格式不正确")
    else if (!(e.detail.value.rentbtn || e.detail.value.sellbtn))
      that.showWarn("没有选择出租出售")
    else if (/^[0-9]+.?[0-9]*$/.test(e.detail.value.buy)!=1)
      that.showWarn("没有填写价格")
    else 
      that.formSubmit(e)
    // if (
    //   (that.data.getcode=="primary")&&       //isbn存在
    //   (that.data.img[0] != null) &&             //图片存在
    //  (e.detail.value.tel != '') &&             //电话不为空
    //   (/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(e.detail.value.tel) )&&  //电话合法性
    //   (e.detail.value.rentbtn || e.detail.value.sellbtn) &&          //出租或者出售的按钮
    //   (/^[0-9]+.?[0-9]*$/.test(e.detail.value.buy) )//出租或者出售的价格 .
    // ) {
    //   that.formSubmit(e)
    // }
    // else {
    //   wx.showToast({
    //     title: '有信息填写不正确!',
    //     image: '',
    //     icon:'none',
    //     mask: true,
    //     success: function (res) { setTimeout(function () { wx.hideToast() }, 5000) },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   });
    //   return 0;
    // }
  },
  showWarn: function (str) {        //具体显示哪里填写不正确
    wx.showToast({
      title: str,
      image: '',
      icon: 'none',
      mask: true,
      success: function (res) { setTimeout(function () { wx.hideToast() }, 5000) }
    })
  },
  formSubmit: function (e) {
    var that = this;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);



      //上传书籍信息部分
      wx.request({
        url: Url.Url() + 'rentable/bookapplication',
        data: {
          userid: app.globalData.openId,
          isbn: that.data.isbn,//isbn号 
          rentbtn: e.detail.value.rentbtn,//出租的开关，同卖书
          sellbtn: e.detail.value.sellbtn,//卖书的开关，1是卖，0是不卖
          rent_price: (e.detail.value.rentbtn == false) ? 0 : parseFloat(e.detail.value.borrow),//出租的价格
          sale_price: (e.detail.value.sellbtn == false) ? 0 : parseFloat(e.detail.value.buy),//买书的价格
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
                console.log(res)
                if(res.data.result.title==null){
                    that.setData({showModatStatus:true})
                  wx.request({
                    url: Url.Url() + 'rentable/saveisbn',
                    data: {
                      title: "自定义书籍",
                      picture:"",
                      subtitle: "nosubtitle",
                      author: "noauthor",
                      summary: "nosummary",
                      isbn: that.data.isbn,
                      publisher: "nopublisher",
                      pubplace: "5",
                      pubdate: "6",
                      page: "7",
                      price: "8",
                      binding: "9",
                      isbn10: "10",
                      keyword: "nokeyword",
                      edition: "12",
                      impression: "13",
                      language: "14",
                      format: "15",
                      category: "16"
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    method: "POST",
                    success: function () { //上传图片部分
                    }
                  })
                }
                
                else(
                wx.request({
                  url: Url.Url() + 'rentable/saveisbn',
                  data: {
                    title: res.data.result.title,
                    subtitle: res.data.result.subtitle.slice(0, 32),
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
                    keyword: res.data.result.keyword.slice(0, 32),
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
                  success: function (res) { //上传图片部分
                  console.log(res)
                    }
                })
                )
              },
              fail: function (res) { },
              complete: function (res) { }
            })
          }
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
                        })
                      },1500)
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
})

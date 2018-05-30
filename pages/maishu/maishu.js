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
    array: ['预科','大一', '大二', '大三', '大四','大五', '研一', '研二', '研三', '保密'],
    index: 9,       //年级
    // warning_hidden: true,
    getcode:"default",
    getpic:"default",
    showwarn:''
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

          //  if (parseInt(res.data.result.sex) == 0) that.setData({ checked_man: true })
          // else that.setData({ checked_woman: true })
          if (res.data.result.sex === "man") that.setData({ checked_man: true })
          else if (res.data.result.sex === "woman") that.setData({ checked_woman: true })
          else that.setData({ checked_secret: true })
          //>>>>>>> tuandui/master
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
          img: res.tempFilePaths,
          getpic: "primary"
        })
      },
      fail: function (res) { 
       
      },
      complete: function (res) { },
    })
  },
  iwantcode: function (e) {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        if ((/977|978+[0-9]{10}/.test(res.result))){
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
    if (
      (that.data.getcode=="primary")&&       //isbn存在
      (that.data.img[0] != null) &&             //图片存在
     (e.detail.value.tel != '') &&             //电话不为空
      (/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/.test(e.detail.value.tel) )&&  //电话合法性
      (e.detail.value.rentbtn || e.detail.value.sellbtn) &&          //出租或者出售的按钮
      ((parseFloat(e.detail.value.borrow) || parseFloat(e.detail.value.buy)) != null )//出租或者出售的价格 .
    ) {
      that.formSubmit(e)
    }
    else {
      wx.showToast({
        title: '信息未正确填写',
        image: '',
        icon:'none',
        mask: true,
        success: function (res) { setTimeout(function () { wx.hideToast() }, 5000) },
        fail: function (res) { },
        complete: function (res) { },
      });
      return 0;
    }
    // =======
    //   formCheck:function(e){
    //     var that=this;
    //     var isbn = e.detail.value.isbn;
    //     var phone = e.detail.value.tel;
    //     if(that.data.img[0] == null){
    //       console.log("图片没有填写,请检查!")
    //       that.setData({
    //         warning_hidden:false,
    //         promptText:"请上传图片"
    //       })
    //     }else if(isbn === null||isbn === ''){
    //       console.log("没有扫码,请检查!")
    //       that.setData({
    //         warning_hidden: false,
    //         promptText: "请扫描书后二维码"
    //       })
    //     }else if (phone == null || phone.length == 0) {
    //       console.log("没有输入电话号码,请检查!")
    //       that.setData({
    //         warning_hidden: false,
    //         promptText: "请输入电话号码"
    //       })
    //     }else if (e.detail.value.rentbtn == false && e.detail.value.sellbtn == false){
    //       console.log("没有选择分享方式,请检查!")
    //       that.setData({
    //         warning_hidden: false,
    //         promptText: "请选择出租或者出售或者皆可"
    //       })
    //     }else if ((e.detail.value.rentbtn == true && e.detail.value.borrow==0)) {
    //       console.log("没有输入出租价格,请检查!")
    //       that.setData({
    //         warning_hidden: false,
    //         promptText: "请输入出租价格"
    //       })
    //     }else if ((e.detail.value.sellbtn == true && e.detail.value.buy == 0)) {
    //       console.log("没有输入出售价格,请检查!")
    //       that.setData({
    //         warning_hidden: false,
    //         promptText: "请输入出售价格"
    //       })
    //     }else{
    //       that.formSubmit(e);
    //     }  
    // // >>>>>>> tuandui/master
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
                console.log(res.data)
                if(res.data.result.title==null){
               
                  wx.request({
                    url: Url.Url() + 'rentable/saveisbn',
                    data: {
                      title: "自定义书籍",
                      subtitle: "123",
                      author: "2",
                      summary: "3",
                      isbn: that.data.isbn,
                      publisher: "4",
                      pubplace: "5",
                      pubdate: "6",
                      page: "7",
                      price: "8",
                      binding: "9",
                      isbn10: "10",
                      keyword: "11",
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
                  success: function () { //上传图片部分
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
    // =======
    //     //上传书籍信息部分
    //     wx.request({
    //       url: Url.Url() + 'rentable/bookapplication',
    //       data: {
    //         userid: app.globalData.openId,
    //         isbn: that.data.isbn,//isbn号 
    //         rentbtn: e.detail.value.rentbtn,//出租的开关，同卖书
    //         sellbtn: e.detail.value.sellbtn,//卖书的开关，1是卖，0是不卖
    //         rent_price: (e.detail.value.rentbtn == false) ? 0 : e.detail.value.borrow,//出租的价格
    //         sale_price: (e.detail.value.sellbtn == false) ? 0 : e.detail.value.buy,//买书的价格
    //         onlycode: request_id,//上传的图片名关键部分
    //       },
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //       },
    //       method: "POST",
    //       success: function (res) {
    //         //图书不存在时去爬图书信息
    //         if (res.data.result != "exist") {
    //           that.setData({
    //             isbn: res.data.isbn
    //           })
    //           wx.request({
    //             url: "http://api.jisuapi.com/isbn/query?appkey=85c75335fa427fe4&isbn=" + that.data.isbn,
    //             data: {},
    //             header: {},
    //             method: "POST",
    //             //把服务器没有的信息补全给服务器
    //             success: function (res) {
    //               wx.request({
    //                 url: Url.Url() + 'rentable/saveisbn',
    //                 data: {
    //                   title: res.data.result.title,
    //                   subtitle: res.data.result.subtitle,
    //                   picture: res.data.result.pic,
    //                   author: res.data.result.author,
    //                   summary: res.data.result.summary,
    //                   isbn: res.data.result.isbn,
    //                   publisher: res.data.result.publisher,
    //                   pubplace: res.data.result.pubplace,
    //                   pubdate: res.data.result.pubdate,
    //                   page: res.data.result.pagestring,
    //                   price: res.data.result.price,
    //                   binding: res.data.result.binding,
    //                   isbn10: res.data.result.isbn10,
    //                   keyword: res.data.result.keyword,
    //                   edition: res.data.result.edition,
    //                   impression: res.data.result.impression,
    //                   language: res.data.result.language,
    //                   format: res.data.result.format,
    //                   category: res.data.result.class
    //                 },
    //                 header: {
    //                   'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //                 },
    //                 method: "POST"
    //               })
    //             },
    //             fail    : function (res) { },
    //             complete: function (res) { }
    //           })
    //         }
    //         that.setData({
    //           hidden: false
    //         })
    //       },
    //       fail    : function (res) { },
    //       complete: function (res) { },
    //     })
    // // >>>>>>> tuandui/master
    
  },

  bindchange: function (e) {      //更改年级显示出来
    this.setData({
      index: e.detail.value
    })
  },

  // upComplete: function () {        //跳转新页面
  //   wx.showToast({
  //     title: '提交成功!',
  //     icon: '',
  //     image: '',
  //     mask: true,
  //     success: function (res) {
  //       setTimeout(function () {
  //         wx.switchTab({
  //           url: '../users/users'
  //         }, 1500)
  //       })
  //     },
  //   })
  // }
  // remain: function () {        //隐藏警告框
  //   this.setData({
  //     warning_hidden: true
  //   })
  // }
})

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
    index: 10,       //年级
    // warning_hidden: true,
    getcode: "default",
    getpic: "default",
    showwarn: '',
    showModalStatus: false,
    textbook: true,
    publicTextbook: [0, 0, 0],
    array: ['预科', '大一', '大二', '大三', '大四', '大五', '研一', '研二', '研三', '博士', '保密'],
    yuanxi: ['公共', '材料', '电信', '管经', '光电', '化院', '机械', '建工', '建艺', '能动', '人文', '数院', '外院', '物理', '运载', '其他'],
    nianji: ['选修', '大一', '大二', '大三', '大四', '大五', '研究生', '其他'],
    zhonglei: ['教材', '参考书']
  },

  //从服务器获取用户信息
  onLoad: function () {
    var that = this
    wx.showShareMenu()
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
        if (/(977|978|979)+[0-9]{10}/.test(res.result)) {
          that.setData({
            isbn: res.result,
            getcode: "primary",
            showwarn: "ISBN为:" + res.result
          })

        }
        else {
          that.setData({
            getcode: "warn",
            showwarn: "扫描了非法条形码,或本书过老!"
          })
          wx
        }
      },
      fail: function (res) {
        that.setData({
          showwarn: '扫描了非法条形码,或本书过老!',
          getcode: "warn"
        })
      },
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
      continue_input: true
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
    else if (/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(e.detail.value.tel) != 1)
      that.showWarn("手机号码格式不正确")
    else if (!(e.detail.value.rentbtn || e.detail.value.sellbtn))
      that.showWarn("没有选择出租出售")
    else if (/^[0-9]+.?[0-9]*$/.test(e.detail.value.buy) != 1)
      that.showWarn("没有填写价格")
    else
      that.formSubmit(e)

  },
  showWarn: function (str,time=5000) {        //具体显示哪里填写不正确
    wx.showToast({
      title: str,
      image: '',
      icon: 'none',
      mask: true,
      success: function (res) { setTimeout(function () { wx.hideToast() }, time) }
    })
  },

  formSubmit: function (e) {
    var that = this;
    var date = new Date() //9+4
    var bookid
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);


    wx.showLoading({
      title: '上传' + that.data.progress + '%',
      mask: true,
    })

      //保存formID
    wx.request({
      method: "POST",
      url: Url.Url() + 'user/saveFormId',
      data: {
        userid: app.globalData.openId,
        formid: e.detail.formId,
        date: date.getTime()
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      success: function (res) {
        console.log("userid: " + app.globalData.openId)
        console.log("formid: " + e.detail.formId)
        console.log(date.getTime())
      }
    })

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
        console.log(res.data)
        bookid = res.data.bookid
        if(res.data.code==500)
          {
            that.showWarn("服务器维护中",10000)
            return
          }
        else if(res.data.code==404)
          var code=res.data.code
        //图书不存在时去爬图书信息

        that.classifyTextbook(e, bookid)

        const uploadTask = wx.uploadFile({//上传图片部分
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
              success: function (res) {//上传成功
                wx.hideLoading({//隐藏正在上传
                  success: function () {
                    wx.showToast({//显示上传成功
                      title: (code != 404 ? '提交成功！' :'稍后请手动补全图书信息'),
                      mask: true,
                      icon:'none',
                      success: function () {
                        setTimeout(function () {
                          wx.reLaunch({
                            url: '../index/index'
                          })
                        }, 1800)
                      }
                    })
                  }
                })
              },
            })
          },
        })
        uploadTask.onProgressUpdate((res) => {
          var progress=res.progress
          if(typeof(progress) ==='undefined') console.warn("no use")
          wx.showLoading({
            title: '上传' + progress + '%',
            mask: true,
          })
        })
      },
    })

  },
  isTextbook: function (e) {
    var that = this
    var vul = e.detail.value
    that.setData({
      textbook: !vul
    })
  },

  checkTextbook: function (e) {
    var that = this
    var val = e.detail.value
    if (val[0] == 0) {
      that.setData({
        publicTextbook: [0, 0,0]
      })
      if (val[1] != 0 || val[2] != 0)
        wx.showToast({
          title: '公共只有选修教材',
          mask: true,
          icon: 'none',
          success: function (res) {
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
          }
        })
    }
    else
    that.setData({
      publicTextbook: e.detail.value
    })
  },


  classifyTextbook: function (e, bookid) {
    var val = e.detail.value
    var that = this
    if (val.isTextbook)
      wx.request({
        method: "POST",
        url: Url.Url() + 'rentable/classifyTextbook',
        data: {
          isbn: that.data.isbn,
          bookid: bookid,
          sort: val.textbook
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
        }
      })

  },
  changeAge: function (e) {      //更改年级显示出来
    this.setData({
      index: e.detail.value
    })
  },
})


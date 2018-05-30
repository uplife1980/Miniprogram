var app = getApp()
var Url = require('../../url.js');
Page({
  data: {
    openId: app.globalData.openId,
    hidden: true,
    confirm: true,
    bought_list: [],
    borrowing_list: [],
    notborrow_list: [],
    neverborrow_list: [],
    xuming_hidden: true,
    img: '',
    display1: "none",
    bookid: 0,
    day_color: "black",
    hidelist: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var hidelist = new Array();
    hidelist = [true, true, true, true]
    hidelist[parseInt(options.hidelist) + 2] = false,       //5-29这里也有更改+2
      that.setData({
        hidelist: hidelist
      })
    wx.request({
      url: Url.Url() + 'user/viewBookinhand',
      data: {
        userid: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        var data = res.data                             //低效率加入剩余时间,图书名称
        var today = new Date;
        for (var i in data.renting) {
          var days = (data.renting[i].end_time - today.getTime()) / (1 * 24 * 60 * 60 * 1000);
          data.renting[i].days = parseInt(days)
        }


        //字段匹配给包加入phone,由于顺序一致,不需要遍历
        for (var i = 0; i < data.bought.length; i++) {
          data.bought[i].title = data.booktitle[i]
        }
        for (var i = data.bought.length, j = 0; j < data.renting.length; i++ , j++) {
          data.renting[j].title = data.booktitle[i]
        }
        for (var i = data.bought.length + data.renting.length, j = 0; j < data.outdate.length; i++ , j++) {
          data.outdate[j].title = data.booktitle[i]
        }
        for (var i = data.bought.length + data.renting.length + data.outdate.length, j = 0; j < data.rentable.length; i++ , j++) {
          data.rentable[j].title = data.booktitle[i]
        }





        that.setData({
          bought_list: data.bought,
          borrowing_list: data.renting,
          notborrow_list: data.outdate,
          neverborrow_list: data.rentable
        })



      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  renew: function (e) {        //续命
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var that = this
    that.setData({
      bookid: index,
      xuming_hidden: false
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
  //续命表单提交
  renewFormSubmit: function (e) {
    var that = this;
    var index = that.data.bookid;
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    wx.request({
      url: Url.Url() + 'bookdeal/reRentintime',
      data: {
        userid: app.globalData.openId,
        bookid: that.data.borrowing_list[index].id,
        period: e.detail.value.period,
        onlycode: request_id
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
            onlycode: request_id
          },
          success: function () {
            wx.showToast({
              title: '',
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../mybook/mybook'
                  }, 1200)
                })
              }
            })
          }
        })
        // console.log(res.data)
        // var days = (res.data.rented.end_time - date.getTime()) / (1 * 24 * 60 * 60 * 1000);
        // console.log(days)
        // that.data.borrowing_list[index] = res.data.rented;
        // console.log(that.data.borrowing_list[index])
        // that.data.borrowing_list[index].days = parseInt(days)
        // console.log(that.data.borrowing_list[index])
        // that.setData({
        //   borrowing_list: that.data.borrowing_list
        // })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  submitCancel: function () {
    this.setData({
      xuming_hidden: true
    })
  },
  updatePic: function (e) {          //上传新图片
    var that = this;
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var date = new Date() //9+4
    var request_id = date.getTime() * 10000 + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    wx.chooseImage({
      count: 0,
      sizeType: ["compressed"],
      sourceType: [],
      success: function (res) {
        wx.uploadFile({
          url: Url.Url() + 'upload/image',
          filePath: res.tempFilePaths[0],
          name: 'imagefile',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            onlycode: request_id
          }
        }),
          wx.request({
            url: Url.Url() + '/bookdeal/updatepic',
            data: {
              onlycode: request_id,
              bookid: that.data.notborrow_list[index].id,
              //userid: app.globalData.openId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: "POST",
            success: function (res) {
              that.data.notborrow_list[index] = res.data.rentable;
              that.setData({
                notborrow_list: that.data.notborrow_list
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
      }
    })
  },
  repeal1: function (e) {      //操作确认提示框
    this.setData({
      confirm: false,
      tempIndex: e.currentTarget.id.replace(/[^0-9]/ig, "")
    })
  },
  repeal: function (e) {       //撤销此单
    var that = this
    wx.request({
      url: Url.Url() + 'rentable/cancel',
      data: {
        bookid: that.data.neverborrow_list[that.data.tempIndex].id,
        userid: app.globalData.openId
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
                url: '../users/users'
              }, 1500)
            })
          }
        })
      }
        
      
       
    })
  },
  repealCancel: function () {
    this.setData({
      confirm: true
    })
  },
  toastChange: function () {
    this.setData({
      hidden: true
    })
  }
})
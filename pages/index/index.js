var app = getApp();
var Url = require('../../url.js');

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    number: 0,
    allbooks_len: 1,
    size: 8,
    postsList: [],
    hidden: false,
    allStuff: true,
    way: ["不可租售", "出租", "出售", "可租可售"]
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    that.fetchImgListDate();
  },
  lower: function (e) {
    var self = this;
    self.setData({
      number: self.data.number + self.data.size
    });
    self.fetchImgListDate({ number: self.data.number });
  },

  fetchImgListDate: function () {
    var self = this;
    var data = self.data;
    self.setData({
      hidden: false
    });
    if (!data) data = {};
    if (!data.number) data.page = 1;
    if (data.number === 0) {
      self.setData({
        postsList: []
      });
    }
    if (self.data.number <= self.data.allbooks_len) {
      wx.request({
        method: "GET",
        url: 'http://192.168.1.107:8082/BookShare/bookinfo/ofindex',
        data: {
          'startlocation': self.data.number,
          'size': self.data.size
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {

          if (res.data.result.length == 0)
            self.setData({
              allStuff: false
            })
          console.log(res.data)
          self.setData({
            postsList: res.data.result,
            allbooks_len: res.data.len
          })
          //   后续图片传递给网页
          setTimeout(function () {
            self.setData({

              hidden: true
            });
          }, 300);
        }
      })
    }
    else {
      self.setData({
        hidden: true,
        allStuff: false
      })
    }
  },

  //跳转至详情页
  redictDetail: function (e) {
    var number = e.currentTarget.dataset.suitid;
    var link = "../detail/detail?bookid=" + number
    wx.navigateTo({
      url: link
    })
  },
  hiddenAllStuff: function () {
    var that = this;
    that.setData({
      allStuff: true
    })
  },
  search: function (e) {
    var self=this;
    wx.request({
      url: Url.Url() + 'bookinfo/ofsearch',
      data: {
        keyword: e.detail.value
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
      success: function (res) {
        console.log(res.data.result);
        if (res.data.result.length == 0)
          self.setData({
            allStuff: false
          })
        console.log(res.data)
        self.setData({
          postsList: res.data.result,
          allbooks_len: res.data.len
        })
        //   后续图片传递给网页
        setTimeout(function () {
          self.setData({

            hidden: true
          });
        }, 300);

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})
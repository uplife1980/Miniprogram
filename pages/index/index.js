var app = getApp();
var Url = require('../../url.js');

Page({
  data: {
    search_input_default:"",
    number: 0,
    allbooks_len: 1,
    size: 8,
    postsList: [],
    way: ["不可租售", "出租", "出售", "可租可售"]
  },

  onPullDownRefresh: function () {          //下拉动作 
    this.refreshPage()
  },
  onShow: function () {                     //tab切换动作
    this.refreshPage()
  },
  refreshPage: function () {                //刷新postsList
    var that = this
    that.setData({
      search_input_default:"",
      number: 0,
      allbooks_len: 1
    })
    that.fetchImgListDate()
  },
  onLoad: function () {                     //为"我的"tab获取用户信息,原理不明
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
  },
  search: function (e) {                                  //search 的toast最好使用自定义图片
    var that = this;
    wx.request({
      url: Url.Url() + 'bookinfo/ofsearch',
      data: {
        keyword: e.detail.value
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
      success: function (res) {
        console.log(res.data.result.length)
        if (res.data.result.length === 0) {
          wx.showToast({
            image: '',
            title: '暂无此书籍!',
            mask: true,
            success: function (res) { setTimeout(function () { wx.hideToast() }, 5000) },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else {
          that.setData({
            postsList: res.data.result,
            allbooks_len: res.data.len
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  lower: function (e) {               //下拉时触发
    var that = this;
    that.setData({
      number: that.data.number + that.data.size
    });
    that.fetchImgListDate();
  },

  fetchImgListDate: function () {       //get data from server
    var self = this;
    var data = self.data;
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) { setTimeout(function () { wx.hideLoading() }, 1000) },
    })
    if (data.number === 0) {
      self.setData({
        postsList: []
      });
    }
    if (self.data.number <= self.data.allbooks_len) {
      wx.request({
        method: "GET",
        url: Url.Url() + 'bookinfo/ofindex',
        data: {
          'startlocation': self.data.number,
          'size': self.data.size
        },
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          console.log(res.data)
          if (res.data.result.length == 0)
            wx.showToast({
              title: '已浏览全部商品',
              mask: true,
              success: function (res) { setTimeout(function () { wx.hideToast() }, 1500) },
            })
          for (var i in res.data.result) {
            data.postsList.push({
              picture: res.data.result[i].picture,
              id: res.data.result[i].id,
              title: res.data.result[i].title.slice(0,15),
              way: res.data.result[i].way,
              rent_price: res.data.result[i].rent_price,
              sale_price: res.data.result[i].sale_price
            });
          }
          self.setData({
            postsList: data.postsList,
            allbooks_len: res.data.len
          })
          //   后续图片传递给网页

        }
      })
    }
    else {
      wx.showToast({
        title: '已浏览全部商品',
        mask: true,
        success: function (res) { setTimeout(function () { wx.hideToast() }, 1500) },
      })
    }
  },

  //跳转至详情页
  redictDetail: function (e) {
    var number = e.currentTarget.dataset.bookid;
    var link = "../detail/detail?bookid=" + number
    wx.navigateTo({
      url: link
    })
  }

})

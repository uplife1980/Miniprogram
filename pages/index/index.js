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
    hidden_warn : true,
    allStuff: true,
    way: ["不可租售", "出租", "出售", "可租可售"]
  },
  onPullDownRefresh:function(){
    this.refreshPage()
  },
  onShow:function(){
    this.refreshPage()
  },
  refreshPage:function(){
    var that = this
    that.setData({
      number: 0,
      postList: []
    })
    that.fetchImgListDate()
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
    //var that = this;
    //that.fetchImgListDate();
  },
  lower: function (e) {
    wx.stopPullDownRefresh();
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
        url: Url.Url()+'bookinfo/ofindex',
        data: {
          'startlocation': self.data.number,
          'size': self.data.size
        },
        header: {'Content-Type': 'application/json'},
        success: function (res) {
          console.log(res.data)
          for (var i in res.data.result) {
          self.data.postsList.push({
            picture1: res.data.result[i].picture,
            bookindex: res.data.result[i].id,
            name: res.data.result[i].title,
            way: res.data.result[i].way,
            rentprice: res.data.result[i].rent_price,
            saleprice: res.data.result[i].sale_price
          });}
          self.setData({
            postsList: res.data.result,
            allbooks_len: res.data.len
          })
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
    var self = this;
    if(e.detail.value!=''){
      var link = "../infosearch/infosearch?keyword=" + e.detail.value;
      wx.navigateTo({
        url: link
      })
    }else{
      self.setData({
        hidden_warn: false
      })
    }
  }, 
  hidden_warning: function () {
    var that = this;
    that.setData({
      hidden_warn: true
    })
  },
})

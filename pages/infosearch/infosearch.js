var app = getApp();
var Url = require('../../url.js');

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    postsList: [],
    hidden: false,
    allStuff: true,
    keyword : '',
    hidden_warn: true,
    way: ["不可租售", "出租", "出售", "可租可售"]
  },
  /*加载*/
  onLoad: function (e) {
    var that = this;
    console.log(e.keyword)
    that.setData({
      keyword : e.keyword
    })
    that.search();
  },
  lower: function (e) {
    wx.stopPullDownRefresh();
  },
  pagesearch : function(e){
    var that = this;
    var key = e.detail.value;
    if(key!=""){
      that.setData({keyword: key})
      that.search();
    }else{
      that.setData({hidden_warn: false})
    }
  },
  search: function () {
    var self = this;
    wx.request({
      url: Url.Url() + 'bookinfo/ofsearch',
      data: {
        keyword: self.data.keyword
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
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
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
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
  hidden_warning: function () {
    var that = this;
    that.setData({
      hidden_warn: true
    })
  },
})

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
    var data=self.data;
    wx.request({
      url: Url.Url() + 'bookinfo/ofsearch',
      data: {
        keyword: self.data.keyword
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
      success: function (res) {
        if (res.data.result.length == 0)
          wx.showLoading({
            title: '加载中...',
            mask: true,
            success: function (res) { setTimeout(function () { wx.hideLoading() }, 1000) },
          })
        console.log(res.data)
        if (res.data.result.length == 0)
          wx.showToast({
            title: '已浏览全部商品',
            mask: true,
            success: function (res) { setTimeout(function () { wx.hideToast() }, 1500) },
          })
        for (var i in res.data.result) {
          if (res.data.result[i].picture == "")
            res.data.result[i].picture = "../../images/nobook.jpg"
          data.postsList.push({
            picture: res.data.result[i].picture,
            id: res.data.result[i].id,
            title: res.data.result[i].title.slice(0, 15),
            way: res.data.result[i].way,
            rent_price: res.data.result[i].rent_price,
            sale_price: res.data.result[i].sale_price
          });
        }
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
    console.log(e)
    var number = e.currentTarget.dataset.bookid;
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

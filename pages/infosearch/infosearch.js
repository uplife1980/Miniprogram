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
    keyword: '',
    hidden_warn: true,
    way: ["不可租售", "出租", "出售", "可租可售"]
  },
  /*加载*/
  onLoad: function(e) {
    var that = this;
    that.setData({
      keyword: e.keyword
    })
    that.search();
  },
  lower: function(e) {
    wx.stopPullDownRefresh();
  },
  pagesearch: function(e) {
    var that = this;
    var key = e.detail.value;
    if (key != '') {
      that.setData({
        keyword: key
      })
      that.search();
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  search: function() {
    var self = this;
    var data = self.data;
    wx.request({
      url: Url.Url() + 'bookinfo/ofsearch',
      data: {
        keyword: self.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        wx.showLoading({
          title: '加载中...',
          mask: true,
          success: function(res) {
            setTimeout(function() {
              wx.hideLoading()
            }, 1000)
          },
        })
        if (res.data.result.length == 0)
          wx.showToast({
            title: '已浏览全部商品',
            mask: true,
            success: function(res) {
              setTimeout(function() {
                wx.hideToast()
              }, 1500)
            },
          })
        for (var i in res.data.result) {
          var j = i
          if (res.data.result[j].picture === "") { //由于异步循环,所以会在没有赋值完成时i已经发生改变,所以需要保存变量i
            wx.request({
              method: "GET",
              url: Url.Url() + 'bookinfo/nopicture',
              data: {
                bookid: res.data.result[j].id,
                num: j
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function(back) {
                console.log(back)
                // res.data.result[back.data.num].picture = back.data.personalPicture
                data.postsList.push({
                  picture: back.data.personalPicture,
                  id: res.data.result[back.data.num].id,
                  title: res.data.result[back.data.num].title, //.slice(0,15)
                  way: res.data.result[back.data.num].way,
                  rent_price: res.data.result[back.data.num].rent_price,
                  sale_price: res.data.result[back.data.num].sale_price
                });
                self.setData({
                  postsList: data.postsList,
                  allbooks_len: res.data.len
                })
              }
            })
          } else { //没有想到更好的异步处理方法,除非使request为同步请求
            data.postsList.push({
              picture: res.data.result[j].picture,
              id: res.data.result[j].id,
              title: res.data.result[j].title, //.slice(0,15)
              way: res.data.result[j].way,
              rent_price: res.data.result[j].rent_price,
              sale_price: res.data.result[j].sale_price
            });
            self.setData({
              postsList: data.postsList,
              allbooks_len: res.data.len
            })
          }

        }
        self.setData({
          postsList: res.data.result,
          allbooks_len: res.data.len

        })
        setTimeout(function() {
          self.setData({
            hidden: true
          });
        }, 300);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //跳转至详情页
  redictDetail: function(e) {
    console.log(e)
    var number = e.currentTarget.dataset.bookid;
    var link = "../detail/detail?bookid=" + number
    wx.navigateTo({
      url: link
    })
  },
  hiddenAllStuff: function() {
    var that = this;
    that.setData({
      allStuff: true
    })
  },
  hidden_warning: function() {
    var that = this;
    that.setData({
      hidden_warn: true
    })
  },
})
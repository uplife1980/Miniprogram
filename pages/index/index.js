
var ajaxUrl = require('../../utils/url.js');
var app = getApp()
Page({
  data: {
    imgUrls: [

    ],
    name:[],
    borrow:[],
    budy:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    page: 1,
    postsList: [

    ],
    hidden: false
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
    //ajax请求数据
    

     that.fetchImgListDate();
    //  console.log(that.data.postsList)
  },
  //跳转至详情页
  redictDetail: function (e) {
    var userId = e.currentTarget.dataset.userid;
    var suitId = e.currentTarget.dataset.suitid;
    var link = "../detail/detail?viewUserId=" + userId + "&suitId=" + suitId
    wx.navigateTo({
      url: link
    })
  },

  lower: function (e) {
    var self = this;
    self.setData({
      page: self.data.page + 1
    });

    self.fetchImgListDate({ page: self.data.page });
  },

  fetchImgListDate: function (data) {
    var self = this;
    self.setData({
      hidden: false
    });
    if (!data) data = {};
    if (!data.page) data.page = 1;
    if (data.page === 1) {
      self.setData({
        postsList: []
      });
    }
    wx.request({  //注意服务器返回的data.result是一个数组,每次8个
      method: "GET",
      url: ajaxUrl.ajaxUrl() + "?method=index.getChoicenessList",//URL改成自己的服务器
      data: {
        "fromPageId": 0,
        "pageSize": 10,
        "viewUserId": '',
        "page": self.data.page
      },  //记录纸的张数,每页放置的物件
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        // var contentObj = [];
        if (res.data.result == 0) {

          for (var i in res.data.data.result) {
            self.data.postsList.push({
              imgUrl: res.data.data.result[i].image + "?imageMogr/v2/auto-orient/thumbnail/750x/quality/80/",
              userId: res.data.data.result[i].userId,
              suitId: res.data.data.result[i].suitId
            });
          }
        }
        self.setData({
          postsList: self.data.postsList
        })
        //   从传递的data返回给真正的data
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);  //加载中
      }
    })

  }



})




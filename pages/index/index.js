var app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    number: 1,
    postsList: [],
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
    

     that.fetchImgListDate();
  },
  //跳转至详情页
  redictDetail: function (e) {
    var number = e.currentTarget.dataset.suitid;
    var link = "../detail/detail?suitId=" + number
    wx.navigateTo({
      url: link
    })
  },

  lower: function (e) {
    var self = this;
    self.setData({
      number: self.data.number + 8
    });

    self.fetchImgListDate({ number: self.data.number });
  },

  fetchImgListDate: function (data) {
    var self = this;
    self.setData({
      hidden: false
    });
    if (!data) data = {};
    if (!data.number) data.page = 1;
    if (data.number === 1) {
      self.setData({
        postsList: []
      });
    }
    wx.request({  
      method: "GET",
      url:'',//URL变量改成自己的服务器
      data: {
        "number": self.data.number
      }, 
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var way;
          for (var i in res.data.result) {
            switch(res.data.result[i].way)
            {
              case 1:{
                way="出租";
                break;
              }
              case 2:{
                way="出售";
                break;
              }
              case 3:{
               way="可租可售"
              }
            }
            self.data.postsList.push({
              picture1: res.data.result[i].picture1,
              picture2:res.data.result[i].picture2,
              bookindex: res.data.result[i].index,
              name:res.data.result[i].name,
              way:way,
              rentprice: res.data.result[i].rent_price,
              saleprice: res.data.result[i].sale_price
            });
          }

        self.setData({
          postsList: self.data.postsList
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
})
var app = getApp();
Page({
  data: {
    upload_list: [],
    status: ['已经出售', '可以分享', '正被租用', '已经停止分享'],
    stopshare: ['false', 'true', 'false', 'false'],
    continueshare: ['false', 'false', 'false', 'true'],
    phone_hidden:true
  },


  onLoad: function (options) {
    wx.request({
      url: 'http://localhost:8082/BookShare/user/viewsharelog',
      data: {
        userId: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        var data = [{ recording: [] }];
        var stopshare = [];
        var continueshare = [];
        for (var i in res.data.bookinfo) {
          for (j in res.data.logmap[i]) {
            data[i].recording.push({
              id: res.data.logmap[i][j].id,
              deal_time: res.data.logmap[i][j].deal_time
            })
          }

          data.push({
            name: res.data.bookinfo[i].title,
            bookid: res.data.bookinfo[i].bookid,
            author: res.data.bookinfo[i].author,
            status: res.data.bookstatus[i],
            borrower_phone:""
          })
        }
        that.setData({
          upload_list: data
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  stopshare: function (e) {
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var that = this;
    if (that.data.upload_list[index].status === 3) {
      wx.request({
        url: 'http://localhost:8082/BookShare/user/stopshare',
        data: {
          bookid: upload_list[index].bookid,
          
        },
        header: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        success: function (res) {
          var data=that.data.upload_list;
          data[index].phone=res.data.phone
         that.setData({
              upload_list:data,
              phone_hidden:false
         })
          // wx.navigateTo({ url: '../myshare/myshare' })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  continueshare: function (e) {
    var index = e.target.id.replace(/[^0-9]/ig, "");
    wx.request({
      url: '',
      data: {
        openId: app.globalData.openId,
        index: index,
        status: 1
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: function (res) { wx.navigateTo({ url: '../myshare/myshare' }) },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})
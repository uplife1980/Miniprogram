var app=getApp();
Page({
  data: {
  upload_list:[],
  status:['已经出售','可以分享','正被租用','已经停止分享'],
  stopshare: ['false', 'true','false','false'],
  continueshare: ['false', 'false', 'false','true']
  },

  
  onLoad: function (options) {
    wx.request({
      url: '',
      data: {
        openId: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
},
      method: "GET",
      success: function(res) {
        var data=[{recording:[]}];
        var stopshare=[];
        var continueshare=[];
        for (var i in res.data.result.bookinfo) {
          for(j in res.data.result.logmap[i]){
            data[i].recording.push({
              id:res.data.result.logmap[i][j].id,
              deal_time:res.data.result.logmap[i][j].deal_time
            })
          }
        
          data.push({
            name: res.data.result.bookinfo[i].title,
            author:res.data.result.bookinfo[i].author,
            status:res.data.result.bookstatus[i]
          })
        }
        that.setData({
          upload_list: data
        })

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  
  },

  stopshare:function(e){
    var index = e.target.id.replace(/[^0-9]/ig, ""); 
    wx.request({
      url: '',
      data: {
        openId: app.globalData.openId,
        index:index,
        status:3
      },
      header: {
        'Content-Type': 'application/json'
},
      method: "POST",
      success: function (res) { wx.navigateTo({ url: '../myshare/myshare' }) },
      fail: function(res) {},
      complete: function(res) {},
    })
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
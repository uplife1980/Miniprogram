var app=getApp();
Page({

  
  data: {
  postsList:[]
  },
  onload:function(){
    var that=this;
    var data=that.data.postsList;
    wx.request({
      url: '',
      data: {
        openid: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
},
      method: "GET",
      success: function(res) {
      for(var i in res.data.result){
        data.push({
          name:res.data.result[i].name,
          recording:res.data.result[i].recording
        })
      }
      that.setData({
        postsList:data
      })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
  
})
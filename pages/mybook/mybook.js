var app=getApp()
Page({

  data: {
    openId: app.globalData.openId,
    hidden:true,
    comfirm:true,
    bought_list:[],
    borrowing_list:[],
    notborrow_list:[],
    neverborrow_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({          //获取已经购买图书
      url: '',
      data: {
        openId: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
},
      method: "GET",
      success: function(res) {
        var that=this
        _saveVideoToPhotosAlbumSuccessObject.setData({
          bought_list:res.data.bought_list,
          borrowing_list: res.data.borrowing_list,
          notborrow_list: res.data.notborrow_list,
          neverborrow_list: res.data.neverborrow_list
        })
        var today=0;
        var borrowing_list=that.data.borrowing_list;
        for(var i in borrowing_list){
          var endDate = Date.parse(borrowing_list[i].time.replace('/-/g', '/'));  
          var days = (endDate - today)/ (1 * 24 * 60 * 60 * 1000); 
          borrowing_list[i].push({days:days}) 
        }
        that.setData({
          borrowing_list:borrowing_list
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

renew:function(e){        //续命
  wx.request({
    url: '',
    data: {
      openId: app.globalData.openId,
      book_number:e.target.id
    },
    header: {
      'Content-Type': 'application/json'
},
    method: "POST",
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
},

updatePic:function(e){
  var that=this;
  var index = e.target.id.replace(/[^0-9]/ig, ""); 

  wx.chooseImage({
    count: 0,
    sizeType: ["compressed"],
    sourceType: [],
    success: function(res) {
      wx.request({
        url: '',
        data:{
          openId:app.globalData.openId,
          index:index,
          picture: res.tempFilePaths[0]	
        } ,
        header: {
          'Content-Type': 'application/json'
},
        method: "POST",
        success: function(res) {
          that.setData({
            hidden:false
          })
        },
      })
    },
    fail: function(res) {},
    complete: function(res) {},
  })
},

repeal1:function(e){
this.setData({
  comfirm:false
})
},
repeal:function(e){
  var index = e.target.id.replace(/[^0-9]/ig, ""); 

    wx.request({
      url: '',
      data: {
        openId: app.globalData.openId,
        index:index
      },
      header: {
        'Content-Type': 'application/json'
},
      method: "POST",
      success: function(res) {wx.navigateTo({url: '../mybook/mybook'})},
      fail: function(res) {},
      complete: function(res) {},
    })
},
  toastChange: function () {        //信息补全成功并跳转新页面
  this.setData({
    hidden: true
  })
  }
})
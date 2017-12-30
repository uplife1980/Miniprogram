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
      url: 'http://localhost:8082/BookShare/user/viewBookinhand',
      data: {
        userid: app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function(res) {
        var that=this
        _saveVideoToPhotosAlbumSuccessObject.setData({
          bought_list:res.data.bought,
          borrowing_list: res.data.renting,
          notborrow_list: res.data.outdate,
          neverborrow_list: res.data.rentable
        })
        var today=0;
        var borrowing_list=that.data.borrowing_list;
        for(var i in borrowing_list){
          var endDate = Date.parse(borrowing_list[i].period.replace('/-/g', '/'));  
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
  var index = e.target.id.replace(/[^0-9]/ig, ""); 
  wx.request({
    url: 'http://localhost:8082/BookShare/bookdeal/reRent',
    data: {
      userid: app.globalData.openId,
      bookid: borrowing_list[index].bookid
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

updatePic:function(e){          //上传新图片
  var that=this;
  var index = e.target.id.replace(/[^0-9]/ig, ""); 

  wx.chooseImage({
    count: 0,
    sizeType: ["compressed"],
    sourceType: [],
    success: function(res) {
      wx.uploadFile({
        url: 'http://localhost:8082/BookShare/upload/image',
        filePath: res.tempFilePaths[0]	,
        name: 'imagefile',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
          "onlycode": notborrowing_list[index].onlycode,

        },
        success: function (res) { },
        
      })
     
    },
  })
},

repeal1:function(e){      //操作确认提示框
this.setData({
  comfirm:false
})
},
repeal:function(e){       //撤销此单
  var index = e.target.id.replace(/[^0-9]/ig, ""); 

    wx.request({
      url: 'http://localhost:8082/BookShare/rentable/cancel',
      data: {
        bookid:neverborrow_list[index].bookid
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
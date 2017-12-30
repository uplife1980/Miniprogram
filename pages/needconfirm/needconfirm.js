var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  confirm_hidden:true,
  cancel_hidden:true,
  booklist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
  wx.request({
    url: 'http://localhost:8082/BookShare/bookdeal/viewnotconfirm',
    data: {
      userid:app.globalData.openId
    },
    header: {
      'Content-Type': 'application/json'
},
    method:" GET",
    success: function(res) {
      that.setData({
        booklist:res.data.sale
      })
    },
    fail: function(res) {},
    complete: function(res) {},
  })
  },

 confirm:function(e){
   var that=this;
   var index = e.target.id.replace(/[^0-9]/ig, ""); 
   wx.request({
     url: 'http://localhost:8082/BookShare/user/confirm',
     data: {
      bookid:booklist[index].bookid
     },
     header: {
       'Content-Type': 'application/json'
},
     method:"POST",
     success: function(res) {that.setData({
       confirm_hidden:false
     })},
     fail: function(res) {},
     complete: function(res) {},
   })
 },
 cancel: function (e) {
   var index = e.target.id.replace(/[^0-9]/ig, "");
   var that=this
   wx.request({
     url: 'http://localhost:8082/BookShare/user/cancel',
     data: {
       bookid: booklist[index].bookid
     },
     header: {
       'Content-Type': 'application/json'
     },
     method: "POST",
     success: function (res) {that.setData({
       cancel_hidden:false
     })},
     fail: function (res) { },
     complete: function (res) { },
   })
 },
 toastChange1:function(){
   this.setData({
     confirm_hidden:true
   })
   wx.navigateTo({ url: '../needconfirm/needconfirm' })

 },
 toastChange2:function(){
   this.setData({
     cancel_hidden:true
   })
   wx.navigateTo({ url: '../needconfirm/needconfirm' })
 }
})
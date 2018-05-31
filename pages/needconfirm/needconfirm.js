var app=getApp();
var Url = require('../../url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  comfirm_hidden:true,
  cancel_hidden:true,
  booklist_renteds:[],
  booklist_sales:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
  wx.request({
    url: Url.Url()+'bookdeal/viewnotconfirm',
    data: {
      userid:app.globalData.openId
    },
    header: {
      'Content-Type': 'application/json'
},
    method:"GET",
    success: function(res) {
      console.log(res)
      var renteds=res.data.renteds;
      var sales=res.data.sales;
      
      //2018.5.30
      var i=0
      if(renteds&&renteds.length!=0)
      for (;i<renteds.length;i++)    //两个表的顺序完全一致,可以省去匹配的过程
      {
              renteds[i].phone=res.data.salephones[i].originphone
              renteds[i].title=res.data.salephones[i].booktitle
      }
      if(sales)
      for(;i<res.data.salephones.length;i++)
      {
        var j=i-renteds.length
            sales[j].phone=res.data.salephones[i].originphone
            sales[j].title=res.data.salephones[i].booktitle
      }
      that.setData({
        booklist_renteds: renteds,
        booklist_sales: sales
      })
      //
    },
    fail: function(res) {},
    complete: function(res) {},
  })
  },

 comfirm:function(e){
   var that=this;
   var index = e.target.id.replace(/[^0-9]/ig, ""); 
   wx.request({
     url: Url.Url() +'bookdeal/confirm',
     data: {
      bookid:parseInt(that.data.booklist_renteds[index].id)
     },
     header: {
       'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
},
     method:"POST",
     success: function(res) {that.setData({
       comfirm_hidden:false
     })},
     fail: function(res) {},
     complete: function(res) {},
   })
 },
 cancel: function (e) {
   var index = e.target.id.replace(/[^0-9]/ig, "");
   var that=this
   wx.request({
     url: Url.Url() +'bookdeal/cancel',
     data: {
       bookid: that.data.booklist_renteds[index].id
     },
     header: {
       'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
     },
     method: "POST",
     success: function (res) {
       that.setData({
       cancel_hidden:false
     })},
     fail: function (res) { },
     complete: function (res) { },
   })
 },

 comfirm2: function (e) {
   var that = this;
   var index = e.target.id.replace(/[^0-9]/ig, "");
   wx.request({
     url: Url.Url() + 'bookdeal/confirm',
     data: {
       bookid: that.data.booklist_sales[index].id
     },
     header: {
       'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
     },
     method: "POST",
     success: function (res) {
       that.setData({
         comfirm_hidden: false
       })
     },
     fail: function (res) { },
     complete: function (res) { },
   })
 },
 cancel2: function (e) {
   var index = e.target.id.replace(/[^0-9]/ig, "");
   var that = this
   wx.request({
     url: Url.Url() + 'bookdeal/cancel',
     data: {
       bookid: that.data.booklist_sales[index].id
     },
     header: {
       'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
     },
     method: "POST",
     success: function (res) {
       that.setData({
         cancel_hidden: false
       })
     },
     fail: function (res) { },
     complete: function (res) { },
   })
 },
 toastChange1:function(){
   this.setData({
     confirm_hidden:true
   })
   wx.redirectTo({ url: '../needconfirm/needconfirm' })

 },
 toastChange2:function(){
   this.setData({
     cancel_hidden:true
   })
   wx.redirectTo({ url: '../needconfirm/needconfirm' })
 }
})
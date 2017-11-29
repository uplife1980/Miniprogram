// pages/maishu/maishu.js
Page({
  iwantpic: function (e) {
    var that = this
    wx.chooseImage({
      count: 0,
      sizeType: ["compressed"],
      sourceType: [],
      success: function(res) {
        that.setData({
          display: "block"
        })
        var i = 0
        var tempimg=that.data.img
        while (res.tempFilePaths[i]){
          tempimg.push({ imgsrc: res.tempFilePaths[i++] })
          that.setData({
          img:tempimg
          
          })
        }
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  iwantcode:function(e){
    var that=this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function(res) {
        that.setData({
        isbn:res.result
        })

      },
      fail: function(res) {},
      complete: function(res) {
      },
    })
  },
  /**
   * 页面的初始数据
   */

  data: {
    input1: false,
    input2:true,
    isbn: '',
    img:[

    ],
    display:"block",
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  switch1:function(){
    var that=this.data.input1==0?1:0
    this.setData({
      input1:that
    })
  },
  switch2:function () {
    var that = this.data.input2 == 0 ? 1 : 0
    this.setData({
      input2: that
    })
  },
  findbook:function(){
    wx.request({
      url: "https://api.douban.com/v2/book/isbn/:"+that.data.isbn,
      data: {},
      header: {},
      method: "GET",
      dataType: json,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
 
  formSubmit:function(e){
    var that=this;
    wx.request({
      url: 'www.echohuiyin.com',
      data: {
      book:e.detail.value.name,
      isbn:e.detail.value.isbn,
      maishu:e.detail.value.maishu,
      borrow:e.detail.value.borrow,
      chuzu:e.detail.value.chuzu,
      buy:e.detail.value.buy},
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
},
      method: "POST",
      success: function(res) {
       
      },
      fail: function(res) {},
      complete: function(res) {
          console.log("刚才提交的数据是:" + that.data)
      },
    })
  }
 
  
})
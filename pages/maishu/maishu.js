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
          img: res.tempFilePaths,
          display:"block"
        })
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
    img:'',
    display:"none",
   
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
 
  onLoad: function () {
    
},

 
  
})
var app = getApp();
Page({
  data: {
  name:'',
  way:1,
  picture1: "../../img/m.png",
  picture2: "../../img/w.png",
  information: "这是一本好书",
  rentprice:'2333',
  saleprice:'122',
  tel:'',
  checked_man:false,
  checked_woman:true,
  array: ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '其他'],
  index: 0,       //年级
  suitId: 12345,
  disabled: 0,      //不可更改的选项
  canIChange:"checked", //默认是租
  userinfo_hidden: true,    //补全个人信息表
  hidden: true      //信息补全成功
  },

  onLoad: function (options) {            //抓取网址的物品ID
    this.fetchData(options.suitId);
  },

  fetchData: function (suitId) {          //用ID获取全部信息
    var that = this;
    wx.request({
      method: "GET",
      url: 'http://localhost:8082/BookShare/bookinfo/ofdetail',

      data: {
        "index": suitId,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          "name": res.data.name,
          "picture1": res.data.picture,
          "picture2": res.data.picturesec,
          "way": res.data.way,
          "information": res.data.information,
          "rentprice": res.data.rent_price,
          "saleprice": res.data.sale_price

        })
      }

    })

  },

  bindchange: function (e) {          //更改年级显示出来
    this.setData({
      index: e.detail.value
    })
  },

  userCheck: function (e) {       //检查用户是否注册?
    var that = this

    wx.request({
      url: '',
      data: {
        "openId": app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        var that = this
       
          that.setData({ userinfo_hidden: false })
          if (res.data.fail == 0) {
             that.setData({
              tel:res.data.tel,
              checked_man:res.data.checked_man,
              checked_woman:res.data.checked_woman,
              index:res.data.index
             })
          }
       
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  userSubmit: function (e) {      //提交个人信息
    var that = this
    that.setData({
      userinfo_hidden: true,
      hidden: false
    })
    wx.request({
      url: '',
      data: {
        "sex": e.detail.value.sex,
        "tel": e.detail.value.tel,
        "grade": e.detail.value.grade,
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: function (res) {formSubmit(e)},
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toastChange: function () {        //信息补全成功并跳转新页面
    this.setData({
      hidden: true
    })
    wx.navigateTo({url: '../buysuccess/buysuccess'})
  },
  formSubmit: function (e) {    //购买
    var that = this
    that.setData({
      hidden: false
    })
    wx.request({
      url: '',
      data: {
        "openId": app.globalData.openId,
        "index": suitId,
        "way": e.detail.value.way
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
})
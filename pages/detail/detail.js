var Url=require('../../url.js');
var app = getApp();
Page({
  data: {
    name: '',
    way:0,
    picture1: "",
    picture2: "",
    information: "",
    rentprice: '2333',
    saleprice: '122',
    tel: '',
    checked_man: false,
    checked_woman: true,
    array: ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '其他'],
    index: 0,       //年级
    bookid: '',
    disabled: false,      //不可更改的选项
    canIChange: "1", //默认是租
    userinfo_hidden: true,    //补全个人信息表
    hidden: true    ,  //信息补全成功
    peroid_hidden:true,
    rentpriceHidden:false,
    salepriceHidden:false,
     showModalStatus: false 

  },

  onLoad: function (options) {            //抓取网址的物品ID
    this.fetchData(options.bookid)
  },

  fetchData: function (bookid) {          //用ID获取全部信息
    var that = this;
    wx.request({
      method: "GET",
      url: Url.Url()+'bookinfo/ofdetail',

      data: {
        bookid: bookid,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          "name": res.data.detail.title,
          "picture1": res.data.detail.picture,
          "picture2": res.data.rentable.picture,
          way: res.data.rentable.way,
          "information": res.data.rentable.information,
          "rentprice": res.data.rentable.rent_price,
          "saleprice": res.data.rentable.sale_price,
          bookid:res.data.rentable.id
        })
        if(that.data.picture1=='')
          that.setData({
            picture1: "../../images/nobook.jpg"
          })
        switch (that.data.way) {
          case 1: { that.setData({ canIChange: true, disabled: true, peroid_hidden: false,salepriceHidden:true }); break; }
          case 2: { that.setData({ canIChange: false, disabled: true,rentpriceHidden:true }); break; }
          case 3: { that.setData({ canIChange: true, disabled: false,peroid_hidden:false }); break; }
        }
      }
        
    })
    

  },
  rorChange:function(e){               //买租更改时的时长隐藏
  var that=this
        if(e.detail.value==true){
          that.setData({
            peroid_hidden:false
          })
        }
        else
        {
          that.setData({
            peroid_hidden:true
          })
        }
  },

  bindchange: function (e) {          //更改年级显示出来
    this.setData({
      index: e.detail.value
    })
  },
  userCheck: function (e) {       //检查用户是否注册?
    var that = this
    wx.request({
      url: Url.Url()+'user/getUserInfo',
      data: {
        "userid": app.globalData.openId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
       console.log(res.data)
        if (res.data.status === 0) { 
          that.setData({showModalStatus:true })      }
        else{
          that.formSubmit(e)
        }
      },
    })
  },
  userSubmit: function (e) {      //提交个人信息 
    var that = this
    that.setData({
      userinfo_hidden: true,
    })
    var sex;
    sex=(e.detail.value.sex==="man")?"man":"woman";
    console.warn(sex)
    wx.request({
      url: Url.Url() + 'user/complementInfo',
      data: {
        userid: app.globalData.openId,
        sex: e.detail.value.sex,
        phone: e.detail.value.tel,
        grade: e.detail.value.grade
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) { that.setData({ showModalStatus: false }) },
    })
  },
  peroid_check:function(e){
    var that=this;
  console.log(that.data.picture2)
  if (e.detail.value == 0) {
    that.setData({ peroid_hidden: true })
  }
  else {
    that.setData({ peroid_hidden: false })
  }
  },
  
  formSubmit: function (e) {    //购买
    var that = this
    var period = e.detail.value.peroid;
    
    if(e.detail.value.way==0)
    {
      period=1024;
    }
    wx.request({
      url: Url.Url()+'bookdeal/trade',
      data: {
        userid: app.globalData.openId,
        bookid: that.data.bookid,
        rorbtn: e.detail.value.way,
        period: period
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
      success: function (res) { 
        if(res.data.result=='badrequest')
        {
          wx.showToast({
            title: '图书已经被别人借走啦',
            icon:"none",
          })
          return 
        }
        that.setData({
          hidden: false
        })
        setTimeout(function () {
         
              wx.navigateTo({
                url: '../buysuccess/buysuccess?phone='+res.data.phone
              })
            },760)        
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },




// 模态弹窗
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }

})
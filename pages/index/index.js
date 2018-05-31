var app = getApp();
var Url = require('../../url.js');

Page({
  data: {
    welcomeText:"测试期间暂时仅开通卖书功能。 租书功能即将上线, 敬请期待",
    welcomeTitle:"欢迎使用租书平台",
    search_input_default:"",
    number: 0,
    allbooks_len: 1,
    size: 8,
    postsList: [],
    way: ["不可租售", "出租", "出售", "可租可售"],
    showModalStatus: false            //自定义模态弹窗

  },
  onReady:function(){                       //由卖书转过来
    this.refreshPage()
  },
  onPullDownRefresh: function () {          //下拉动作 
    this.refreshPage()
  },
  onShow: function () {                     //tab切换动作
    this.refreshPage()
  },
  refreshPage: function () {                //刷新postsList
    var that = this
    that.setData({
      search_input_default:"",
      number: 0,
      allbooks_len: 1
    })
    that.fetchImgListDate()
  },
  onLoad: function () {                   //2018.5.29增加开屏提示
  var that=this
  setTimeout(function(){
  that.powerDrawer("open");
  },1000
  )
  },
  search: function (e) {                                  //search 的toast最好使用自定义图片
    var that = this;
    wx.request({
      url: Url.Url() + 'bookinfo/ofsearch',
      data: {
        keyword: e.detail.value
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: "POST",
      success: function (res) {
        if (res.data.result.length === 0) {
          wx.showToast({
            image: '',
            title: '暂无此书籍!',
            mask: true,
            success: function (res) { setTimeout(function () { wx.hideToast() }, 5000) },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else {
          that.setData({
            postsList: res.data.result,
            allbooks_len: res.data.len
            
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  getUserInfo:function(e){
    app.globalData.userInfo=e.detail.userInfo
  },
  lower: function (e) {               //下拉时触发
    var that = this;
    that.setData({
      number: that.data.number + that.data.size
    });
    that.fetchImgListDate();
  },

  fetchImgListDate: function () {       //get data from server
    var self = this;
    var data = self.data;
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) { setTimeout(function () { wx.hideLoading() }, 1000) },
    })
    if (data.number === 0) {
      self.setData({
        postsList: []
      });
    }
    if (self.data.number <= self.data.allbooks_len) {
      wx.request({
        method: "GET",
        url: Url.Url() + 'bookinfo/ofindex',
        data: {
          'startlocation': self.data.number,
          'size': self.data.size
        },
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          console.log(res.data)
          if (res.data.result.length == 0)
            wx.showToast({
              title: '已浏览全部商品',
              mask: true,
              success: function (res) { setTimeout(function () { wx.hideToast() }, 1500) },
            })
          for (var i in res.data.result) {
            if(res.data.result[i].picture=="")
            res.data.result[i].picture="../../images/nobook.jpg"
            data.postsList.push({
              picture: res.data.result[i].picture,
              id: res.data.result[i].id,
              title: res.data.result[i].title.slice(0,15),
              way: res.data.result[i].way,
              rent_price: res.data.result[i].rent_price,
              sale_price: res.data.result[i].sale_price
            });
          }
          self.setData({
            postsList: data.postsList,
            allbooks_len: res.data.len
          })
        }
      })
    }
    else {
      wx.showToast({
        title: '已浏览全部商品',
        mask: true,
        success: function (res) { setTimeout(function () { wx.hideToast() }, 1500) },
      })
    }
  },

  //跳转至详情页
  redictDetail: function (e) {
    var number = e.currentTarget.dataset.bookid;
    var link = "../detail/detail?bookid=" + number
    wx.navigateTo({
      url: link
    })

  },
  // hiddenAllStuff: function () {
  //   var that = this;
  //   that.setData({
  //     allStuff: true
  //   })
  // },
  search: function (e) {
    var self = this;
    if(e.detail.value!=''){
      var link = "../infosearch/infosearch?keyword=" + e.detail.value;
      wx.navigateTo({
        url: link
      })
    }else{
      self.setData({
        hidden_warn: false
      })
    }
  }, 
  
  hidden_warning: function () {
    var that = this;
    that.setData({
      hidden_warn: true
    })
  },


  //自定义模态弹窗套件
  powerClose:function(e){           //因为需要开平显示,所以只能手动导入变量
    this.powerDrawer("close")
  },
  powerDrawer: function (e) {
    var currentStatu =e;
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

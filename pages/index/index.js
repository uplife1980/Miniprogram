var app = getApp();
var Url = require('../../url.js');

Page({
  data: {
    welcomeText: "您既可以在[我的]界面发布图书并留下联系方式，也可以在[首页]挑拣心怡的图书（支持搜索）。\n点击购买，即可获得卖家的联系方式（通过线下完成交易）。",
    welcomeText2: "意见反馈:echo_huiyin@163.com",
    welcomeTitle: "迎新季",
    search_input_default: "",
    keyword: null,
    number: 0, //已有图书书目
    allbooks_len: 1, //数据库所有图书
    size: 8, //每次请求图书数量,可改
    postsList: [],
    way: ["不可租售", "出租", "出售", "可租可售"],
    showModalStatus: false //自定义模态弹窗

  },
  onReady: function () { //由卖书转过来
    this.refreshPage()

  },
  onPullDownRefresh: function () { //下拉动作 
    this.refreshPage()
  },
  onShow: function () { //tab切换动作,查看完detail之后的返回
  },
  refreshPage: function () { //刷新postsList
    var that = this
    that.setData({
      search_input_default: "",
      number: 0,
      allbooks_len: 1
    })
    that.fetchImgListDate()
  },
  onLoad: function () { //2018.5.29增加开屏提示
    var that = this
    setTimeout(function () {
      that.powerDrawer("open");
    }, 1000)
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
  },
  search: function (e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        number: 0,
        keyword: e.detail.value,
        allbooks_len: 1
      })
      that.fetchImgListDate(e.detail.value)

    }

    // wx.request({
    //   url: Url.Url() + 'bookinfo/ofsearch',
    //   data: {
    //     keyword: e.detail.value
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //   },
    //   method: "POST",
    //   success: function(res) {
    //     var data = that.data
    //     console.log(res.data)
    //     if (res.data.result.length === 0) {
    //       wx.showToast({
    //         image: '',
    //         icon: 'none',
    //         title: '暂无此书籍!',
    //         mask: true,
    //         success: function(res) {
    //           setTimeout(function() {
    //             wx.hideToast()
    //           }, 5000)
  
    //         },
    //         fail: function(res) {},
    //         complete: function(res) {},
    //       })
    //     } else {  //搜索有书
    //       that.setData({
    //         postsList: [],
    //         search_input_default:e.detail.value
    //       })
    //       for (var i in res.data.result) { //给每个没有图片的书返回个人图片
    //         var j = i
    //         if (res.data.result[j].picture === "") { //由于异步循环,所以会在没有赋值完成时i已经发生改变,所以需要保存变量i
    //           wx.request({
    //             method: "GET",
    //             url: Url.Url() + 'bookinfo/nopicture',
    //             data: {
    //               bookid: res.data.result[j].id,
    //               num: j
    //             },
    //             header: {
    //               'Content-Type': 'application/json'
    //             },
    //             success: function(back) {
    //               console.log(back)
    //               // res.data.result[back.data.num].picture = back.data.personalPicture
    //               data.postsList.push({
    //                 picture: back.data.personalPicture,
    //                 id: res.data.result[back.data.num].id,
    //                 title: res.data.result[back.data.num].title, //.slice(0,15)
    //                 way: res.data.result[back.data.num].way,
    //                 rent_price: res.data.result[back.data.num].rent_price,
    //                 sale_price: res.data.result[back.data.num].sale_price
    //               });
    //               that.setData({
    //                 postsList: data.postsList,
    //                 allbooks_len: res.data.len
    //               })
    //             }
    //           })
    //         } else { //没有想到更好的异步处理方法,除非使request为同步请求
    //           data.postsList.push({
    //             picture: res.data.result[j].picture,
    //             id: res.data.result[j].id,
    //             title: res.data.result[j].title, //.slice(0,15)
    //             way: res.data.result[j].way,
    //             rent_price: res.data.result[j].rent_price,
    //             sale_price: res.data.result[j].sale_price
    //           });
    //           that.setData({
    //             postsList: data.postsList,
    //             allbooks_len: res.data.len
    //           })
    //         }

    //       }

    //     }
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    else //搜索框为空时,直接使用原来方法
    {
      that.fetchImgListDate()
      that.setData({
        keyword: null
      })
    }
  },

  lower: function (e) { //下拉时触发
    var that = this;
    that.setData({
      number: that.data.postsList.length //现有图书+新
    });
    that.fetchImgListDate(that.data.keyword);
  },

  fetchImgListDate: function (keyword = "") { //重要! 从服务器获取图书信息,触发情况包含直接刷新,搜索,下拉
    var self = this;
    var data = self.data;
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      },
    })
    if (data.number === 0) { //前面利用number置0来刷新
      self.setData({
        postsList: []
      });
    }
    if (self.data.number < self.data.allbooks_len) {
      wx.request({
        method: "GET",
        url: Url.Url() + 'bookinfo/ofindex',
        data: {
          startlocation: self.data.number,
          size: self.data.size,
          keyword: keyword
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.result.length == 0) { //当图书返回数==0
            wx.showToast({//用于没有搜索到书,第一次查看完所有图书也会显示
              image: '',
              icon: 'none',
              title: '没有找到书~',
              mask: true,
              success: function (res) {
                setTimeout(function () {
                  wx.hideToast()
                }, 5000)
              }
              
            })
            return
          }
          self.setData({
            allbooks_len: res.data.len
          })
          for (var i in res.data.result) { //给每个没有图片的书返回个人图片
            if (res.data.result[i].picture === "") {
              that.usePersonalPic(res.data.result[i], i)
            } else {
              that.addtoPostsList(res.data.result[i])
            }
          }
        },
        complete:function()
        {
        },
        fail:function()
        {
            wx.showToast({//用于没有搜索到书,第一次查看完所有图书也会显示
              image: '',
              icon: 'none',
              title: '服务器维护 , 或者你的网络有问题',
              mask: true,
              success: function (res) {
                setTimeout(function () {
                  wx.hideToast()
                }, 15000)
              }

            })
          
        }
      })
    } else {//不是self.data.number < self.data.allbooks_len的情况
      wx.showToast({
        title: '已浏览全部商品',
        mask: true,
        success: function (res) {
          setTimeout(function () {
            wx.hideToast()
          }, 1500)
        },
      })
    }
  },

  //使用自定义图片去替代item.picture
  usePersonalPic: function (item, j) {
    var that = this
    wx.request({
      method: "GET",
      url: Url.Url() + 'bookinfo/nopicture',
      data: {
        bookid: item.id,
        num: j
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        item.picture = res.data.personalPicture
        that.addtoPostsList(item)
      }
    })
  },

  //将每一个item加入到postsList
  addtoPostsList: function (item) {
    var that=this
    var postsList=that.data.postsList
    postsList.push(item);
    that.setData({
      postsList:postsList,
      number:that.data.number+1
    })
  },
  //跳转至详情页
  redictDetail: function (e) {
    var number = e.currentTarget.dataset.bookid;
    var link = "../detail/detail?bookid=" + number
    wx.navigateTo({
      url: link
    })

  },



  hidden_warning: function () {
    var that = this;
    that.setData({
      hidden_warn: true
    })
  },


  //自定义模态弹窗套件
  powerClose: function (e) { //因为需要开平显示,所以只能手动导入变量
    this.powerDrawer("close")
  },
  powerDrawer: function (e) {
    var currentStatu = e;
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
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  }
})
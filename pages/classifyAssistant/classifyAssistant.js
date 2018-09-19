var app = getApp();
var Url = require('../../url.js');

Page({
  data: {
    search_input_default: "",
    keyword: [],
    number: 0, //已有图书书目
    allbooks_len: 1, //数据库所有图书
    size: 8, //每次请求图书数量,可改
    postsList: [],
    way: ["不可租售", "出租", "出售", "可租可售"],
    textbook: [
      ['公共', '材料', '电信', '管经', '光电', '化院', '机械', '建工', '建艺', '能动', '人文', '数院', '外院', '物理', '运载', '其他'],
      ['选修', '大一', '大二', '大三', '大四', '大五', '研究生', '其他'],
      ['教材', '参考书']
    ], //种类的罗列
    sort: [0, 0, 0], //种类的选择
  },

  onReady: function() { //由卖书转过来
  },

  refreshPage: function() { //刷新postsList
    var that = this
    that.setData({
      search_input_default: "",
      number: 0,
      allbooks_len: 1
    })
    that.fetchImgListDate()
  },
  onLoad: function() {
    var that = this
    wx.showShareMenu()
  },
  forbidMove: function() { //防止滚动穿越
  },

  search: function(e) {
    var that = this;
    if (e.detail.value) {
      var val = e.detail.value.split(" ")
      that.setData({
        number: 0,
        keyword: e.detail.value,
        allbooks_len: 1,
        hideSearchDrawer: true
      })
      that.fetchImgListDate(val)
    }
     else //搜索框为空时,直接使用原来方法
    {
      that.setData({
        keyword: [],
        number: 0,
        allbooks_len: 1,
        hideSearchDrawer: true

      })
      that.fetchImgListDate()

    }
  },

  lower: function(e) { //下拉时触发
    var that = this;
    var keyword = that.data.keyword
    if (keyword[0])
      keyword = keyword.split(" ")
    that.setData({
      number: that.data.postsList.length //现有图书+新
    });
    that.fetchImgListDate(keyword);
  },

  fetchImgListDate: function(keyword = []) { //重要! 从服务器获取图书信息,触发情况包含直接刷新,搜索,下拉
    var that = this;
    var data = that.data;
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      },
    })
    if (data.number === 0) { //前面利用number置0来刷新
      that.setData({
        postsList: []
      });
    }
    if (that.data.number < that.data.allbooks_len) {
      wx.request({
        method: "POST",
        url: Url.Url() + 'bookinfo/byClassify',
        data: {
          startlocation: that.data.number,
          size: that.data.size,
          keyword: keyword,
          sort: that.data.sort
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          console.log(res.data)
          if (res.data.result.length == 0) { //当图书返回数==0
            wx.showToast({ //用于没有搜索到书,第一次查看完所有图书也会显示
              image: '',
              icon: 'none',
              title: '没有找到书~',
              mask: true,
              success: function(res) {
                setTimeout(function() {
                  wx.hideToast()
                }, 5000)
              }

            })
            return
          }
          that.setData({
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
        complete: function() {},
        fail: function() {
          wx.showToast({ //用于没有搜索到书,第一次查看完所有图书也会显示
            image: '',
            icon: 'none',
            title: '服务器维护 , 或者你的网络有问题',
            mask: true,
            success: function(res) {
              setTimeout(function() {
                wx.hideToast()
              }, 15000)
            }

          })

        }
      })
    } else { //不是that.data.number < that.data.allbooks_len的情况
      wx.showToast({
        title: '已浏览全部商品',
        mask: true,
        success: function(res) {
          setTimeout(function() {
            wx.hideToast()
          }, 1500)
        },
      })
    }
  },

  //使用自定义图片去替代item.picture
  usePersonalPic: function(item, j) {
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
      success: function(res) {
        console.log(res)
        item.picture = res.data.personalPicture
        that.addtoPostsList(item)
      }
    })
  },

  //将每一个item加入到postsList
  addtoPostsList: function(item) {
    var that = this
    var postsList = that.data.postsList
    postsList.push(item);
    that.setData({
      postsList: postsList,
      number: that.data.number + 1
    })
  },
  //跳转至详情页
  redictDetail: function(e) {
    var number = e.currentTarget.dataset.bookid;
    var link = "../detail/detail?bookid=" + number
    wx.navigateTo({
      url: link
    })

  },
  requestSort: function(e) { //承担修改参数的任务,同时用来请求图书和消除暗层
    var that = this
    var val = e.detail.value
    wx.setNavigationBarTitle({
      title: that.data.textbook[0][val[0]]+that.data.textbook[1][val[1]]+that.data.textbook[2][val[2]],
    })
    console.log(val)
    that.setData({
      sort: val,
      number: 0,
      allbooks_len: 1,
    })
    that.fetchImgListDate()
  },

  hidden_warning: function() {
    var that = this;
    that.setData({
      hidden_warn: true
    })
  },

})
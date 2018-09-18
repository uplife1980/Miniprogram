var app = getApp();
var Url = require('../../url.js');
Page({
  data: {
    upload_list: [],
    status: ['已经售出', '已经停止分享', '正被租用', '处于空闲状态'],
    stopshare: [false, false, false, true],
    continueshare: [false, true, false, false],
    phone_hidden: true,
  },
  onLoad: function (options) {
    var that = this
    wx.showShareMenu()

    wx.request({
      url: Url.Url() + 'user/viewsharelog',
      data: {
        userid: app.globalData.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var templist = [];
        var size = 0;
        var today = new Date;
        for (var key in res.data.logmap) {
          if (key == 0) continue;
          var logmaplist = [];
          var tempinfo = {};
          logmaplist = res.data.logmap[key];
          tempinfo.logmap = logmaplist;
          for (var num in logmaplist) {
            var days = parseInt((today.getTime() - logmaplist[num].deal_time) / (1 * 24 * 60 * 60 * 1000));
            tempinfo.logmap[num].time = days;
          }
          tempinfo.bookstatus = res.data.bookstatus[key];
          tempinfo.info = res.data.bookinfo[key];
          tempinfo.bookid = key;
          tempinfo.phone = 0;
          templist[size] = tempinfo;
          size++;
        }
        that.setData({
          upload_list: templist,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  stopshare: function (e) {
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var that = this;
    wx.request({
      url: Url.Url() + 'user/stopshare',
      data: {
        bookid: parseInt(that.data.upload_list[index].bookid),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: "POST",
      success: function (res) {
        var tempdata = that.data.upload_list;
        if (res.data.status == 1) {
          tempdata[index].phone = res.data.result;
          tempdata[index].bookstatus = 1;
          that.setData({
            upload_list: tempdata,
            phone_hidden: false
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  continueshare: function (e) {
    var that = this;
    var index = e.target.id.replace(/[^0-9]/ig, "");
    var link = "../resumeshare/resumeshare?bookid=" + that.data.upload_list[index].bookid;
    wx.navigateTo({
      url: link
    })
  }
})
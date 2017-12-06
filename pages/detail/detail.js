var app = getApp();
Page({
  data: {
  name:'',
  way:1,
    picture1: "",
    picture2:"",
    information: "",
    rentprice:'',
    saleprice:''
  },
  onLoad: function (options) {
    this.fetchData(options.suitId);


  },
  fetchData: function (suitId) {
    var that = this;
    wx.request({
      method: "GET",
      url: '',      //服务器地址

      data: {
        "index": suitId,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
          console.log(res)
          that.setData({
            "name":res.data.name,
            "picture1": res.data.picture2,
            "picture2":res.data.picture1,
            "way":res.data.way,
            "information":res.data.information,
            "rentprice":res.data.rent_price,
            "saleprice":res.data.sale_price
            
          })
      }

    })

  }
})
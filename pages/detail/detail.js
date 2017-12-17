var app = getApp();
Page({
  data: {
  name:'',
  way:1,
    picture1: "",
    picture2: "",
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
            "name":res.data.name,
            "picture1": res.data.picture,
            "picture2":res.data.picturesec,
            "way":res.data.way,
            "information":res.data.information,
            "rentprice":res.data.rent_price,
            "saleprice":res.data.sale_price
            
          })
      }

    })

  }
})
import { request } from "../../request/index.js"
//Page Object
Page({
  data: {
    swiperList: [],
    catesList:[],
    floorList:[]
  },
  //options(Object)
  // 页面开始加载 就会触发 
  onLoad: function(options) {
    // 原始封装
    //   wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  }, 

  // 获取轮播图数据
  getSwiperList(){
        // 调用封装好的request函数 ， 用的是ES6 Promise 方法
        request({url:"/home/swiperdata"}).then(result=>{
          // result.forEach((v, i) = {
          //   result[i].navigator_url = v.navigator_url.replace(main, index)
          // });
          this.setData({
            swiperList: result
      })
    })
  },

  // 获取分类数据
  getCatesList(){
    request({url:"/home/catitems"}).then(result=>{
          this.setData({
            catesList: result
          })
        })
  },

// 获取楼层数据
getFloorList(e){
  request({url:"/home/floordata"}).then(result=>{
    this.setData({
      floorList:result
    })
  })
},

  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  
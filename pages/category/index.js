import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
  },
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCates();
        /* 
    0 web中的本地存储和 小程序中的本地存储的区别
      1 写代码的方式不一样了 
        web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2:存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
      小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
    1 先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求 
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */
        //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
        // 此处 cates 相当于 key 值，用来和存储到本地存储时候的key值相对应，以便能够成功获取到本地存储的数据
        const Cates = wx.getStorageSync("cates");
        // 2 判断
        if(!Cates){
          // console.log("本地存储为空，重新获取数据");
          this.getCates();
        }else{
          if(Date.now()-Cates.time>1000*10){
            this.getCates();
          }else{
          // console.log("本地存储有值，可利用本地数据");
            this.Cates = Cates.data;
            let leftMenuList = this.Cates.map(v => v.cat_name);
            let rightContent = this.Cates[0].children;
            this.setData({
              leftMenuList,
              rightContent
            })
          }
        }
  },
 

// 点击切换事件，并动态切换选中活跃状态
handleItemTap(e) {
  /* 
  1 获取被点击的标题身上的索引
  2 给data中的currentIndex赋值就可以了
  3 根据不同的索引来渲染右侧的商品内容
   */
  // e.currentTarget.dataset 会获取有事件的那个元素，即class="menu_item" 的 view
  const { index } = e.currentTarget.dataset;

  let rightContent = this.Cates[index].children;
  this.setData({
    currentIndex: index,
    rightContent,
    // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
    scrollTop: 0
  })

},

// 获取分类数据
async getCates(){
  // request({url:"categories"}).then(res=>{
  //   // console.log(res);
  //   // 获取分类的总数据
  //   this.Cates = res.data.message;
  //   // 把接口的数据存入到本地存储中
  //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });   
  //   // 构造左侧的大菜单数据
  //   let leftMenuList = this.Cates.map(v => v.cat_name);
  //   // 构造右侧的商品数据
  //   let rightContent = this.Cates[0].children;
  //   // 将获取到的数据存入定义的数组中
  //   this.setData({
  //     leftMenuList,
  //     rightContent
  //   })
  // })

  
    // 1 使用es7的async await来发送请求
    const result = await request({url:"/categories"});
    // this.Cates = res.data.message;
    this.Cates = result;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });   
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    // 将获取到的数据存入定义的数组中
    this.setData({
      leftMenuList,
      rightContent
    })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
    import { request } from "../../request/index.js";
    import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    car:[],
    isCollect:false
  },
  // 定义全局属性存储获取到的数据对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面显示
   */
   onShow: function () {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const { goods_id } = options;
    // // console.log(goods_id);
    // this.getGoodsDetail(goods_id);
    // 已经由onShow()替换
  },

  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({ url:"/goods/detail", data:{goods_id} });
    this.GoodsInfo = goodsObj;
    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断当前商品是否被收藏
    // 数组的some()方法,传入的是一个回调函数，若有一个为true，则返回值为true，作用于every()方法相反
    let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 绑定点击轮播图图片显示大图预览效果
  handlePreviewImage(e){
       // 1 先构造要预览的图片数组
       const urls = this.GoodsInfo.pics.map((v,i)=>v.pics_mid);
       // 2 接收传递过来的图片url
      //  current 里面存的是当前点击图片的地址
      const current = e.currentTarget.dataset.url;
      wx.previewImage({
        current,  // 当前显示图片的http链接
        urls    // 需要预览的图片http链接列表
    });
  },

  // 添加到购物车事件
  handleCartAdd(e){
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    // 判断商品对象是否存在于购物车数组中
    const index = cart.findIndex((v,i)=>v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      // 商品对象不存在于购物车数组中,第一次添加
      // 设置商品数量为1
      this.GoodsInfo.num = 1;
      // 设置当前商品为选中状态
      this.GoodsInfo.checked = true;      
      // 将商品对象push进cart数组中
      cart.push(this.GoodsInfo);
    }else{
      // 商品对象存在于购物车数组中，只需要将商品数量++
      cart[index].num++;
    }
    // 把购物车数组重新添加进缓存、
    wx.setStorageSync('cart', cart);
    // 加入弹框提示
    wx.showToast({
      title: '添加成功',
      icon:"success",
      // 防止用户手抖，在短时间内重复点击多次，在第一次点击1.5s后才可进行第二次点击
      mask:true
    })
  },

  // 点击收藏商品并修改收藏图标状态
  handleCollect(e){
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断商品是否已被收藏过
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    // 当index = -1时，说明收藏数组中没有点击的这个商品，则将该商品存入到缓存collect里，并修改收藏图标状态
    // 否则收藏数组中存在当前点击的商品，只需要修改收藏图标的状态，并将该商品从缓存数组collect中删除
    if(index === -1){
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title:"收藏成功",
        icon:"success",
        mask:true
      });
    }else{
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title:"取消成功",
        icon:"success",
        mask:true
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
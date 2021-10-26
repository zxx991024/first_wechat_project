
/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
  import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
  // import {showModal,showToast,requestPayment} from '../../utils/asyncWx.js';
  import regeneratorRuntime from '../../lib/runtime/runtime';
  import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  onShow: function () {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // every 数组方法，会遍历循环  接受一个回调函数 如果每一个函数都返回true，那么every方法返回true ，
    // 只要有一个回调函数返回了false ，那么便停止循环，直接返回false
    cart = cart.filter(v=>v.checked);
    this.setData({address});
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v,i)=>{
        totalPrice += v.goods_price * v.num;
        totalNum += v.num; 
    });
    this.setData({
      address,totalNum,totalPrice,cart
    });
  },

  // 支付点击效果
  async handleOrderPay(e){

    // 拥有企业账号时，能够获取到正确的token值执行
    // try {
    //       // console.log(11);
    // const token = wx.getStorageSync('token');
    // // 判断缓存中是否存在token，若不存在则跳转到结算授权页面
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index',
    //   })
    //   return;
    // }
    // // 创建订单，并获取订单编号(获取创建订单需要的参数)
    //   // 准备请求头参数
    // const header = {Authorization:token}
    // // console.log(header);
    // const order_price = this.data.totalPrice;
    // const consignee_addr = this.data.address.all;
    // // console.log(consignee_addr);
    // const cart = this.data.cart;
    // let goods = [];
    // cart.forEach(v=>goods.push({
    //     goods_id:v.goods_id,
    //     goods_number:v.num,
    //     goods_price:v.goods_price
    // }));
    // const orderParams = {order_price,consignee_addr,goods}
    // // 准备发送请求，创建订单 获取订单编号
    // const {order_number} = await request({url:"/my/orders/create",method:"POST",data:orderParams});
    // // console.log(order_number);
    // // 发起 预支付接口(获取支付参数)
    // const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}})
    // // 发起微信支付
    // await requestPayment(pay);
    // // 查询后台 获取订单状态
    // const res = await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}});
    // // 提示已经支付成功
    // await showToast({ title: "支付成功" });
    // // 删除缓存中的已支付的商品，防止其重复出现在购物车
    //   // 首先获取缓存中的cart数组
    // let newCart = wx.getStorageSync('cart');
    //   // 使用filter过滤器，过滤所有选中的商品，将未被选中的商品保留在数组中
    // newCart = newCart.filter(v=>!v.checked);
    //   // 再将过滤之后的新数组存入缓存中
    // wx.setStorageSync('cart', newCart);
    // // 支付成功后，跳转到订单页面
    // wx.navigateTo({
    //   url: '/pages//order/index',
    // })
    // } catch (error) {
    //   await showToast({ title: "支付失败" })
    //   console.log(error);
    // }
    
    const token = wx.getStorageSync('token');
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return;
    }
    await showToast({title:"支付成功"});
    // 清空已支付的商品
    let newCart = wx.getStorageSync('cart');
    newCart = newCart.filter(v=>!v.checked);
    // 将过滤后的数组重新存入缓存
    wx.setStorageSync('cart', newCart);
    wx.switchTab({
      url: '/pages/cart/index',
    })
  }
})
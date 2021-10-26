  import regeneratorRuntime from '../../lib/runtime/runtime';
  import {showModal} from '../../utils/asyncWx.js';
Page({
  async handleGetUserInfo(e){
    console.log(e);
    // // 获取token的参数
    // const {encryptedData,rawData,iv,signature} = e.detail;
    // // 获取 执行小程序登录后获取 的code
    // const {code} = await login();
    // const loginParams = {encryptedData,rawData,iv,signature,code};
    // // 根据获取到的token参数发送请求获取token请求
    // const {token} = await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    // // 将token存入到缓存中，以便供上一层进行使用判断，并且返回上一层
    // wx.setStorageSync('token', token);

    // 因为我们的id不是商业账户，所以无法成功获取token，这里使用了假数据
    const res = await showModal({content:"是否授权"});
    if(res.confirm){
      wx.setStorageSync('token', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
    }
      wx.navigateBack({
      delta:1
    })
  }
})
// pages/login/index.js
Page({
  handleGetUserInfo(e){
    // console.log(e);
    // const res = wx.getUserProfile({
    //   desc:"学习",
    // });
    // console.log(res);

    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', //不写不弹提示框
      success: function (res) {
        // console.log("获取成功:", res)
        // 解构获取授权得来的用户信息（头像，昵称，地址等）
        const {userInfo} = res;
        // 将获取到的信息存入缓存中
        wx.setStorageSync('userinfo', userInfo);
        wx.navigateBack({
          delta:1
        })
      },
      fail: function (err) {
        console.log(err)
        wx.navigateBack({
          delta:1
        })
      }
    })
  }
})
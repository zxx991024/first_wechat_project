/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      },
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    inputValue:""
  },
    // 外网的图片的路径数组
    UpLoadImgs: [],

  // 顶部导航点击事件
  handleTabsItemChange(e){
    // console.log(e);
    // 获取被点击的标题索引
    const {index} = e.detail;
    // 修改源数组isActive的值
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  // 点击+号，实现图片上传功能
  handleChooseImg(e){
    wx.chooseImage({
      count:9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res => {
        // tempFilePath可以作为img标签的src属性显示图片,是对象类型
        // const tempFilePaths = res.tempFilePaths
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...res.tempFilePaths]
        })
      }
    })
  },
  
  // 点击删除图片
  handleRemoveImg(e){
    // console.log(e);
    // 与wxml页面绑定的data-index相对应 获取当前点击的图片索引
    const { index } = e.currentTarget.dataset;
    let {chooseImgs} = this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },

  // 文本框内容改变事件
  handleTextInput(e){
    this.setData({
      inputValue:e.detail.value
    })
  },

  // 提交按钮
  handleFormSubmit(e){
    const {inputValue,chooseImgs} = this.data;
    // 判断文本框里内容是否为空
    if(!inputValue.trim()){
      wx.showToast({
        title: '输入不合法',
        mask:true,
        icon:"none"
      });
      return;
    }

    // 3 准备上传图片 到专门的图片服务器 
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    if(chooseImgs.length != 0){
    // 上传图片
    chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        url: 'https://media.mogu.com/image/scale?appKey=15m&w=500&h=500&quality=100', //仅为示例，非真实的接口地址
        filePath: v,
        name: 'image',
        // 顺带的文本信息
        formData: {
          'user': 'test'
        },
        // 上传成功执行的函数
        success: res=>{
          console.log(res);
          let url = JSON.parse(res.data).result.url;
          // console.log(url);
          // 将转化后的图片链接存入自定义外网图片链接数组中
          this.UpLoadImgs.push(url);
          // 所有图片全部上传完毕后才会执行
          if(i === chooseImgs.length - 1){
            // wx.hideLoading();
            console.log("把文本的内容和外网的图片数组 提交到后台中");
            //  提交都成功了
            // 重置页面
            this.setData({
              textVal: "",
              chooseImgs: []
            })
            // 返回上一个页面
            wx.navigateBack({
              delta: 1
            });
          }
        }
      })
    })
    }
  }
})
export const request = (params)=>{
  return new Promise((resolve,reject)=>{
    // 抽取地址相同部分的数字段
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    wx.request({
      ...params,
      // 将相同部分的数字段与用户传进来的数字段进行拼接
      url:baseUrl+params.url,
      success: (result)=>{
        resolve(result.data.message);
      },
      fail: (err)=>{
        reject(err);
      }
    });
  })
}
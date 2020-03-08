// 引入mockjs
import Mock from 'mockjs';

// 获取 mock.Random 对象
// const Random = Mock.Random;

Mock.setup({
  timeout: '200-1000'
});
const delay = (time = 2000) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
};

const mockData = Mock.mock({
  'data|35-40': [
    {
      "name": '@guid',
      "version": "2.4.1",
      "unit_identifeir": '@guid',
      "unit_name": "工商局",
      "unit_code": '@guid',
      "created_at": '@datetime',
      "date": '@datetime'
    },
  ],
});

// mock一组数据
const produceNewsData = [{
  // title: Random.csentence(5, 30), //  Random.csentence( min, max )
  // thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
  // author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
  // date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
  'name': "@ctitle(2,10)",
  'address': "@csentence(10, 30)",
  "img": "@image('600x600',#b7ef7c)",
  "brief": "@csentence(1,50)",
  "price|0-20.0-2": 1,
  "num": 0,
  "minusFlag": true,
  "date": "@date",
  "peisongfei|0-100.0-2": 1,
  "limit|0-50": 1
}];

// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/users', 'get', {"list|10": produceNewsData});

// Mock.mock('/users', 'get', (request, response) => {
//   // request的格式
//   // { "url": "/test",
//   //   "type": "GET",
//   //   "body": {page:1, limit: 10}
//   // }
//   return Mock.mock({"list|10": produceNewsData})
// });

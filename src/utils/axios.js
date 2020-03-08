import axios from 'axios';
import router from '../main';
import store from '../vuex/store.js';
import { baseUrl } from '../../config';

// 配置默认的host,假如你的API host是：http://api.htmlx.club
if(process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = baseUrl;
} else {
  axios.defaults.baseURL =  '/api';
}
axios.defaults.timeout = 15000;
// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  store.commit("common/loading", true);
  if(config.method === "get") {
    config.params = { params: config.params };
  }
  config.headers = config.headers || {};
  config.headers.Authorization = "Bearer " + sessionStorage.getItem("token");
  return config;
}, function (error) {
  // 对请求错误做些什么
  store.commit("common/loading", false);
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  store.commit("common/loading", false);
  const data = response.data;
  if(!data.success) {
    store.commit("common/handleError", data.message);
  }
  return data;
}, function (error) {
  // 对响应错误做点什么
  store.commit("common/loading", false);
  if(error.response.status === 401) {
    store.commit("common/handleError", '登录超时，请重新登录');
    sessionStorage.removeItem('loginUser');
    sessionStorage.removeItem('token');
    router.push('/login');
  } else {
    store.commit("common/handleError", error.message);
  }
  return Promise.reject(error)
});
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
//引入elementUI组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入vue-router
import VueRouter from 'vue-router';
//引入路由文件
import routes, { adminRoutes, studentRoutes, teacherRoutes } from "./router/router"
import './assets/iconfont/iconfont.css'

import store from "./vuex/store.js"
//为了方便日后维护,vuex内容移动至store/index.js
/* //引入vuex文件
import Vuex from 'vuex'
//vuex 依赖promise文件
import 'es6-promise/auto' */
// 全局样式
import './app.less';
// 模拟接口、数据
import './mock.js';
import './utils/axios.js';
import { getLoginUser } from './utils/utils';


//富文本
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
Vue.use(VueCodemirror)




Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.$axios = axios;
// Vue.use(Vuex);

//配置vue路由
const router = new VueRouter({routes});

/* //插入vuex的store对象
const store = new Vuex.Store({
  state:{
    show:false
  }
}) */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

function getParameterByName(paramName) {
  var args = new Object();
  var argsStr = location.search;  //获取URL参数字符串
  if (argsStr.length > 0) {
      argsStr = argsStr.substring(1);
      var nameValueArr = argsStr.split("&");  //多参数
      for (var i = 0; i < nameValueArr.length; i++) {
          var pos = nameValueArr[i].indexOf('=');
          if (pos == -1) continue; //如果没有找到就跳过
          var argName = nameValueArr[i].substring(0, pos); //提取name
          var argVal = nameValueArr[i].substring(pos + 1); //提取value
          args[argName] = unescape(argVal);
      }
      return args[paramName];
  }
}
getParameterByName("http://www.baidu.com?id=133&ue=200");

//动态添加路由，解决页面刷新后通过addRoutes添加的理由丢失的问题。
const currentPath = router.history.current.fullPath;
if(currentPath === sessionStorage.getItem('refreshPath')) {
  const childrenRoutes = routes[2].children;
  const loginUserRole = getLoginUser('role');
  let newRoutes = [];
  if(loginUserRole > 400) {
    newRoutes = studentRoutes;
  } else if(loginUserRole > 100 && loginUserRole < 400) {
    newRoutes = teacherRoutes;
  } else if(loginUserRole < 100) {
    newRoutes = adminRoutes;
  }
  router.options.routes[2].children = childrenRoutes.concat(newRoutes);
  router.addRoutes(router.options.routes);
  router.push(currentPath);
}

export default router;

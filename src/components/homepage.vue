<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="180px">
        <!-- 菜单 -->
        <el-row id="nav">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#ffd000"
              text-color="#333"
              active-text-color="#000"
              router
              :unique-opened="true"
              >
                <!-- 动态菜单组件 -->
                <nav-menu :navMenus="leftMenus"></nav-menu>


            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container v-loading.fullscreen.lock="loading" element-loading-spinner="el-icon-loading">
        <el-main  id="scroll">
          <!--<i class="iconfont icon-chengji2"></i>-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from "./layout/header.vue";
import Footer from "./layout/footer.vue";
import NavMenu from "./layout/nav.vue"; 
import { mapGetters } from 'vuex';
import routes, { adminRoutes, teacherRoutes, studentRoutes } from '../router/router.js'
import { roles } from '../constant';
import { getLoginUser } from '../utils/utils';
export default {
  name: 'HomePage',
  components:{
    Header,
    Footer,
    NavMenu
  },
  data(){
    return{
      router:"",
      page: 1,
      limit: 1000,
      leftMenus:[]
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    getLeftMenus() {
      const loginUserRole = getLoginUser('role');
      if(loginUserRole < 100) {
        this.leftMenus = [
          {
            "id": 'systemliat',
            "name": "systemliat",
            "icon": "iconfont icon-xitong",
            "title": "系统管理",
            "state": "ENABLE",
            "value": "/homepage/system",
            "type": "NONE",
            "discription": "用于系统管理的菜单",
            "disabled":false
          },
          {
            "id": 'majorManage',
            "name": "majorManage",
            "icon": "iconfont icon-bumen",
            "title": "学科管理",
            "state": "ENABLE",
            "value": "/homepage/majors",
            "type": "NONE",
            "discription": "用于学科管理的菜单",
            "disabled":false
          },
          {
            "id": 'classManage',
            "name": "classManage",
            "icon": "iconfont icon-banjiguanli2",
            "title": "班级管理",
            "state": "ENABLE",
            "value": "/homepage/classes",
            "type": "NONE",
            "discription": "用于班级管理的菜单",
            "disabled":false
          },
          {
            "id": 'taecherManage',
            "name": "taecherManage",
            "icon": "iconfont icon-laoshi",
            "title": "教师管理",
            "state": "ENABLE",
            "value": "/homepage/teachers",
            "type": "NONE",
            "discription": "用于用户管理的菜单",
            "disabled":false
          },
          {
            "id": 'studentManage',
            "name": "studentManage",
            "icon": "iconfont icon-xuesheng",
            "title": "学生管理",
            "state": "ENABLE",
            "value": "/homepage/students",
            "type": "NONE",
            "discription": "用于用户管理的菜单",
            "disabled":false
          },
          {
            "id": 'subjectManage',
            "name": "subjectManage",
            "icon": "iconfont icon-kemuguanli1",
            "title": "科目管理",
            "state": "ENABLE",
            "value": "/homepage/subjects",
            "type": "NONE",
            "discription": "用于学科管理的菜单",
            "disabled":false
          },
        ]
      } else if(loginUserRole > 100 && loginUserRole < 400) {
        this.leftMenus = [
          {
            "id": 'classManage',
            "name": "classManage",
            "icon": "iconfont icon-banjiguanli2",
            "title": "班级管理",
            "state": "ENABLE",
            "value": "/homepage/classes",
            "type": "NONE",
            "discription": "用于班级管理的菜单",
            "disabled":false
          },
          {
            "id": 'studentManage',
            "name": "studentManage",
            "icon": "iconfont icon-xuesheng",
            "title": "学生管理",
            "state": "ENABLE",
            "value": "/homepage/students",
            "type": "NONE",
            "discription": "用于用户管理的菜单",
            "disabled":false
          },
          {
            "id": 'questionManage',
            "name": "questionManage",
            "icon": "iconfont icon-tiku1",
            "title": "题库管理",
            "state": "ENABLE",
            "value": "/homepage/questions",
            "type": "NONE",
            "discription": "用于题库管理的菜单",
            "disabled":false
          },
          {
            "id": 'trainingList',
            "name": "trainingList",
            "icon": "iconfont icon-weibiaoti-",
            "title": "练习管理",
            "state": "ENABLE",
            "value": "/homepage/training",
            "type": "NONE",
            "discription": "用于练习列表的菜单",
            "disabled":false,
          },
          {
            "id": 'trainingList',
            "name": "trainingList",
            "icon": "iconfont icon-ic_jiaoshipingyue",
            "title": "练习评阅",
            "state": "ENABLE",
            "value": "/homepage/grade",
            "type": "NONE",
            "discription": "用于练习列表的菜单",
            "disabled":false,
          },
        ]
      } else {
        this.leftMenus = [
          {
            "id": 'trainingList',
            "name": "trainingList",
            "icon": "iconfont icon-weibiaoti-",
            "title": "我的练习",
            "state": "ENABLE",
            "value": "/homepage/student-training",
            "type": "NONE",
            "discription": "用于练习列表的菜单",
            "disabled":false,
          },
        ]
      }
    }
  },
  computed:{
    //全局加载动画
    loading() {
      return this.$store.state.common.loading;
    },
    //引入菜单列表
//    leftMenus() {
//      return this.$store.state.nav.list;
//    },
  },
  mounted() {
    this.$store.dispatch('nav/getList');
    
  },
  beforeCreate() {
    const loginUserRole = getLoginUser('role');
    //管理路由
    window.onbeforeunload = () => {
      sessionStorage.setItem('refreshPath', this.$route.fullPath);
    };
    if(this.$route.fullPath === sessionStorage.getItem('refreshPath')) {
      sessionStorage.removeItem('refreshPath');
    } else {
      // 动态添加路由
      const childrenRoutes = routes[2].children;
      let newRoutes = []; // 根据不同的用户角色添加不同的路由
      if(loginUserRole > 400) {
        newRoutes = studentRoutes;
      } else if(loginUserRole > 100 && loginUserRole < 400) {
        newRoutes = teacherRoutes;
      } else if(loginUserRole < 100) {
        newRoutes = adminRoutes;
      }
      this.$router.options.routes[2].children = childrenRoutes.concat(newRoutes);

      this.$router.addRoutes(this.$router.options.routes);//调用addRoutes添加路由
    }
    if(this.$route.fullPath !== '/homepage') {
      this.$router.replace(this.$route.fullPath);
    } else if(loginUserRole > 400) {
      this.$router.replace('/homepage/student-training');
    } else {
      this.$router.replace('/homepage/students');
    }
  },
  created() {
    this.getLeftMenus();
  },
  destroyed() {
    //判断登录状态
    sessionStorage.removeItem('loginUser');
    sessionStorage.removeItem('token');
    this.$router.push('/login');
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  .el-footer{
      height: 80px !important;
  }
  .el-row{
     background-color:  rgb(84, 92, 100);
     width: 101%;

  }
  .el-aside {
    background-color:  #ffd000;
    color: #333;
    text-align: center;
    line-height: 200px;
    overflow-x: hidden;
  }
  .el-menu {
    overflow: hidden;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /*line-height: 160px;*/
  }
  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  #scroll{
    overflow:auto;
  }
  #scroll::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/			      width:8px;
      height:2px;
  }
  #scroll::-webkit-scrollbar-button{/*滚动条两端的按钮，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置2）*/
    // background:#74D334;
    height: 0;
  }
  #scroll::-webkit-scrollbar-track{/*外层轨道，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置3）*/			      background:rgba(160, 160, 160, 0.3);
  }
  #scroll::-webkit-scrollbar-track-piece{/*内层轨道，滚动条中间部分（位置4）*/
    background:rgba(160, 160, 160, 0.3);
  }
  #scroll::-webkit-scrollbar-thumb{/*滚动条里面可以拖动的那部分（位置5）*/
    background:rgb(255, 127, 42);
    border-radius:5px;
  }
  #scroll::-webkit-scrollbar-corner {/*边角（位置6）*/
    // background:#82AFFF;
  }
  #scroll::-webkit-scrollbar-resizer  {/*定义右下角拖动块的样式（位置7）*/
    background:#FF0BEE;
  }
  #scroll{
    scrollbar-arrow-color: #f4ae21; /**//*三角箭头的颜色*/ 		scrollbar-face-color: #333; /**//*立体滚动条的颜色*/ 		scrollbar-3dlight-color: #666; /**//*立体滚动条亮边的颜色*/ 		scrollbar-highlight-color: #666; /**//*滚动条空白部分的颜色*/ 		scrollbar-shadow-color: #999; /**//*立体滚动条阴影的颜色*/ 		scrollbar-darkshadow-color: #666; /**//*立体滚动条强阴影的颜色*/ 	scrollbar-track-color: #666; /**//*立体滚动条背景颜色*/ 		scrollbar-base-color:#f8f8f8; /**//*滚动条的基本颜色*/
  }

  .test{
    background: #ffd900;
  }
  .el-aside{
    background:#498dff url(../assets/nav.png) bottom 5% left 15% no-repeat;
    // background-size: contain;
  }
  .el-row{
    background: transparent !important;
  }
</style>

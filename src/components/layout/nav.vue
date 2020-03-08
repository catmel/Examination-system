
<template>
  <div class="navMenu">
    <label v-for="(navMenu, index) in navMenus">

      <!-- 无子菜单 -->
      <el-menu-item v-if="navMenu.childs==null"
        :key="navMenu.id" :data="navMenu" :index="navMenu.value"
        :class="[navMenu.disabled?'is-disabled':'', { is_current_path: currentPath === navMenu.value }]"
      >
        <i :class="navMenu.icon"></i>
        <span>{{navMenu.title}}</span>
      </el-menu-item>

       <!-- 有子菜单 -->
      <el-submenu v-if="navMenu.childs"
      :key="navMenu.id" 
      :data="navMenu" 
      :index="navMenu.name">
        <template slot="title">
          <i :class="navMenu.icon"></i>
          <span>{{navMenu.title}}</span>
        </template>
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>


    </label>
  </div>
</template>
 
<script>
  export default {
    name: 'NavMenu',
    props: ['navMenus'],
    computed: {
      currentPath() {
        return this.$route.fullPath;
      }
    },
    mounted() {
/*       console.log("菜单目录",this.navMenus);
      console.log(this.$router) */
    }
  }
</script>
 
<style lang="less" >
 .navMenu {
   .iconfont {
     margin-right: 8px;
     font-size: 22px;
   }
   .el-menu-item i {
        color: #000;
    }
 }
   .el-menu-item, .submenu__title,.el-submenu>.el-submenu__title{
     font-size: 18px!important;
   }
   .el-submenu__title>span{
      font-size: 18px!important;
   }
   .el-submenu li span {
     font-size: 16px;
   }
 #nav{
    ul,li{
      background: transparent !important;
    }
    .is-active {
      color: #ffffff !important;
      background-color: #175bc3 !important;
      i {
          color: #94b7f4 !important;
      }
    }
   .is_current_path {
     color: #ffffff !important;
     background-color: #175bc3 !important;
   }
 }
</style>

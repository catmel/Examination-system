<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="菜单管理" name="first">
      
    </el-tab-pane>
    <el-tab-pane label="选项管理" name="second">
      <ddic></ddic>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
//引入系统管理菜单
import ddic from './ddic.vue'
  export default {
    data() {
      return {
        //默认展示页面
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    components:{
      ddic
    }
  };
</script>
<style>
.el-tabs__item{
    font-size: 16px;
}
</style>

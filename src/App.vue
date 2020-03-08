<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { isObjectEqual } from './utils/obj.js';
  export default {
    name: 'app',
    computed:{
      hasError(){
        return this.$store.state.common.error;
      },
      errorMessage(){
        return this.$store.state.common.errorMessage;
      }
    },
    watch:{
      hasError:function(a,b){
        this.$message({
          message: this.errorMessage,
          type: 'error',
        });
      }
    }
  }
</script>

<style lang="less">

*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
}
html,body,#app,#app>.el-container{
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  height: 100%;
}
 .el-header, .el-footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    line-height: 60px;
    height: 70px !important;
  }
  .el-main[data-v-fa4e1604]{
    background: #fff;
  }
  /*.container{*/
    /*width: 100%;*/
    /*height: 100%;*/
  /*}*/
    #app{
     background: #498dff url("./assets/SY.png");
  }
</style>

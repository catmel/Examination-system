<template>
 <!-- 头部内容-->
    <el-container class="header__container">
        <a  class="logo">
            <img src="../../assets/banner_logo.png" alt="">
        </a>
        <!-- <router-link to="/login">退出登录</router-link> -->
        <el-dropdown placement="bottom-start" @command="handleCommand">
          <el-button type="primary">
            欢迎您！{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/private" > 个人中心</el-dropdown-item>
            <el-dropdown-item command="/logout" >退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </el-container>
   
</template>

<script>
    import { getLoginUser } from '../../utils/utils';

    export default({
      data() {
        return {
          username: '1',
        }
      },
      created() {
        this.username = getLoginUser('realName') || getLoginUser('username');
      },
      methods:{
          handleCommand(c) {
            if (c=== '/logout') {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('loginUser');
              this.$router.push("/login");
            } else {
               this.$router.push("/homepage/private");
            }
          },
      }
    })
</script>
<style lang="less" scoped>
  .header__container {
    display: flex;
    justify-content: space-between;
    .el-dropdown {
      height: 40px;
      margin-top: 5px;
    }
  }
  .logo{
      width: 150px;
      height: 46px;
      // background: rgba(255,255,255,0.5);
      padding: 15px;
  }
 </style>

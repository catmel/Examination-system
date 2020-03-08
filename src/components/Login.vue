<template>
  <div class="bg-login">
    <div class="center">
<div class="middle-box loginscreen bg-white container">
      <!--<div class="login-header container"></div>-->
      <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" autocomplete="off">
            <template slot="prepend"><i class="iconfont icon-people"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off">
            <template slot="prepend"><i class="iconfont icon-lock"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" :loading="loading" type="primary" @click="doLogin('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    </div>
    
  </div>
</template>

<script>
  import { isPhone } from '../utils/utils';

  export default {
    name:'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value !== 'admin' && !isPhone(value)) {
          callback(new Error('格式不正确，请使用手机号码'));
        } else {
          callback();
        }
      };
      return {
        loginForm:{
          username:'',
          password:''
        },
        loginRules:{
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
        },
        loading:false,
      }
    },
    methods: {
      doLogin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$axios({
              method: 'post',
              url: '/login',
              data: this.loginForm,
            }).then(res => {
              this.loading = false;
              if(res.success) {
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('loginUser', JSON.stringify(res.data.userInfo));
                this.$router.push('/');
              }
            });
            setTimeout(() => {
            }, 1000)
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .login-container {
    background-size: cover;
  }
  .bg-login {
   
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form-item__error {
      padding-left: 60px;
    }
  }
  .container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }
  .bg-white {
    background-color: #434343;
    opacity: 1;
  }
  .middle-box{
    max-width: 400px;
    min-width: 350px;
    height: 350px;
    z-index: 100;
    margin: 0 auto;
    padding-bottom: 10px;
  }
  .loginscreen .middle-box{
    width: 300px;
  }
  .login-top{
    background-color: #3b3127;
    height: 6px;
  }
  .login-title{
    height:130px;
    padding:30px;
    font-weight:bold;
  }
  .login-header{
    height:100px;
  }
  .login-logo{
    margin-top:40px;
  }
  .middle-box{
   max-width: 600px;
    min-width: 350px;
    width: 450px;
    height: 250px;
    border-radius: 10px;
    padding: 35px 30px;
  }
  .el-input-group__prepend   {
    background-color: transparent;
    color: #ffc000;
  }
  .el-input__inner{
    height:45px; 
  }
  .el-form-item {
    margin-bottom: 20px;
    height: 50px;
  }
  .btn{
    background-color: transparent;
    border: 0;
    font-size: 20px;
    text-align: center;
    letter-spacing: 15px;
    text-indent: 15px;   
    width: 55%;
    border-bottom: 4px solid #ffd000;
    border-radius: 0;
  }
  .el-button--primary:hover {
    background: #808080;
    border-radius: 5px;
  }
  .el-input-group__append, .el-input-group__prepend{
    background: transparent;
    color: #ffd000;
  }
  .center{
    width: 807px;
    height: 504px;
     display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

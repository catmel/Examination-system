<template>
  <div class="bg-Logon">

    <div class="center">
          <p class="title">源码时代学生注册页面</p>
<div class="middle-box Logonscreen bg-white container">
      <!--<div class="Logon-header container"></div>-->
      <el-form :model="LogonForm" status-icon :rules="LogonRules" ref="LogonForm" label-width="0">
        <el-form-item prop="username">
          <el-input placeholder="用户名" v-model="LogonForm.username" autocomplete="off">
            <template slot="prepend"><i class="iconfont icon-people"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="realName">
          <el-input placeholder="真实姓名" v-model="LogonForm.realName" autocomplete="off">
            <template slot="prepend"><i class="iconfont icon-people"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="密码" type="password" v-model="LogonForm.password" autocomplete="off">
            <template slot="prepend"><i class="iconfont icon-lock"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input placeholder="确认密码" type="password" v-model="LogonForm.checkPass" autocomplete="off">
            <template slot="prepend"><i class="iconfont icon-lock"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" :loading="loading" type="primary" @click="doLogon('LogonForm')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    </div>
    
  </div>
</template>

<script>
  import { isPhone } from '../utils/utils';

  export default {
    name:'Logon',
    data() {
      const validatePass1 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          if (this.LogonForm.checkPass !== '') {
            this.$refs.LogonForm.validateField('checkPass');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认密码'));
        } else if (value !== this.LogonForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const validateUsername = (rule, value, callback) => {
        if (value !== 'admin' && !isPhone(value)) {
          callback(new Error('格式不正确，请使用手机号码'));
        } else {
          callback();
        }
      };
      return {
        LogonForm:{
        },
        formLabelWidth: '80px',
        LogonRules:{
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { validator: validateUsername, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass1, trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ]
        },
        loading:false,
      }
    },
    created(){
      const { token } = this.$route.query;
      if(!token) {
        this.$message.error('无效的二维码');
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('LogonUser', '{}');
      }
    },
    methods: {
      doLogon(formName) {
        this.$refs[formName].validate((valid) => {
          const obj = Object.assign({}, this.$route.query);
          const form = Object.assign({}, this.LogonForm);
          if(!obj.token) {
            this.$message.error('无效的二维码');
          } else {
            delete obj.token;
          }
          if (valid) {
            delete form.checkPass;
            this.loading = true;
            this.$axios({
              method: 'post',
              url: '/Logon',
              data: {...form, ...obj },
            }).then(res => {
              this.loading = false;
              if(res.success) {
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('LogonUser', JSON.stringify(res.data.userInfo));
                this.$router.push('/');
              }
            });
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.title{
      text-align: center;
    font-size: 24px;
    color: #434343;
    display: block;
    margin-bottom: 20px;
    font-weight: bold;
}
  .Logon-container {
    /*background: url("~@/assets/logo.png") no-repeat center fixed;*/
    // background: url("/static/Logon-bg.jpg") no-repeat center fixed;
    background-size: cover;
  }
  .bg-Logon {
   
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
    opacity: 1;
  }
  .middle-box{
    max-width: 400px;
    min-width: 350px;
    height: 350px;
    z-index: 100;
    margin: 0 auto;
    padding-bottom: 10px;
    background: #434343;
    
  }
  .Logonscreen .middle-box{
    width: 300px;
  }
  .Logon-top{
    background-color: #3b3127;
    height: 6px;
  }
  .Logon-title{
    height:130px;
    padding:30px;
    font-weight:bold;
  }
  .Logon-header{
    height:100px;
  }
  .Logon-logo{
    margin-top:40px;
  }
  .middle-box{
    max-width: 600px;
    min-width: 350px;
    // width: 450px;
    height: 450px;
    border-radius: 10px;
    padding: 35px 20px;
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

</style>

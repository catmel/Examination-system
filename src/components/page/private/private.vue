<template>
    <div>
        <p class="center_title">个人基本中心</p>
        <ul class="center_list">
            <li><span class="title">用户姓名 :</span>{{center.username}}</li>
            <li><span class="title">真实姓名 :</span>{{center.realName}}</li>
            <li><span class="title">账号类型 :</span>{{getRole(center.role)}}</li>
            <li v-if="center.role > 400"><span class="title">所属班级 :</span>{{center.className||"无"}}</li> 
            <li v-if="center.role > 100"><span class="title">所属学科 :</span>{{center.majorName||"无"}}</li>
            <li class="no_line"><span class="title">当前状态 :</span>{{center.status}}</li>
            <div class="no_line">
                <span @click="show_detail(center)">编辑个人信息</span>    
                <span @click="show_pwd()">修改密码</span>    
            </div>
        </ul>
         <!-- 添加/编辑细目 -->
        <!-- 开启表单验证 @close="handleClose('ruleForm')" -->
        <el-dialog title="编辑个人信息" :visible.sync="dialogFormVisible" width="50%" @close="handleClose('form')">
            <!-- 表单验证规则   :rules="formRules" ref="ruleForm" -->
            <el-form :model="center_form" :rules="formRules" ref="form">
                <!-- prop为表单验证绑定的内容 -->
                <el-form-item label="用户姓名"  :label-width="formLabelWidth" prop="username">
                     <el-input v-model="center_form.username"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名"  :label-width="formLabelWidth" prop="realName">
                     <el-input v-model="center_form.realName"></el-input>
                </el-form-item>
                <el-form-item label="账户类型"  :label-width="formLabelWidth" prop="role">
                     <el-input :placeholder="getRole(center_form.role)"
                     :disabled="true"></el-input>
                </el-form-item>
             <!--    <el-form-item label="所属班级"  :label-width="formLabelWidth" prop="role">
                    <el-select v-model="center.className" filterable placeholder="请选择所属班级" width="100%">
                        <el-option v-for="(classes, index) in classList" :key="index" :label="classes.name" :value="classes.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="所属学科" v-if="center.role>100 && center.role<400"  :label-width="formLabelWidth" prop="majorName">
                    <el-select v-model="center.majorName" filterable placeholder="请选择所属学科" width="100%">
                        <el-option v-for="(major, index) in majorList" :key="index" :label="major.name" :value="major.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属学科" v-if="center.role>400" :label-width="formLabelWidth" prop="majorName">
                     <el-input :placeholder="center_form.majorName"
                     :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属班级" v-if="center.role>400" :label-width="formLabelWidth" prop="className">
                     <el-input :placeholder="center_form.className"
                     :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="当前状态"  :label-width="formLabelWidth" prop="status">
                    <el-select v-model="center.status" filterable placeholder="请选择当前学习或工作状态" width="100%">
                        <el-option v-for="(status, index) in statusList" :key="index" :label="status.name" :value="status.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close()">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>


        <!-- 密码修改 -->
         <el-dialog title="修改密码" :visible.sync="dialogFormVisible_pwd" width="50%">
             <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="请验证旧密码" prop="oldPass">
                    <el-input type="password" v-model="ruleForm2.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="ruleForm2.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm_pwd('ruleForm2')">提交</el-button>
                    <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
            </el-form>
         </el-dialog>
    </div>
</template>

<script>
    import { UUID, getLoginUser, getRole } from '../../../utils/utils';
    export default {
        name:"private",
        computed:{
            classList(){
               
                return  this.$store.state.classes.list;
            },
            majorList(){
              
                return this.$store.state.majors.list;
            },
            statusList () {
                
                return this.$store.getters['ddic/getDetails']('name', '状态')
            }
        },
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            var validatePass1 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm2.password) {
                    callback(new Error('两次输入密码不一致!'));
                    } else {
                    callback();
                }
            };
            return{
                getRole,
                labelPosition: 'right',
                dialogFormVisible : false,
                dialogFormVisible_pwd: false,
                formLabelWidth : "120px",
                center_form:{},
                center: getLoginUser(),
                 // 表单验证规则
                formRules:{
                    //类目名称
                    //required--必填
                    username: [
                    {required: true,message: '用户名称不能为空', trigger: 'blur'},
                    { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur'}
                    ],
                    realName: [
                    {required: true,message: '真实姓名不能为空', trigger: 'blur'},
                    { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur'}
                    ]
                },
                //密码
                ruleForm2: {
                    oldPass:'',
                    password: '',
                    checkPass: '',
                },
                 rules2: {
                    oldPass: [
                        { validator: validatePass, trigger: 'blur' },
                         { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass1, trigger: 'blur' },
                         { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' },
                         { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.$store.dispatch('classes/getList');
            this.$store.dispatch('majors/getList');
            this.$store.dispatch('ddic/getList');
        },
        methods:{
            //修改密码提交函数 
            submitForm_pwd(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                     this.dialogFormVisible_pwd = false,
                     this.ruleForm2.id = this.center.id;
                    //向后台传递密码数据
                    console.log("密码修改",this.ruleForm2);                    
                      this.$store.dispatch('users/edit_pwd', this.ruleForm2).then(data => {
                        if(data.success){
                            console.log(data);
                            sessionStorage.removeItem('loginUser');
                            sessionStorage.removeItem('token');
                            this.$router.push('/login');
                        }
                     })
                    //   resetForm('ruleForm2')
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            //提交密码验证函数
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            show_detail(scope){  
                this.dialogFormVisible =  true; 
                this.center_form = scope;
                console.log("center",this.center)
                console.log("center_form",this.center_form)
            },
            show_pwd(){
                this.dialogFormVisible_pwd =  true; 
            },
             //增改查班级事件
            submitForm(formName) {
                //先进行表单验证
                this.$refs[formName].validate((valid) => {
                    console.log(this.center_form)
                    //表单验证通过则...
                    if (valid) {
                        //调取添加数据命令
                        this.$store.dispatch('users/edit', this.center_form).then(data => {
                        if(data.success){
                            //新增
                            this.dialogFormVisible = false;
                            //???这里是获取用户的详细列表呢还是怎么弄...
                             this.$store.dispatch('users/getList', {id: this.center.id}).then(
                                 data=>{
                                       sessionStorage.setItem("loginUser",JSON.stringify(data.data.rows[0]));
                                 }
                             )
                           
                        }
                        });
                         resetForm('formRules')
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //表单验证,不允许输入框为空
            handleClose(formName) {
                this.$refs[formName].clearValidate();
            },
            close(){
                this.dialogFormVisible =  false; 
                this.center = getLoginUser();
                
            }
        }
    }
</script>
<style scoped lang="less">
.center_title{
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom:20px;
}
.center_list{
    list-style-type: none;
    text-align: left;
    padding-left: 200px;
    width: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 20px 30px;
    li{
        // margin-block-end: 20px;
        border-bottom:1px solid #bbbbbb;
        line-height: 50px;
        span{
            font-size:18px;
            width: 120px;
            /* background: rgba(0,0,0,0.5); */
            display: inline-block;
            letter-spacing: 3px;
            /* font-weight: bold; */
            margin-right:20px;
            text-align: center;
            border-right: 1px solid #ddd;
        }
    }
    .no_line{
        border-bottom:0;
    }
    div{
        text-align: right;
        color: #409EFF;
        margin: 15px 0 ;
        span{
            margin: 0 20px;
            cursor: pointer;
        }
    }
}
.el-select{
    width: 100%;
}
</style>

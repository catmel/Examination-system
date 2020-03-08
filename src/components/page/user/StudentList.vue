<template>
  <div class="user_list">
    <div class="flex">
      <el-button class="margin-b-10 margin-r-10" type="primary" @click="setFormData({status: '正常'})">
        <i class="el-icon-plus el-icon--left" ></i>添加学生
      </el-button>
      <!-- 搜索框 -->
      <el-input
          class="search"
          v-model="state"
          placeholder="请输入搜索内容"
          @change="querySearch"
      ></el-input>
    </div>
    
    <!-- 学生列表 -->
    <el-table
      :data="usersList"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        fixed
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        fixed
        label="电话号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="realName"
        fixed
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="major"
        show-overflow-tooltip
        label="所属学科">
          <template slot-scope="scope">
            <span v-if="scope.row.major">{{scope.row.major.name}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="class"
        show-overflow-tooltip
        label="所属班级">
        <template slot-scope="scope">
          <span v-if="scope.row.class">{{scope.row.class.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="setFormData(scope.row, true)"  type="text" size="small">编辑</el-button>
          <el-button @click="saveDeleteId(scope.row.id)"  type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="usersCount"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- 编辑添加学员 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose('ruleForm')">
      <el-form :model="form" :rules="formRules" ref="ruleForm">
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realName">
          <el-input v-model="form.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科" :label-width="formLabelWidth" prop="majorId">
          <el-select v-model="form.majorId" filterable @change="handleMajorSelected" placeholder="请选择学科">
            <el-option v-for="major in majors" :key="major.id" :label="major.name" :value="major.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth" prop="classId">
          <el-select v-model="form.classId" filterable placeholder="请选择班级" :loading="getClasses">
            <el-option v-for="item in classes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="form.status" filterable placeholder="请选择状态">
            <el-option v-for="(status, index) in statusList" :key="index" :label="status.name" :value="status.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
       width="400px"
    >

    <!-- 删除学员 -->
      <span>确定要删除该项吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getLoginUser, UUID, isPhone } from '../../../utils/utils';
  import { roles } from '../../../constant';
  export default {
    name: 'StudentList',
    props: {
    },
    components: {},
    computed: {
      usersList:{
        get:function () {
          return this.$store.state.users.list;
        },
        set: function (val){
          this.$store.state.users.list = val;
        }
      },
      // usersList() {
      //   return this.$store.state.users.list;
      // },
      usersCount: {
        get:function () {
          return this.$store.state.users.count;
        },
        set: function (val){
          this.$store.state.users.count = val;
        }      
      },
      majors: {
        get:function () {
          return this.$store.state.majors.list;
        },
        set: function (val){
          this.$store.state.majors.list = val;
        }   
       
      },
      classes() {
        return this.$store.state.classes.list;
      },
      statusList () {
        return this.$store.getters['ddic/getDetails']('name', '状态')
      }
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value !== 'admin' && !isPhone(value)) {
          callback(new Error('格式不正确，请使用手机号码'));
        } else {
          callback();
        }
      };
      return {
        state: "",
        url: '',
        page: 1,
        limit: 10,
        search:false,
        dialogFormVisible: false,
        deleteDialogVisible: false,
        form: {
          username: '',
          realName: '',
          role: roles.STUDENT,
          majorId: '',
          status: '正常',
          classId: '',
        },
        formRules:{
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { validator: validateUsername, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实名字不能为空', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择用户状态', trigger: 'change' }
          ],
          majorId: [
            { required: true, message: '请选择用户所属学科', trigger: 'change' }
          ],
          classId: [
            { required: true, message: '请选择用户所属班级', trigger: 'change' }
          ],
        },
        formTitle: '添加用户',
        getClasses: false,
        deleteId: '',
        formLabelWidth: '120px',
        paging:true
      }
    },

    create() {
    },
    mounted() {
      this.initRequest();
    },
    methods: {
      //数据请求
      querySearch(state) {
        state = state.replace(/\s/ig,'');
        if(state != ''){
          console.log("搜索条件", state,this.getQueryData());
          let searchData = {
            keyword: this.state,
            offset: (this.page - 1) * this.limit,
            limit: this.limit,
            role: roles.STUDENT,
          }
          this.$store.dispatch('users/search_user', searchData).then(res => {
            if(res.success){
                console.log("搜索结果",res.data);
                this.usersList =  res.data.rows;
                this.usersCount = res.data.count;
                 this.$store.dispatch('majors/getList');
            }
          }) 
          this.search = true;
        }else{
          this.page = 1;
          console.log('返回学生列表',this.page);
          this.$store.dispatch('users/getList', this.getQueryData());
          this.search = false;
        }
                
      },
      //分页跳转请求数据
       handleCurrentChange(val) {
        if(this.search == true){
          // console.log('搜索页面跳转')
          this.page = val;
           let searchData = {
            keyword: this.state,
            offset: (this.page - 1) * this.limit,
            limit: this.limit,
            role: roles.STUDENT,
          }
          this.$store.dispatch('users/search_user', searchData).then(res => {
            if(res.success){
                console.log("搜索结果",res.data);
                this.usersList =  res.data.rows;
                this.usersCount = res.data.count;
            }
          })
        }else{
          // console.log('正常页面跳转')
          this.page = val;
          this.$store.dispatch('users/getList', this.getQueryData());
        }
      },
      initRequest() {
        
        console.log('列表信息',this.$store.dispatch('users/getList', this.getQueryData()));
        this.$store.dispatch('users/getList', this.getQueryData());
        this.$store.dispatch('majors/getList');
        this.$store.dispatch('classes/getList');
        this.$store.dispatch('ddic/getList');
      },
      getQueryData() {
        return {
          offset: (this.page - 1) * this.limit,
          limit: this.limit,
          role: roles.STUDENT,
        };
      },
      setFormData(row = {}, edit) {
        const { id, username, realName,
          role = roles.STUDENT,
          majorId = getLoginUser('majorId') > 0 ? getLoginUser('majorId'): null,
          status,
          classId = this.$route.query.id
        } = row;
        this.form = { id, username, realName, role, majorId, status, classId };
        this.url = edit ? 'users/edit' : 'users/create';
        this.formTitle = edit ? '编辑用户' : '新增用户';
        this.dialogFormVisible = true;
      },
      handleClose(formName) {
        this.$refs[formName].clearValidate();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch(this.url, this.form).then(data => {
              if(data.success) {
                this.dialogFormVisible = false;
                this.$store.dispatch('users/getList', this.getQueryData());
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      saveDeleteId(id) {
        this.deleteId = id;
        this.deleteDialogVisible = true;
      },
      removeUser() {
        this.$store.dispatch('users/remove', { id: this.deleteId }).then((data) => {
          this.deleteDialogVisible = false;
          if(data.success) {
            this.$store.dispatch('users/getList', this.getQueryData());
          }
        });
      },
      handleMajorSelected(val) {
        this.getClasses = true;
        this.$store.dispatch('classes/getList', {majorId: val}).then(() => {
          this.getClasses = false;
        });
      },
    },
  }
</script>

<style lang="less">
  .user_list {
    text-align: left;
    td {
      text-align: left;
    }
    .el-pagination {
      text-align: right!important;
      padding: 3px 0;
    }
    .el-dialog {
      width: 40%;
      .el-select {
        width: 100%;
      }
    }
    .img_td > .cell {
      line-height: 0;
    }
    .search{
        width:300px;
    }
  }
</style>

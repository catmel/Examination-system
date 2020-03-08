<template>
  <div class="user_list">
    <el-button class="margin-b-10" type="primary" @click="returnPage()"><i class="el-icon-d-arrow-left"></i>返回</el-button>
    <el-button class="margin-b-10" type="primary" @click="setFormData({status: '正常'})">
      <i class="el-icon-plus el-icon--left"></i>添加学生
    </el-button>
    <!-- 批量文件导入学生信息 -->
    <el-button class="margin-b-10" type="primary" @click="importDataClick">
      <i class="el-icon-plus el-icon--left"></i>文件导入学生
    </el-button>
    <!-- 文件导入弹框 -->
    <el-dialog
      :visible.sync="importDialog"
      width="80%"
    >
      <el-upload
        slot="title"
        class="upload-demo"
        :auto-upload="false"
        :action="baseUrl + '/questions/import'"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :on-change="this.handleChange"
        :file-list="fileList">
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
      </el-upload>
      <!-- 提示已注册学员 -->
      <div class="warning" v-if="this.show_already == true">
        <div>以下学员电话已注册, 请更改其电话后重新上传</div>
        <p>
          <span v-for="already_user in this.already_users">{{already_user.realName}} 、</span>
        </p>
      </div>
      <!-- 注册学员表格 -->
      <el-table
        :data="importData"
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
          prop="realName"
          label="姓名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="username"
          label="电话"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="saveDeleteId(scope.$index)"  type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="400px"
        append-to-body
      >
        <span>确定要删除该项吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeQuestion">确 定</el-button>
      </span>
      </el-dialog>
      <p v-if="this.importData.length > 0">确认无误后点击上传按钮可以上传到服务器</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false">取 消</el-button>
        <el-button :disabled="this.importData.length < 1" type="primary" @click="submitData">上传学生列表</el-button>
      </span>
    </el-dialog>




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
        label="用户名"
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
    <el-pagination
      background
      layout="prev, pager, next"
      :total="usersCount"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- 编辑用具 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose('ruleForm')">
      <el-form :model="form" :rules="formRules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
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


    <!-- 删除学员 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="400px"
    >
      <span>确定要删除该项吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getLoginUser, isPhone, UUID } from '../../../utils/utils';
  import { roles } from '../../../constant';
  import {baseUrl} from "../../../../config";
  export default {
    name: 'StudentList',
    props: {
    },
    components: {

    },
    computed: {
      usersList() {
        return this.$store.state.users.list;
      },
      usersCount() {
        return this.$store.state.users.count;
      },
      majors() {
        return this.$store.state.majors.list;
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
        url: '',
        page: 1,
        limit: 10,
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
        // 文件上传
        baseUrl,
        importDialog: false,
        fileList: [],
        importData: [],
        // 已注册学员
        already_users:[],
        //已注册模板显示
        show_already: false,
        deleteDialogVisible: false
      }
    },

    create() {
    },
    mounted() {
      this.initRequest();
    },
    methods: {
      returnPage(){
        this.$router.push({
          path: '/homepage/classes'
        })
      },
      initRequest() {
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
          classId: this.$route.query.id
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
      handleCurrentChange(val) {
        this.page = val;
        this.$store.dispatch('users/getList', this.getQueryData());
      },
      handleMajorSelected(val) {
        this.getClasses = true;
        this.$store.dispatch('classes/getList').then(() => {
          this.getClasses = false;
        });
      },
      importDataClick() {
        this.importData = [];
        this.fileList = [];
        this.importDialog = true;
        this.show_already =  false
      },
      //上传文件
      handleChange(file) {
        this.fileList = [file];
        let row = {
          majorId:getLoginUser('majorId') > 0 ? getLoginUser('majorId'): null,
          classId:this.$route.query.id,
          role:roles.STUDENT,
          status: '正常'
        }
        const formData = new FormData();
        formData.append("files",file.raw);   
        formData.append('row',JSON.stringify(row));
        return this.$store.dispatch('users/uploadFile', formData).then((res) => {
          console.log(res.data)
          this.importData = res.data.newrows || [];
          this.already_users = res.data.already_user || [];
          if(this.already_users.length>0){
             this.show_already =  true
          }else{
            this.show_already =  false
          }
        });
      },
      saveDeleteId(id) {
        this.deleteId = id;
        this.deleteDialogVisible = true;
      },
      removeQuestion() {
        this.importData.splice(this.deleteId, 1);
        if(this.importData.length < 1) {
          this.fileList = [];
        }
        this.deleteDialogVisible = false;
      },
      submitData() {
        this.$store.dispatch('users/uploadData', this.importData).then(data => {
          if(data.success) {
            this.importDialog = false;
            this.show_already =  false
            this.$store.dispatch('users/getList', this.getQueryData());
          }
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
    .upload-demo{
      display: flex;
    }
    .el-dialog__body{
      padding-top: 0px;
    }
    .warning{
      color: red;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
</style>
<template>
  <div class="user_list">
    <el-button class="margin-b-10" type="primary" @click="setFormData({status: '正常'})">
      <i class="el-icon-plus el-icon--left"></i>添加老师
    </el-button>
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
        prop="role"
        label="用户角色"
        :formatter="getRoleName"
      >
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
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small">查看</el-button>-->
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
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose('ruleForm')">
      <el-form :model="form" :rules="formRules" ref="ruleForm">
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realName">
          <el-input v-model="form.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="form.role" placeholder="请选择用户角色">
            <el-option v-for="(role,index) in roles" :key="index" :label="role.name" :value="role.type" v-if="role.type > 100 && role.type < 400"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" :label-width="formLabelWidth" prop="majorId">
          <el-select v-model="form.majorId" filterable placeholder="请选择学科">
            <el-option v-for="(major, index) in majors" :key="index" :label="major.name" :value="major.id">
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
  import ElOption from '../../../../node_modules/element-ui/packages/select/src/option.vue';

  export default {
    name: 'TeacherList',
    props: {
    },
    components: {
      ElOption
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
      roles() {
        return this.$store.state.roles.list;
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
          role: '',
          username: '',
          realName: '',
          majorId: '',
          status: '正常',
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
          role: [
            { required: true, message: '请选择用户角色', trigger: 'change' }
          ],
          majorId: [
            { required: true, message: '请选择用户所属学科', trigger: 'change' }
          ],
        },
        formTitle: '添加用户',
        deleteId: '',
        isAdmin: false,
        formLabelWidth: '120px'
      }
    },
    created() {
      this.isAdmin = getLoginUser('role') < 100;
    },
    mounted() {
      this.$store.dispatch('users/getList', { offset: (this.page - 1) * this.limit, limit: this.limit, role: roles.TEACHER });
      this.$store.dispatch('majors/getList');
      this.$store.dispatch('ddic/getList');
      this.$store.dispatch('roles/getList');
    },
    methods: {
      setFormData(row = {}, edit) {
        this.url = edit ? 'users/edit' : 'users/create';
        const { id, username, realName, role, majorId, status } = row;
        this.form = { id, username, realName, role, majorId, status };
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
                this.$store.dispatch('users/getList', { offset: (this.page - 1) * this.limit, limit: this.limit, role: roles.TEACHER });
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
            this.$store.dispatch('users/getList', { offset: (this.page - 1) * this.limit, limit: this.limit, role: roles.TEACHER });
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.$store.dispatch('users/getList', { offset: (val - 1) * this.limit, limit: this.limit, role: roles.TEACHER });
      },
      getRoleName(row) {
        return this.$store.getters['roles/getRoleName'](row.role);
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
  }
</style>

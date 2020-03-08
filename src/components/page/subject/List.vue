<template>
  <div class="subject_list">
    <el-button class="margin-b-10" type="primary" @click="setFormData({})">
      <i class="el-icon-plus el-icon--left"></i>添加科目
    </el-button>
    <el-table
      :data="subjects.slice((page-1)*limit,page*limit)"
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
        prop="name"
        label="名称"
      >
      </el-table-column>
      <el-table-column
        prop="major"
        label="所属学科"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.major">{{scope.row.major.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small">查看</el-button>-->
          <el-button @click="setFormData(scope.row,true)"  type="text" size="small">编辑</el-button>
          <el-button @click="saveDeleteId(scope.row.id)"  type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="subjectsCount"
      :page-size="limit"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose('ruleForm')">
      <el-form :model="form" :rules="formRules" ref="ruleForm">
        <el-form-item label="科目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth" prop="majorId">
          <el-select v-model="form.majorId" filterable placeholder="请选择学科">
            <el-option v-for="(major, index) in majors" :key="index" :label="major.name" :value="major.id">
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
        <el-button type="primary" @click="removeItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { UUID } from '../../../utils/utils';

  export default {
    name: 'SubjectList',
    props: {
    },
    components: {

    },
    computed: {
      subjects() {
        return this.$store.state.subjects.list;
      },
      subjectsCount() {
        return this.$store.state.subjects.list.length;
      },
      majors() {
        return this.$store.state.majors.list;
      },
      classes() {
        return this.$store.state.classes.list;
      },
    },
    data() {
      return {
        url: '',
        page: 1,
        limit: 10,
        dialogFormVisible: false,
        deleteDialogVisible: false,
        form: {
          name: '',
          majorId: [],
        },
        formRules:{
          name: [
            { required: true, message: '科目名称不能为空', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          majorId: [
            { required: true, message: '请选择科目所属学科', trigger: 'change' }
          ],
        },
        formTitle: '新增科目',
        deleteId: '',
        formLabelWidth: '120px'
      }
    },
    created() {

    },
    mounted() {
      this.$store.dispatch('subjects/getList');
      this.$store.dispatch('majors/getList');
    },
    methods: {
      setFormData(row = {}, edit) {
        const { id, name, majorId } = row;
        this.form = { id, name, majorId };
        this.url = edit ? 'subjects/edit' : 'subjects/create';
        this.formTitle = edit ? '编辑科目' : '新增科目';
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
                this.$store.dispatch('subjects/getList');
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
      removeItem() {
        this.$store.dispatch('subjects/remove', { id: this.deleteId }).then((data) => {
          this.deleteDialogVisible = false;
          if(data.success) {
            this.$store.dispatch('subjects/getList');
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
      },
    },
  }
</script>

<style lang="less">
  .subject_list {
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

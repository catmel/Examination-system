<template>
  <div class="major_list">
    <el-button class="margin-b-10" type="primary" @click="setFormData({})">
      <i class="el-icon-plus el-icon--left"></i>添加学科
    </el-button>
    <el-table
      :data="majors.slice((page-1)*limit,page*limit)"
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
        fixed
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="subjects"
        :formatter="formatSubjects"
        show-overflow-tooltip
        label="包含科目">
      </el-table-column>
      <el-table-column
        prop="classes.length"
        label="学科班级"
        >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="setFormData(scope.row, true)"  type="text" size="small">编辑</el-button>
          <el-button v-if="scope.row.subjects.length === 0" @click="saveDeleteId(scope.row.id)"  type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="majorsCount"
      :page-size="limit"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose('ruleForm')">
      <el-form :model="form" :rules="formRules" ref="ruleForm">
        <el-form-item label="学科名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="removeMajor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { UUID } from '../../../utils/utils';

  export default {
    name: 'MajorList',
    props: {
    },
    components: {

    },
    computed: {
      majors() {
        return this.$store.state.majors.list;
      },
      majorsCount() {
        return this.$store.state.majors.list.length;
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
        },
        formRules:{
          name: [
            { required: true, message: '学科名不能为空', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
        },
        formTitle: '添加学科',
        deleteId: '',
        formLabelWidth: '120px'
      }
    },
    created() {

    },
    mounted() {
      this.$store.dispatch('majors/getList');
    },
    methods: {
      setFormData(row = {}, edit) {
        const { id, name } = row;
        this.form = { id, name };
        this.url = edit ? 'majors/edit' : 'majors/create';
        this.formTitle = edit ? '编辑学科' : '新增学科';
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
                this.$store.dispatch('majors/getList');
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
      removeMajor() {
        this.$store.dispatch('majors/remove', { id: this.deleteId }).then((data) => {
          this.deleteDialogVisible = false;
          if(data.success) {
            this.$store.dispatch('majors/getList');
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
      },
      formatSubjects(row, column, cellValue) {
        return (cellValue || []).map(subject => subject.name ).join('，');
      }
    },
  }
</script>

<style lang="less">
  .major_list {
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

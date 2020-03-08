<template>
  <div class="class_list">
    <el-button class="margin-b-10" type="primary" @click="setFormData({})">
      <i class="el-icon-plus el-icon--left"></i>添加班级
    </el-button>
    <!-- <el-button class="margin-l-10" type="primary" @click="handleSetTraining">
      <i class="iconfont icon-fabu margin-r-5"></i>发布练习
    </el-button> -->
    <el-table
      :data="classes.slice((page-1)*limit,page*limit)"
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
        label="班级名"
        width="180">
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
        label="班级人数"
      >
        <template slot-scope="scope">
          <span>{{scope.row.students.length}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button @click="showClassStudents(scope.row.id)" type="text" size="small">查看学生</el-button>
          <el-button @click="showQRCODE(scope.row,true)"  type="text" size="small">查看二维码</el-button>
          <el-button @click="setFormData(scope.row,true)"  type="text" size="small">编辑</el-button>
          <el-button v-if="scope.row.students.length === 0" @click="saveDeleteId(scope.row.id)"  type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="classesCount"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose('ruleForm')">
      <el-form :model="form" :rules="formRules" ref="ruleForm">
        <el-form-item label="班级名" :label-width="formLabelWidth" prop="name">
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
    <el-dialog title="发布练习" :visible.sync="setTrainingVisible">
      <el-form :model="trainingForm" :rules="formRules" ref="trainingForm">
        <el-form-item label="班级名" :label-width="formLabelWidth" prop="className">
          <el-select v-model="trainingForm.classItem" filterable placeholder="请选择班级">
            <el-option v-for="(classItem, index) in classes" :key="index" :label="classItem.name" :value="classItem">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="练习题" :label-width="formLabelWidth" prop="trainingName">
          <el-select v-model="trainingForm.training" filterable placeholder="练习题">
            <el-option v-for="(training, index) in trainings" :key="index" :label="training.name" :value="training">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setTrainingVisible = false">取 消</el-button>
        <el-button type="primary" @click="setTraining">确 定</el-button>
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
        <el-button type="primary" @click="removeClass">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      @close="qrcodeDialogVisible=false"
      :visible.sync="qrcodeDialogVisible"
      class="qrcodeImg"
      width="400px"
    >
      <img :src="src" />
    </el-dialog>
  </div>
</template>

<script>
  import { UUID } from '../../../utils/utils';

  export default {
    name: 'classList',
    props: {
    },
    components: {

    },
    computed: {
      classesCount() {
        return this.$store.state.classes.list.length;
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
        setTrainingVisible: false,
        deleteDialogVisible: false,
        qrcodeDialogVisible: false,
        src: '',
        form: {
          name: '',
          majorId: '',
        },
        trainings: [],
        trainingForm: {

        },
        formRules:{
          name: [
            { required: true, message: '班级名不能为空', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          majorId: [
            { required: true, message: '请选择班级所属学科', trigger: 'change' }
          ],
          classItem: [
            { required: true, message: '请选择班级', trigger: 'change' }
          ],
          training: [
            { required: true, message: '请选择练习', trigger: 'change' }
          ],
        },
        formTitle: '添加班级',
        deleteId: '',
        formLabelWidth: '120px'
      }
    },
    mounted() {
      this.$store.dispatch('classes/getList');
      this.$store.dispatch('majors/getList');
      this.$store.dispatch('trainings/getAll').then(res => {
        if(res.success) {
          this.trainings = res.data;
        }
      });
    },
    methods: {
      setFormData(row = {}, edit) {
        this.url =  edit ? 'classes/edit' : 'classes/create';
        const { id, name, majorId } = row;
        this.form = { id, name, majorId };
        this.formTitle = edit ? '编辑班级' : '新增班级';
        this.dialogFormVisible = true;
      },
      handleSetTraining() {
        this.trainingForm = {};
        this.setTrainingVisible = true;
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
                this.$store.dispatch('classes/getList');
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      setTraining() {
        this.$refs.trainingForm.validate((valid) => {
          console.log("提交代码");
            if (valid) {
              console.log("1");
              const { classItem = {}, training = {} } = this.trainingForm;
              console.log(this.trainingForm);
              const payload = {
                className: classItem.name,
                classId: classItem.id,
                trainingName: training.name,
                trainingId: training.id,
              };
              console.log(payload);
              this.$store.dispatch('trainings/setTraining', payload).then(data => {
                if(data.success) {
                  this.setTrainingVisible = false;
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
      removeClass() {
        this.$store.dispatch('classes/remove', { id: this.deleteId }).then((data) => {
          this.deleteDialogVisible = false;
          if(data.success) {
            this.$store.dispatch('classes/getList');
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
      },
      showClassStudents(id) {
        this.$router.push({
          path: '/homepage/classes/students',
          query: { id }
        });
      },
      showQRCODE(row) {
        const { majorId, majorName, id, name } = row;
        this.$store.dispatch('classes/qrcode', { classId: id, className: name, majorId, majorName }).then((res) => {
          if(res.success) {
            this.qrcodeDialogVisible = true;
            this.src = res.data;
          }
        });
      },
    },
  }
</script>

<style lang="less">
  .class_list {
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
    .good {
      font-size: 30px;
    }
    .iconfont {
      font-size: 14px;
    }
    .img_td > .cell {
      line-height: 0;
    }
    .qrcodeImg .el-dialog__body {
      text-align: center;
    }
  }
</style>

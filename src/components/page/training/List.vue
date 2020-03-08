<template>
  <div class="training_list">
    <div class="margin-b-10" >
      <router-link to="/homepage/add-training">
        <el-button type="primary"><i class="el-icon-plus el-icon--left"></i>添加练习</el-button>
      </router-link>
      <el-button class="margin-l-10" type="primary" @click="handleSetTraining">
        <i class="iconfont icon-fabu margin-r-5"></i>发布练习
      </el-button>
    </div>
    <el-table
      :data="trainingsList"
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
        label="名字"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="major"
        show-overflow-tooltip
        label="所属学科"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.major">{{scope.row.major.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="teacher"
        label="组卷老师"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.teacher">{{scope.row.teacher.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{moment(scope.row.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="showTraining(scope.row)" type="text" size="small">查看</el-button>
          <!--<el-button @click="saveDeleteId(scope.row.id)" type="text" size="small">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="trainingsCount"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-dialog
      :visible.sync="importDialog"
      :title="name"
      width="80%"
    >
      <span v-if="classes.length > 0">已发布班级：{{classes.join('，')}}</span>
      <el-table
        :data="data"
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
          prop="type"
          label="题型"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="question"
          label="题目"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="content"
          label="题目内容"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="difficult"
          label="题目难度"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="subject"
          show-overflow-tooltip
          width="100"
          label="所属科目">
          <template slot-scope="scope">
            <span v-if="scope.row.subject">{{scope.row.subject.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          show-overflow-tooltip
          label="分值">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false">取 消</el-button>
        <el-button type="primary" @click="importDialog = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="400px"
    >
      <span>确定要删除该项吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeTraining">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 发布练习 -->
    <el-dialog title="发布练习" :visible.sync="setTrainingVisible">
      <el-form :model="trainingForm" :rules="formRules" ref="trainingForm">
        <el-form-item label="练习题" :label-width="formLabelWidth" prop="training">
          <el-select v-model="trainingForm.training" filterable placeholder="练习题">
            <el-option v-for="(training, index) in allTrainings" :key="index" :label="training.name" :value="training.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="班级名" :label-width="formLabelWidth" prop="classItem">
          <el-select v-model="trainingForm.classItem" filterable placeholder="请选择班级">
            <el-option v-for="(classItem, index) in allClasses" :key="index" :label="classItem.name" :value="classItem">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="班级名" :label-width="formLabelWidth" prop="classItem">
          <el-select v-model="trainingForm.classItem" filterable placeholder="请选择班级">
            <el-option v-for="(classItem, index) in allClasses" :key="index" :label="classItem.name" :value="classItem.id">
            </el-option>
          </el-select>
          
        </el-form-item>

      <!-- {{ trainingForm }} -->
      <!-- {{ allClasses[0] }} -->

        <el-form-item label="开放时间段" :label-width="formLabelWidth" prop="dateArr">
          <el-date-picker
            v-model="trainingForm.dateArr"
            type="datetimerange"
            align="right"
            :picker-options="{disabledDate}"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setTrainingVisible = false">取 消</el-button>
        <el-button type="primary" @click="setTraining">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getLoginUser, UUID } from '../../../utils/utils';
  import { roles } from '../../../constant';
  import moment from 'moment';
  export default {
    name: 'TrainingsList',
    props: {
    },
    components: {
    },
    computed: {
      trainingsList() {
        return this.$store.state.trainings.list;
      },
      trainingsCount() {
        return this.$store.state.trainings.count;
      },
      allClasses() {
        return this.$store.state.classes.list;
      },
    },
    data() {
      return {
        moment,
        dateArr: [],
        page: 1,
        limit: 10,
        deleteDialogVisible: false,
        setTrainingVisible: false,
        importDialog: false,
        deleteId: '',
        formLabelWidth: '120px',
        data: [],
        classes: [],
        name: '',
        trainingForm: {
          classItem:{}
        },
        allTrainings: [],
        formRules:{
          classItem: [
            { required: true, message: '请选择班级', trigger: 'change' }
          ],
          training: [
            { required: true, message: '请选择练习', trigger: 'change' }
          ],
          dateArr: [
            { validator: this.validateDate,  trigger: 'change' }
          ],
        },
      }
    },
    created() {
    },
    mounted() {
      this.$store.dispatch('trainings/getList', { offset: (this.page - 1) * this.limit, limit: this.limit });
      this.$store.dispatch('classes/getList');
      this.$store.dispatch('trainings/getAll').then(res => {
        if(res.success) {
          this.allTrainings = res.data;
        }
      });
    },
    methods: {
      saveDeleteId(id) {
        this.deleteId = id;
        this.deleteDialogVisible = true;
      },
      handleSetTraining() {
        this.trainingForm = {};
        this.setTrainingVisible = true;
        if(this.$refs.trainingForm) {
          this.$refs.trainingForm.clearValidate();
        }
        console.log("123",this.trainingForm)
      },
      removeTraining() {
        this.$store.dispatch('trainings/remove', { id: this.deleteId }).then((data) => {
          this.deleteDialogVisible = false;
          if(data.success) {
            this.$store.dispatch('trainings/getList', { offset: (this.page - 1) * this.limit, limit: this.limit });
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.$store.dispatch('trainings/getList', { offset: (val - 1) * this.limit, limit: this.limit });
      },
      showTraining(row) {
        this.name = row.name;
        this.$store.dispatch('trainings/getOne', { id: row.id }).then(res => {
          if(res.success) {
            this.data = (res.data || {}).questionList || [];
            this.classes = ((res.data || {}).classes || []).map(item => item.className);
          }
        });
        this.importDialog = true;
      },
      //发布试题给班级
      setTraining() {
        this.$refs.trainingForm.validate((valid) => {
          console.log("123",this.trainingForm);
          console.log('this.$store.state.classes.list>>', this.$store.state.classes.list);
          if (valid) {
            const { classItem = {}, training = {}, dateArr } = this.trainingForm;
              const payload = {
                className: this.$store.state.classes.list.find((
                  { id }) => id === this.trainingForm.classItem
                ).name,
                classId: this.trainingForm.classItem,
                trainingName: this.$store.state.trainings.list.find((
                  { id }) => id === this.trainingForm.training
                ).name,
                trainingId: this.trainingForm.training,
                beginAt: dateArr[0],
                endAt: dateArr[1],
              };  
            console.log("----------",payload);
            this.$store.dispatch('trainings/setTraining', payload).then(data => {
              if(data.success) {
                this.setTrainingVisible = false;
                this.$store.dispatch('trainings/getAll').then(res => {
                  if(res.success) {
                    this.allTrainings = res.data;
                    this.trainingForm = {}
                  }
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
            this.trainingForm = {}
          }
        });
      },
      disabledDate(currentDate) {
        return moment().startOf('day') > currentDate
      },
      validateDate(rule, value, callback) {
        if (!value || value[1] < value[0]) {
          callback(new Error('请选择开放时间段，起始时间不能大于结束时间'));
        } else {
          callback();
        }
      }
    },
  }
</script>

<style lang="less">
  .training_list {
    text-align: left;
    td {
      text-align: left;
    }
    .upload-demo {
      display: flex;
    }
    .el-pagination {
      text-align: right!important;
      padding: 3px 0;
    }
    .el-dialog {
      width: 60%;
      min-width: 500px;
      .el-select {
        width: 100%;
      }
    }
    .img_td > .cell {
      line-height: 0;
    }
    .el-upload-list__item:first-child {
      margin-top: 5px!important;
      padding-left: 10px;
      a, i {
        color: green;
      }
    }
    .iconfont {
      font-size: 14px;
    }
    .download {
      color: #409eff;
      margin-left: 10px;
    }
    .el-date-editor {
      width: 100%;
    }
  }
</style>

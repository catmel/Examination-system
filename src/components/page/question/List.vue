<template>
  <div class="question_list">
    <div>
      <el-button class="margin-b-10" type="primary" @click="setFormData({major: selectedMajor})">
        <i class="el-icon-plus el-icon--left"></i>在线填写
      </el-button>
      <data-list></data-list>
      <a class="download" target="_blank" :href="baseUrl + '/questions/download'" >点击下载题目模板</a>
    </div>
    <div class="flex margin-b-10">
      <el-select class="margin-r-10" @change="handleSelectChange" v-model="query.subjectId" filterable placeholder="请选择题目所属科目">
        <el-option label="全部" :value="null" ></el-option>
        <el-option v-for="(subject, index) in subjects" :key="index" :label="subject.name" :value="subject.id">
        </el-option>
      </el-select>
      <el-select class="margin-r-10" @change="handleSelectChange" v-model="query.type" filterable placeholder="请选择题型">
        <el-option label="全部" :value="null" ></el-option>
        <el-option v-for="item in typeList" :label="item.name" :value="item.name" ></el-option>
      </el-select>
      <el-date-picker
        class="margin-r-10"
        v-model="query.updatedAt"
        type="datetimerange"
        align="right"
        :picker-options="pickerOptions"
        @change="handleSelectChange"
        start-placeholder="更新时间"
        end-placeholder="更新时间">
      </el-date-picker>
    </div>
    <el-table
      :data="questionsList"
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
        prop="answer"
        label="答案"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="difficult"
        label="题目难度"
        show-overflow-tooltip>
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
        prop="subject"
        show-overflow-tooltip
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
      <el-table-column
        prop="teacher"
        label="出题老师"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.teacher">{{scope.row.teacher.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        prop="updatedAt"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.updatedAt">{{moment(scope.row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
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
      :total="questionsCount"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose('ruleForm')">
      <el-row :gutter="20">
        <el-col :span="6">
          <h4>请选择题目所属学科</h4>
          <el-tree
            node-key="index"
            ref="tree"
            :default-expanded-keys="defaultExpandedKeys"
            :data="majorsForTree"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
          ></el-tree>
        </el-col>
        <el-col :span="18">
          <el-form :model="form" :rules="formRules" ref="ruleForm">
            <el-form-item label="题目类型" :label-width="formLabelWidth" prop="type">
              <el-select v-model="form.type" placeholder="请选择题目类型">
                <el-option v-for="(type, index) in typeList" :key="index" :label="type.name" :value="type.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目" :label-width="formLabelWidth" prop="question">
              <el-input type="textarea" v-model="form.question" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="题目内容" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="答案" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.answer" autocomplete="off" placeholder="简答题请写入关键词  以，号分隔"></el-input>
            </el-form-item>
            <el-form-item label="题目难度" :label-width="formLabelWidth" prop="difficult">
              <el-select v-model="form.difficult" placeholder="请选择题目难度">
                <el-option v-for="(difficult, index) in difficultList" :key="index" :label="difficult.name" :value="difficult.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分值" :label-width="formLabelWidth" prop="score">
              <el-input-number v-model="form.score" :precision="0" :step="1" :min="1" :max="20"></el-input-number>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
        <el-button type="primary" @click="removeQuestion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getLoginUser, UUID } from '../../../utils/utils';
  import DataList from './DataList.vue';
  import moment from 'moment';
  import { baseUrl } from '../../../../config';
  export default {
    name: 'QuestionList',
    props: {
    },
    components: {
      DataList
    },
    computed: {
      questionsList() {
        return this.$store.state.questions.list;
      },
      questionsCount() {
        return this.$store.state.questions.count;
      },
      majors() {
        return this.$store.state.majors.list;
      },
      subjects() {
        return this.$store.state.subjects.list;
      },
      majorsForTree () {
        return this.$store.getters['majors/getMajorsForTree'];
      },
      typeList () {
        return this.$store.getters['ddic/getDetails']('name', '题目类型');
      },
      difficultList () {
        return this.$store.getters['ddic/getDetails']('name', '题目难度');
      }
    },
    data() {
      return {
        moment,
        baseUrl,
        url: '',
        page: 1,
        limit: 10,
        selectedMajor: getLoginUser('majorId'),
        selectedSubject: null,
        dialogFormVisible: false,
        deleteDialogVisible: false,
        defaultExpandedKeys: [0],
        query: {

        },
        form: {
          type: '',
          question: '',
          content: '',
          answer: '',
          difficult: '',
          score: 1,
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        formRules:{
          type: [
            { required: true, message: '请选择题目类型', trigger: 'change' }
          ],
          question: [
            { required: true, message: '题目名不能为空', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '题目内容不能为空', trigger: 'blur' },
          ],
          answer: [
            { required: true, message: '答案不能为空', trigger: 'blur' },
          ],
          difficult: [
            { required: true, message: '请选择题目难度', trigger: 'change' }
          ],
          score: [
            { required: true, message: '请填写分值', trigger: 'blur' }
          ],
        },
        formTitle: '添加题目',
        getClasses: false,
        deleteId: '',
        formLabelWidth: '120px',
        pickerOptions: {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 24 * 3600 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个小时',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近五分钟',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 5 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
    },
    mounted() {
      this.$store.dispatch('questions/getList', { offset: (this.page - 1) * this.limit, limit: this.limit });
      this.$store.dispatch('majors/getList');
      this.$store.dispatch('subjects/getList');
      this.$store.dispatch('ddic/getList');
      console.log(this.$store.dispatch('questions/getList'));
    },
    methods: {
      handleNodeClick(data) {
        this.selectedMajor = data.majorId;
        this.selectedSubject = data.subjectId;
      },
      setFormData(row = {}, edit) {
        this.url = edit ? 'questions/edit' : 'questions/create';
        const { id, type, question, content, answer, difficult = '中等', score = 1, subjectId, majorId } = row;
        this.form = { id, type, question, content, answer, difficult, score, subjectId, majorId };
        this.formTitle = edit ? '编辑题目' : '新增题目';
        this.dialogFormVisible = true;
      },
      handleClose(formName) {
        this.$refs[formName].clearValidate();
      },
      //编辑考试题目
      submitForm(formName) {
        this.form.majorId = this.form.majorId || this.selectedMajor;
        this.form.subjectId = this.form.subjectId || this.selectedSubject;
        console.log(this.form);
        if(this.form.majorId>0) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$store.dispatch(this.url, this.form).then(data => {
                if(data.success) {
                  this.dialogFormVisible = false;
                  this.$store.dispatch('questions/getList', { offset: (this.page - 1) * this.limit, limit: this.limit, ...this.getQueryData() });
                }
              });
            } else {
              console.error('error submit!!');
              return false;
            }
          });
        } else {
          this.$message({
            message: '请选择题目所属学科',
            type: 'warning'
          });
        }
      },
      saveDeleteId(id) {
        this.deleteId = id;
        this.deleteDialogVisible = true;
      },
      removeQuestion() {
        this.$store.dispatch('questions/remove', { id: this.deleteId }).then((data) => {
          this.deleteDialogVisible = false;
          if(data.success) {
            this.$store.dispatch('questions/getList', { offset: (this.page - 1) * this.limit, limit: this.limit, ...this.getQueryData() });
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.$store.dispatch('questions/getList', { offset: (val - 1) * this.limit, limit: this.limit, ...this.getQueryData() });
      },
      handleSelectChange() {
        this.page = 1;
        this.$store.dispatch('questions/getList', { offset: 0, limit: this.limit, ...this.getQueryData() });
      },
      getQueryData() {
        const { type, subjectId, updatedAt } = this.query;
        const data = { };
        if(updatedAt) {
          data.beginAt = updatedAt[0];
          data.endAt = updatedAt[1];
        }
        if(type) {
          data.type = type;
        }
        if(subjectId) {
          data.subjectId = subjectId;
        }
        return data;
      }
    },
  }
</script>

<style lang="less">
  .question_list {
    text-align: left;
    td {
      text-align: left;
    }
    .upload-demo {
      display: flex;
    }
    .el-pagination {
      text-align: right;
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
    .download {
      color: #409eff;
      margin-left: 10px;
    }
  }
</style>

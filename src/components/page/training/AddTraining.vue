<template>
  <span class="training">
    <div class="flex margin-b-10">
      <question-list @clearSelection="toggleRowSelection" @clearData="clearData" :data="questionsList" :name="form.name"></question-list>
    </div>

    <div class="flex margin-b-10">
      <el-select class="margin-r-10" @change="handleSelectChange" v-model="type" filterable placeholder="请选择题型">
        <el-option label="全部" :value="null" ></el-option>
        <el-option v-for="item in typeList" :label="item.name" :value="item.name" ></el-option>
      </el-select>
      <el-select class="margin-l-10" @change="handleSelectChange" v-model="subjectId" filterable placeholder="请选择题目所属科目">
        <el-option label="全部" :value="null" ></el-option>
        <el-option v-for="(subject, index) in subjects" :key="index" :label="subject.name" :value="subject.id">
        </el-option>
      </el-select>
      <el-date-picker
        class="margin-r-10"
        v-model="updatedAt"
        type="datetimerange"
        align="right"
        :picker-options="pickerOptions"
        @change="handleSelectChange"
        start-placeholder="更新时间"
        end-placeholder="更新时间"
      >
      </el-date-picker>
    </div>
    <el-table
      ref="multipleTable"
      :data="list"
      border
      row-key="id"
      @select="handleSelect"
      @select-all="handleSelect"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="selection"
        reserve-selection
        width="55">
      </el-table-column>
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
    <div class="table_bottom">
      <p v-if="this.questionsList.length > 0">确认无误后点击确定按钮可以完成组卷</p>
      <p v-if="this.questionsList.length < 1"> </p>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <div class="footer">
      <el-button @click="back">返回</el-button>
      <el-button :disabled="this.questionsList.length < 1" type="primary" @click="submitData">确定</el-button>
    </div>
    <el-dialog
      title="请先给练习设置一个名字"
      :visible.sync="nameDialogVisible"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form :model="form" :rules="formRules" ref="ruleForm">
        <el-form-item label="练习名字" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="back">返回</el-button>
        <el-button type="primary" @click="checkName">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
  import { getLoginUser, UUID } from '../../../utils/utils';
  import QuestionList from './QuestionList.vue';
  import { questionType } from '../../../constant';
  export default {
    name: 'training',
    components: {
      QuestionList
    },
    data() {
      return {
        page: 1,
        limit: 10,
        importDialog: false,
        nameDialogVisible: false,
        deleteId: null,
        questionsList: [],
        subjectId: null,
        updatedAt: null,
        type: null,
        form: {
          name: '',
        },
        formRules: {
          name: [
            { required: true, message: '练习名不能为空', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
        },
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
    computed: {
      list() {
        return this.$store.state.questions.list;
      },
      count() {
        return this.$store.state.questions.count;
      },
      subjects() {
        return this.$store.state.subjects.list;
      },
      typeList () {
        return this.$store.getters['ddic/getDetails']('name', '题目类型');
      },
    },
    created() {
    },
    mounted() {
      this.$store.dispatch('questions/getList', { offset: (this.page - 1) * this.limit, limit: this.limit });
      this.$store.dispatch('subjects/getList');
      this.$store.dispatch('ddic/getList');
      setTimeout(() =>{
        this.nameDialogVisible = true;
      }, 200)
    },
    methods: {
      submitData() {
        const answer = {};
        const length = this.questionsList.length;
        if(length > 0) {
          let score = 0;
          const types = Object.values(questionType);
          const sortList = this.questionsList.sort((a, b) => {
            return types.indexOf(a.type) - types.indexOf(b.type);
          });
          const questions = sortList.map(question => {
            score += question.score;
            answer[question.id] = { value: question.answer, type: question.type, score: question.score };
            return question.id;
          });
          const message = `练习【${this.form.name}】选择题目【${length}】项，总分【${score}】分，确定提交吗？`;
          this.$confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const data = {questions, answer, name: this.form.name};
            this.$store.dispatch('trainings/create', data).then(data => {
              if(data.success) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.back();
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            });
          });
        }
      },
      checkName() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.nameDialogVisible = false;
          } else {
            return false;
          }
        });
      },
      back() {
        this.$router.replace('/homepage/training')
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
        const data = { };
        if(this.subjectId) {
          data.subjectId = this.subjectId;
        }
        if(this.type) {
          data.type = this.type;
        }
        if(this.updatedAt) {
          data.beginAt = this.updatedAt[0];
          data.endAt = this.updatedAt[1];
        }
        return data;
      },


      handleSelect(val) {
        this.questionsList = val;
      },
      toggleRowSelection(row, selected) {
        this.$refs.multipleTable.toggleRowSelection(row,selected);
      },
      clearData() {
        this.$refs.multipleTable.clearSelection();
        this.questionsList = [];
      },
    },
  }
</script>

<style lang="less">
  .training {
    text-align: left;
    td {
      text-align: left;
    }
    .table_bottom {
      display: flex;
      justify-content: space-between;
      p {
        line-height: 34px;
        color: crimson;
        font-size: 14px;
      }
    }
    .footer {
      margin-top: 10px;
      text-align: right;
      padding: 0;
      button {
        margin-left: 10px;
      }
    }
    .el-pagination {
      text-align: right;
      padding: 3px 0;
    }
  }
</style>

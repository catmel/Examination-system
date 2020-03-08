<template>
  <div class="studentGrade">
    <div class="content">
      <div class="top">
        <h1>{{data.name}}</h1>
        <template v-for="(question, index) in questionList">
          <template v-if="question.type === questionType.RADIO" >
            <radio
              :question="question"
              :isCorrect="correct[question.id]"
              :defaultValue.sync="answers[question.id]"
              :index="index"
              :check="studentData.check"
            ></radio>
          </template>

          <!-- <template v-if="question.type === questionType.MULTIPLE">
            <multiple
              :question="question"
              :isCorrect="correct[question.id]"
              :defaultValue.sync="answers[question.id]"
              :index="index"
              :check="studentData.check"
            ></multiple>
          </template> -->

          <!-- <template v-if="question.type === questionType.JUDGE" >
            <judge
              :question="question"
              :isCorrect="correct[question.id]"
              :defaultValue.sync="answers[question.id]"
              :index="index"
              :check="studentData.check"
            ></judge>
          </template> 

          <template v-if="question.type === questionType.COMPLETION">
            <completion
              :question="question"
              :score="correct[question.id]"
              :defaultValue.sync="answers[question.id]"
              :index="index"
              :check="studentData.check"
              @setCorrect="setCorrect"
            ></completion>
          </template> -->

          <template v-if="question.type === questionType.SHORT_ANSWER" >
            <short-answer
              :question="question"
              :score="correct[question.id]"
              :defaultValue.sync="answers[question.id]"
              :index="index"
              :check="studentData.check"
              @setCorrect="setCorrect"
            ></short-answer>
          </template>

          <template v-if="question.type === questionType.CODE" >
            <Code
              :question="question"
              :score="correct[question.id]"
              :defaultValue.sync="answers[question.id]"
              :index="index"
              :check="studentData.check"
              @setCorrect="setCorrect"
            ></Code>
          </template>
          
        </template>
        <hr/>
        <h4>教师评语</h4>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="comment"></el-input>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <span>确定要结束阅卷吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="isTeacher" class="margin-t-10 text-c check_btn" >
      <!--<el-button @click="back">返 回</el-button>-->
      <el-button type="primary" @click="dialogVisible = true">结束阅卷</el-button>
    </div>
    <div v-if="!isTeacher" class="margin-t-10 text-c" >
      <el-button v-if="!showError" type="primary" @click="showErrorQuestions(true)">只看错题</el-button>
      <el-button v-if="showError" type="primary" @click="showErrorQuestions(false)">查看全部</el-button>
    </div>
  </div>
</template>

<script>
  import { getLoginUser, UUID, countdown } from '../../../utils/utils';
  import { roles } from '../../../constant';
  import Radio from '../../common/Radio.vue';
  import Multiple from '../../common/Multiple.vue';
  import Completion from '../../common/Completion.vue';
  import Judge from '../../common/Judge.vue';
  import ShortAnswer from '../../common/ShortAnswer.vue';
  import Code from '../../common/Code.vue';
  import { questionType } from '../../../constant';
  export default {
    name: 'studentExam',
    props: {
    },
    components: { Radio, Multiple, Completion, Judge, ShortAnswer, Code },
    computed: {
    },
    data() {
      return {
        questionType,
        dialogVisible: false,
        formLabelWidth: '120px',
        data: { answer: {} },
        answers: {},
        questionList: [],
        correct: {},
        error: {},
        comment: '',
        studentData: {},
        isTeacher: getLoginUser('role') < 400,
        showError :false,
      }
    },
    created() {
    },
    mounted() {
      const payload = {};
      if(this.isTeacher) {
        payload.userId = this.$route.query.userId;
      }
      this.$store.dispatch('trainings/getOne', { id: this.$route.params.id, ...payload }).then(res => {
        if(res.success) {
          this.data = res.data || {answer: {}};
          this.questionList = this.data.questionList || [];
          // console.log(this.questionList);
        }
      });
      //获取学生答案
      this.$store.dispatch('trainingOfStudent/getAnswer', { trainingId: this.$route.params.id, ...payload }).then(res => {

        // console.log(res.data)

        if(res.success) {
          this.answers = res.data.answer || {};
          this.correct = res.data.correct || {};
          this.error = res.data.error || {};
          this.comment = res.data.comment;
          this.studentData = res.data || {};
        }
        // console.log("---",this.error)

      });
    },
    methods: {
      setCorrect(id, val) {
        console.log("setCorrect",id,val);
        this.correct[id] = val;
      },
      back() {
        this.$router.replace('/homepage/student-training')
      },
      showErrorQuestions(val) {
        this.showError = val;
        // console.log(this.showError);
        this.questionList = (this.data.questionList || []).filter(item => {
          return !val || this.error[item.id];
        });
      },
      submit() {
        const data = {
          error: this.error,
          correct: this.correct,
          trainingId: this.data.id,
          trainingName: this.data.name,
          userId: this.studentData.userId,
          username: this.studentData.username,
          comment: this.comment,
        };

        console.log("结束阅卷",data)

        this.$store.dispatch('trainingOfStudent/finishGrade', data).then((res) => {
          if(res.success) {
            this.dialogVisible = false;
            this.$message({
              type: 'success',
              duration: 0,
              message: `阅卷成功，得分：${res.data}`
            });
          }
        });
      },
    },
  }
</script>

<style lang="less">
  .studentGrade {
    height: 100%;
    display: flex;
    padding: 20px;
    flex-direction: column;
    .content{
      background: #fff;
      overflow: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      .top {
        flex: 1;
        overflow-x: hidden;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
      }
    }
    text-align: left;
    td {
      text-align: left;
    }
    h1 {
      text-align: center;
    }
    .check_btn{
      .el-button--primary{
        color: #ffd000;
        background-color: #434343;
        border-color: #434343;
      }
    }
   
  }
</style>

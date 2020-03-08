<template>
  <div class="studentExam">
    <div class="content">
      <div class="top">
        <h1>{{data.name}}</h1>
        <!-- 单选题 -->
        <template v-if="question.type === questionType.RADIO" >
          <radio :key="current" :question="question" :defaultValue.sync="answers[question.id]" :index="current" @setVal="setVal"></radio>
        </template>
        <!-- 多选题 -->
        <template v-if="question.type === questionType.MULTIPLE">
          <multiple :key="current" :question="question" :defaultValue.sync="answers[question.id]" :index="current" @setVal="setVal"></multiple>
        </template>
        <!-- 填空题 -->
        <template v-if="question.type === questionType.COMPLETION">
          <completion :key="current" :question="question" :defaultValue.sync="answers[question.id]" :index="current" @setVal="setVal"></completion>
        </template>
        <!-- 判断题 -->
        <template v-if="question.type === questionType.JUDGE" >
          <judge :key="current" :question="question" :defaultValue.sync="answers[question.id]" :index="current" @setVal="setVal"></judge>
        </template>
        <!-- 简答题 -->
        <template v-if="question.type === questionType.SHORT_ANSWER" >
          <short-answer :key="current" :question="question" :defaultValue.sync="answers[question.id]" :index="current" @setVal="setVal" onpaste="return false"></short-answer>
        </template>
        <!-- 编程题 -->
        <!-- <template v-if="question.type === questionType.CODE" >
          <RichText :key="current" :question="question" :defaultValue.sync="answers[question.id]" :index="current" @setVal="setVal"  onpaste="return false"></RichText>
        </template> -->
        <template v-if="question.type === questionType.CODE" >
          <RichText :key="current" :question="question" :defaultValue.sync="answers[question.id]" :index="current" @setVal="setVal"></RichText>
        </template>
        <!-- {{question.id}} -->
      </div>
      <div class="margin-t-10 bottom" >
        <div>
          <el-button v-if="current > 0 " @click="next(-1)">上一题</el-button>
          <el-button v-if="current < this.data.questionList.length - 1  " @click="next(1)">下一题</el-button>
        </div>
        <div v-if="countdownStr">剩余时间：{{ countdownStr }}</div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <span>确定要结束答题吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(false)">确 定</el-button>
      </span>
    </el-dialog>
    <div class="margin-t-10 text-r" >
      <el-button @click="back">返 回</el-button>
      <el-button type="primary" @click="dialogVisible = true">结束答题</el-button>
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
  import RichText from '../../common/rich_text.vue';
  export default {
    name: 'studentExam',
    props: {
    },
    components: { Radio, Multiple, Completion, Judge, ShortAnswer, Code, RichText },
    computed: {
    },
    data() {
      return {
        questionType,
        dialogVisible: false,
        formLabelWidth: '120px',
        data: {questionList: []},
        question: {},
        answers: {},
        current: 0,
        countdownStr: '',
        interval: null,
      }
    },
    created() {
      this.interval = setInterval(() => {
        const { str, second } = countdown(this.$route.query.endAt);
        if(second === -1) {
          clearInterval(this.interval);
          this.submit('考试结束，已自动提交答案');
        } else if(second === 300*1000) {
          this.$message({
            message: '考试时间还有5分钟，请注意答题时间。',
            type: 'warning',
          });
        } else if(second === 180*1000) {
          this.$message({
            message: '考试时间还有3分钟，请注意答题时间，超过时间会自动提交答案',
            type: 'warning',
          });
        } else if(second > 0) {
          this.countdownStr = str;
        }
      }, 1000);
    },
    mounted() {
      this.$store.dispatch('trainings/getOne', { id: this.$route.params.id }).then(res => {
        if(res.success) {
          this.data = res.data || {questionList: []};
          this.question = this.data.questionList[this.current];
        }
      });
      //获取答案
      this.$store.dispatch('trainingOfStudent/getAnswer', { trainingId: this.$route.params.id, userId: getLoginUser('id') }).then(res => {
        if(res.success) {
          this.answers = res.data.answer || {};
        }
      });
    },
    methods: {
      setVal(val, id) {
        this.answers[id] = val;
        // console.log(this.answers[id]);
      },
      back() {
        this.$router.replace('/homepage/student-training')
      },
      next(num) {
        this.current += num;
        this.question = this.data.questionList[this.current];
        this.submit(-1);
      },
      submit(message) {
        const fixed = (Object.keys(this.answers).length / this.data.questionList.length).toFixed(4);
        // console.log("---",this.data.id);
        const data = {
          answer: this.answers,
          trainingId: this.data.id,
          trainingName: this.data.name,
          completion: fixed > 1 ? 1 : fixed,
        };
        this.$store.dispatch('trainingOfStudent/finishExam', data).then((res) => {
          if(res.success) {
            this.dialogVisible = false;
            if(message !== -1) {
              this.$message({
                type: 'success',
                message: message || '考试结束，答案提交成功',
              });
            }
            if(!message) {
              this.back();
            }
          } else {
            this.$message({
              message: message || '答案提交失败，请联系老师',
              type: 'error',
            });
          }
        });
      },
    },
    beforeDestroy() {
      clearInterval(this.interval);
    }
  }
</script>

<style lang="less">
  .studentExam {
    height: 100%;
    display: flex;
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
        overflow: hidden;
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
  }
  .el-textarea{
    .el-textarea__inner{
      user-select:none;
    }
  }
</style>

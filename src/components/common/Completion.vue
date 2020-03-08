<template>
  <div class="completion_component">
    <div class="questionItem">{{index + 1}}、<span v-html="question.question"></span> （{{question.score}}分）</div>
    <div class="questionContent" v-html="question.content"></div>
    <el-input :readonly="isTeacher || check" v-model="data" @change="handleChange(question.id)"></el-input>
    <div v-if="isTeacher || check" class="grade">
      教师评分：<el-input-number @change="handleScore(question.id)" v-model="grade" :precision="0" :step="0" :min="0" :max="question.score"></el-input-number>
    </div>
  </div>
</template>

<script>
  import { getLoginUser } from '../../utils/utils';

  export default {
    name: 'completion_component',
    props: ['index', 'question', 'defaultValue', 'score', 'check'],
    components: {},
    data() {
      return {
        data: '',
        grade: 0,
        isTeacher: getLoginUser('role') < 400,
      }
    },
    mounted() {
      this.data = this.defaultValue;
      this.grade = this.score;
    },
    methods: {
      handleChange(index) {
        this.$emit('setVal', this.data, index)
      },
      handleScore(id) {
        this.$emit('setCorrect', id, this.grade )
      },
    },
  }
</script>
<style lang="less">
  .completion_component {
    .questionItem {
      line-height: 50px;
      font-weight: bold;
      font-size: 16px;
      span {
        white-space: pre-wrap;
      }
    }
    .questionContent {
      white-space: pre-wrap;
      text-indent: 1em;
      line-height: 45px;
    }
    .grade {
      padding: 10px 0;
    }
    .isCorrect {
      color: green;
      font-size: 14px;
    }
    .isError {
      color: red;
      font-size: 14px;
    }
    .el-button.is-circle {
      padding: 5px;
    }
  }
</style>

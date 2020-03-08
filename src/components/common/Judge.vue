<template>
  <div class="judge_component">
    <div class="questionItem">{{index + 1}}、<span v-html="question.question"></span> （{{question.score}}分）</div>
    <el-radio :disabled="isTeacher || check" v-model="data" :label="true" @change="handleChange(question.id)">正确</el-radio>
    <el-radio :disabled="isTeacher || check" v-model="data" :label="false" @change="handleChange(index)">错误</el-radio>
    <div v-if="isTeacher || check" class="grade">
      <span class="isCorrect" v-if="isCorrect">正确：<i class="el-icon-success"></i></span>
      <span class="isError" v-if="!isCorrect">错误：<i class="el-icon-error"></i></span>
    </div>
  </div>
</template>

<script>
  import { getLoginUser } from '../../utils/utils';

  export default {
    name: 'judge_component',
    props: ['index', 'question', 'defaultValue', 'isCorrect', 'check'],
    components: {
    },
    data() {
      return {
        data: '',
        isTeacher: getLoginUser('role') < 400,
      }
    },
    mounted() {
      this.data = this.defaultValue;
    },
    methods: {
      handleChange(index) {
        this.$emit('setVal', this.data, index)
      }
    },
  }
</script>
<style lang="less">
  .judge_component {
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
  }
</style>

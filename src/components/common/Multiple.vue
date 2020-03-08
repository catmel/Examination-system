<template>
  <div class="multiple_component">
    <div class="questionItem">{{index + 1}}、<span v-html="question.question"></span> （{{question.score}}分）</div>
    <template v-for="(answer, i) in (question.content || '').split(/\n|;|；/).filter(item => item && item.trim())">
      <el-checkbox v-if="!!answer && answer.trim()!==''" :disabled="isTeacher || check" v-model="data" :label="getCode(i)" @change="handleChange(question.id)">{{answer}}</el-checkbox>
    </template>
    <div v-if="isTeacher || check" class="grade">
      <span class="isCorrect" v-if="isCorrect">正确：<i class="el-icon-success"></i></span>
      <span class="isError" v-if="!isCorrect">错误：<i class="el-icon-error"></i></span>
    </div>
  </div>
</template>

<script>
  import { getCode, getLoginUser } from '../../utils/utils';
  export default {
    name: 'multiple_component',
    props: ['index', 'question', 'defaultValue', 'isCorrect', 'check'],
    components: {
    },
    data() {
      return {
        data: [],
        getCode,
        stem: '',
        content: '',
        isTeacher: getLoginUser('role') < 400,
      }
    },
    created() {
    },
    mounted() {
      this.data = this.defaultValue ? this.defaultValue.split('') : [];
      this.stem = this.question.question;
      this.content = this.question.content;
    },
    methods: {
      handleChange(index) {
        this.$emit('setVal', this.data.sort().join(''), index)
      }
    },
  }
</script>
<style lang="less">
  .multiple_component {
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
    .el-checkbox+.el-checkbox {
      margin-left: 0!important;
      margin-right: 30px!important;
      padding: 5px 0;
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

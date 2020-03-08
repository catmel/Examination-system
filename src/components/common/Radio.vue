<template>
  <div class="radio_component">
    <div class="questionItem">{{index + 1}}、<xmp v-html="question.question"></xmp> （{{question.score}}分）</div>
    
    <!-- <template v-for="(answer, i) in (question.content || '').split(/\n|;|；/).filter(item => item && item.trim())"> -->
    <template v-for="(answer, i) in (question.content || '').split(/\n/).filter(item => item && item.trim())">
      <el-radio v-if="!!answer && answer.trim()!==''" :disabled="isTeacher || check" v-model="data" :label="getCode(i)" @change="handleChange(question.id)">{{answer}}</el-radio>
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
    name: 'radio_component',
    props: ['index', 'question', 'defaultValue', 'isCorrect', 'check'],
    components: {  },
    data() {
      return {
        data: '',
        getCode,
        isTeacher: getLoginUser('role') < 400,
      }
    },
    created() {
    },
    mounted() {
      this.data = this.defaultValue;
    },
    methods: {
      // 选择题选项操作
      handleChange(id) {
        this.$emit('setVal', this.data, id);
      },
    },
  }
</script>
<style lang="less">
  .radio_component {
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
    .el-radio, .el-radio+.el-radio {
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

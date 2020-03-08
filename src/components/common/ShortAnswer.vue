<template>
  <div class="checkbox_component">
    <div class="questionItem">{{index + 1}}、<span v-html="question.question"></span> （{{question.score}}分）</div>
    <div class="questionContent" v-html="question.content"></div>
    <el-input :readonly="isTeacher || check" type="textarea" :autosize="{ minRows: 4, maxRows: 20}" v-model="data" @change="handleChange(question.id)"></el-input>
    
    <div v-if="isTeacher || check" class="grade">
      教师评分：<el-input-number @change="handleScore(question.id,grade)"  v-model="grade" :precision="0" :step="1" :min="0" :max="question.score"></el-input-number>
    </div>

  </div>
</template>

<script>
  import { getLoginUser } from '../../utils/utils';

  export default {
    name: 'checkbox_component',
    props: ['index', 'question', 'defaultValue', 'score', 'check'],
    components: {
    },
    data() {
      return {
        data: '',
        grade: 0,
        isTeacher: getLoginUser('role') < 400,
      }
    },
    mounted() {
      // console.log(this.defaultValue);
      this.data = this.defaultValue;   //学生答案
        if(this.isTeacher == true){
          if(this.score == undefined){
            //匹配关键字
            if(this.question.answer&&this.defaultValue){
              // 关键字转换为数组
              var keyWord = this.question.answer.toLowerCase().split(',');
              var num = 0;
              // 概率
              var gl = parseFloat((1/keyWord.length).toFixed(2));
              for(var i = 0;i<this.defaultValue.length;i++){  
                if(this.defaultValue.toLowerCase().indexOf(keyWord[i]) !== -1){
                  num += gl;
                };
              }
              if(num>=1){
                num = 1;
              }
              this.grade = parseInt(num*this.question.score);
              console.log('关键词匹配率'+num+',推荐分数',this.grade);
              this.handleScore(this.question.id);
            }else{
              console.log('该简答题暂未设置关键字');
            }
          }else{
             this.grade = this.score;  //学生分数
          }
        }
    },
    methods: {
      handleChange(index) {
        console.log("答题内容",this.data);
        this.$emit('setVal', this.data, index)
      },
      handleScore(id,val) {
        // console.log("setCorrect",id,val);
        this.$emit('setCorrect', id, this.grade)
      },
    },
  }
</script>
<style lang="less">
  .checkbox_component {
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

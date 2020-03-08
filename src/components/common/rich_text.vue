<template>
  <div class="code_component">
    <div class="questionItem">{{index + 1}}、<span v-html="question.question"></span> （{{question.score}}分）</div>
    <div class="questionContent" v-html="question.content"></div>
    <!-- <el-input :readonly="isTeacher || check" type="textarea" :autosize="{ minRows: 4, maxRows: 20}" v-model="data" @change="handleChange(question.id)"></el-input>  -->
    <div id="codearea"  :readonly="isTeacher || check"  v-model="data" @change="handleChange(question.id)"></div>
    <div v-if="isTeacher || check" class="grade">
      教师评分：<el-input-number @change="handleScore(question.id)" v-model="grade" :precision="0" :step="1" :min="0" :max="question.score"></el-input-number>
    </div>
  </div>
 
  <!-- <h1>Hello World!</h1> -->
  <!-- <codemirror v-model="code" :options="cmOption"></codemirror> -->

</template>

<script>
  import CodeMirror from 'codemirror'
  // language
  import 'codemirror/mode/javascript/javascript.js'
  // theme css
  import 'codemirror/theme/monokai.css'
  // require active-line.js
  import'codemirror/addon/selection/active-line.js'
  // styleSelectedText
  import'codemirror/addon/selection/mark-selection.js'
  import'codemirror/addon/search/searchcursor.js'
  // hint
  import'codemirror/addon/hint/show-hint.js'
  import'codemirror/addon/hint/show-hint.css'
  import'codemirror/addon/hint/javascript-hint.js'
  import'codemirror/addon/selection/active-line.js'
  // highlightSelectionMatches
  import'codemirror/addon/scroll/annotatescrollbar.js'
  import'codemirror/addon/search/matchesonscrollbar.js'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/match-highlighter.js'
  // keyMap
  import'codemirror/mode/clike/clike.js'
  import'codemirror/addon/edit/matchbrackets.js'
  import'codemirror/addon/comment/comment.js'
  import'codemirror/addon/dialog/dialog.js'
  import'codemirror/addon/dialog/dialog.css'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/search.js'
  import'codemirror/keymap/sublime.js'
  // foldGutter
  import'codemirror/addon/fold/foldgutter.css'
  import'codemirror/addon/fold/brace-fold.js'
  import'codemirror/addon/fold/comment-fold.js'
  import'codemirror/addon/fold/foldcode.js'
  import'codemirror/addon/fold/foldgutter.js'
  import'codemirror/addon/fold/indent-fold.js'
  import'codemirror/addon/fold/markdown-fold.js'
  import'codemirror/addon/fold/xml-fold.js'


  import { getLoginUser } from '../../utils/utils';

  export default {
    name: 'code_component',
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
    created() {
    },
    mounted() {
      // console.log(index);
      this.data = this.defaultValue||'';
      this.grade = this.score;
      // (function code(){
        let myTextarea = document.getElementById('codearea');
          var myCodeMirror = CodeMirror(myTextarea, {
            tabSize: 4,
            indentUnit: 4,
            styleActiveLine: false,
            lineNumbers: true,
            styleSelectedText: false,
            line: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter",'CodeMirror-lint-markers'],
            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
            mode: 'text/javascript',
            // hint.js options
            hintOptions: {
                hint: CodeMirror.hint.javascript,
                completeSingle: false
            },
            //快捷键 可提供三种模式 sublime、emacs、vim
            keyMap: "sublime",
            matchBrackets: true,
            showCursorWhenSelecting: true,
            theme: "monokai",
            //快捷键
            extraKeys:{
              "Ctrl-/": function(){
                  myCodeMirror.toggleComment();
              },
              "Ctrl-V": function(){
                  alert("请严肃考试  禁止粘贴");
              },
              "Command-V": function(){
                  alert("请严肃考试  禁止粘贴");
              },
            },
            lineWrapping: true,    // 自动换行
            autofocus: true,
            value: this.data
        });
        myCodeMirror.on('change', (instance, change) => {
          if (change.origin !== 'complete' && /\w|\./g.test(change.text[0])) {
              myCodeMirror.showHint();
          }
          this.data = myCodeMirror.getValue();
          this.handleChange(this.question.id);
        });
        myTextarea.oncontextmenu = function(e){
        　　return false;
        }
    },
    methods: {
      handleChange(index) {
        // console.log("编程题答案",this.data);
        this.$emit('setVal', this.data, index)
      },
      handleScore(id) {
        this.$emit('setCorrect', id, this.grade )
      },
    },
  }



</script>

<style  lang="less">
  .CodeMirror-focused .cm-matchhighlight {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
    background-position: bottom;
    background-repeat: repeat-x;
  }
  /* .cm-matchhighlight {background-color: lightgreen} */
  .CodeMirror-selection-highlight-scrollbar {background-color: green}
  #scroll{
    text-align: left;
  }
   .code_component {
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
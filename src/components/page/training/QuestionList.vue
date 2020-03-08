<template>
  <span class="questions">
    <el-button type="primary" @click="addQuestion">查看已选择题目</el-button>
    <span class="margin-l-10">练习名称：<span class="primary bold"> {{name}}</span>；</span>
    <span class="margin-l-10">已选择<span class="primary bold"> {{data.length}} </span>项；</span>
    <span class="margin-l-10">总分 <span class="primary bold" v-html="getScore()"></span> 分；</span>
    <span v-if="data.length > 0" @click="$emit('clearData')" class="primary bold margin-l-10">清空</span>
    <el-dialog
      :visible.sync="importDialog"
      :title="name"
      width="80%"
    >
      <el-table
        :data="data"
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
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="saveDeleteRow(scope.row)"  type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false">取 消</el-button>
        <el-button type="primary" @click="importDialog = false">确定</el-button>
      </span>
      <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="400px"
        append-to-body
      >
      <span>确定要删除该项吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeQuestion">确 定</el-button>
      </span>
    </el-dialog>
    </el-dialog>
  </span>
</template>

<script>
  import { getLoginUser, UUID } from '../../../utils/utils';
  export default {
    name: 'questions',
    props: ['data', 'name'],
    components: {

    },
    data() {
      return {
        importDialog: false,
        deleteDialogVisible: false,
        row: '',
//        score: 0,
      }
    },
    methods: {
      getScore() {
        let score = 0;
        this.data.map(item => {
          score += item.score;
        });
        return score;
      },
      addQuestion() {
        this.importDialog = true;
      },
      saveDeleteRow(row) {
        this.row = row;
        this.deleteDialogVisible = true;
      },
      removeQuestion() {
        this.$emit('clearSelection', this.row);
        this.deleteDialogVisible = false;
      },
    },
  }
</script>

<style lang="less">
  .questions {
    text-align: left;
    td {
      text-align: left;
    }
    .el-pagination {
      text-align: right;
    }
  }
</style>

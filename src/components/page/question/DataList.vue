<template>
  <span class="data_List">
    <el-button class="margin-b-10" type="primary" @click="importDataClick">
      <i class="el-icon-plus el-icon--left"></i>文件导入
    </el-button>
    <el-dialog
      :visible.sync="importDialog"
      width="80%"
    >
      <el-upload
        slot="title"
        class="upload-demo"
        :auto-upload="false"
        :action="baseUrl + '/questions/import'"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :on-change="this.handleChange"
        :file-list="fileList">
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
      </el-upload>
      <el-table
        :data="importData"
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
          prop="answer"
          label="答案"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="difficult"
          label="题目难度"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="majorName"
          show-overflow-tooltip
          label="所属学科">
        </el-table-column>
        <el-table-column
          prop="subjectName"
          show-overflow-tooltip
          label="所属科目">
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
            <el-button @click="saveDeleteId(scope.$index)"  type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <p v-if="this.importData.length > 0">确认无误后点击上传题目按钮可以上传到服务器</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false">取 消</el-button>
        <el-button :disabled="this.importData.length < 1" type="primary" @click="submitData">上传题目</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
  import {baseUrl} from "../../../../config";

  export default {
    name: 'DataList',
    components: {

    },
    data() {
      return {
        baseUrl,
        page: 1,
        limit: 10,
        deleteDialogVisible: false,
        importDialog: false,
        deleteId: null,
        fileList: [],
        importData: [],
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      submitData() {
        this.$store.dispatch('questions/uploadData', this.importData).then(data => {
          if(data.success) {
            this.importDialog = false;
            this.$store.dispatch('questions/getList', { offset: (this.page - 1) * this.limit, limit: this.limit });
          }
        });
      },
      handleChange(file) {
        this.fileList = [file];
        const formData = new FormData();
        formData.append("files",file.raw);
        return this.$store.dispatch('questions/uploadFile', formData).then((res) => {
          this.importData = res.data || [];
        });
      },
      saveDeleteId(id) {
        this.deleteId = id;
        this.deleteDialogVisible = true;
      },
      removeQuestion() {
        this.importData.splice(this.deleteId, 1);
        if(this.importData.length < 1) {
          this.fileList = [];
        }
        this.deleteDialogVisible = false;
      },
      importDataClick() {
        this.importData = [];
        this.fileList = [];
        this.importDialog = true;
      },
    },
  }
</script>

<style lang="less">
  .data_List {
    text-align: left;
    margin-left: 10px;
    td {
      text-align: left;
    }
  }
</style>

<template>
  <div class="training_list">
    <el-table
      :data="trainingsList"
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
        prop="trainingName"
        label="名字"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="完成度"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="trainingOfStudent[scope.row.trainingId]">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="trainingOfStudent[scope.row.trainingId].completion * 100" status="success"></el-progress>
          </span>
          <span v-if="!trainingOfStudent[scope.row.trainingId]">暂无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="评分"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="trainingOfStudent[scope.row.trainingId]">
            {{trainingOfStudent[scope.row.trainingId].check ? trainingOfStudent[scope.row.trainingId].score : '尚未评分'}}
          </span>
          <span v-if="!trainingOfStudent[scope.row.trainingId]">暂无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上次练习时间"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="trainingOfStudent[scope.row.trainingId]">{{moment(trainingOfStudent[scope.row.trainingId].updatedAt).format('YYYY-MM-DD HH:mm:ss')}}</span>
          <span v-if="!trainingOfStudent[scope.row.trainingId]">暂无</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="showTraining(scope.row)" type="text" size="small">查看练习</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="trainingsCount"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
  import { getLoginUser, UUID } from '../../../utils/utils';
  import { roles } from '../../../constant';
  import moment from 'moment';
  export default {
    name: 'TrainingsList',
    props: {
    },
    components: {
    },
    computed: {
      trainingsList() {
        //id为班级发布试卷的id号
        console.log(this.$store.state.trainings.list);
        return this.$store.state.trainings.list;
      },
      trainingsCount() {
        return this.$store.state.trainings.count;
      },
    },
    data() {
      return {
        moment,
        page: 1,
        limit: 10,
        formLabelWidth: '120px',
        trainingOfStudent: {},
        data: [],
      }
    },
    created() {
    },
    async mounted() {
      //通过userID查找他所有参与过的考试
      await this.$store.dispatch('trainingOfStudent/getTrainingsOfStudent', { userId: getLoginUser('id') }).then(res => {
        if(res.success) {
          const obj = {};
          res.data.map(item => {
            obj[item.trainingId] = item;
          });
          this.trainingOfStudent = obj;
          console.log(this.trainingOfStudent)
        }
      });
      this.$store.dispatch('trainings/getList', { offset: (this.page - 1) * this.limit, limit: this.limit });
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.$store.dispatch('trainings/getList', { offset: (val - 1) * this.limit, limit: this.limit });
      },
      showTraining(row) {
        const trainingOfStudent = this.trainingOfStudent[row.trainingId] || {};
        if(trainingOfStudent.check) {
          let routeUrl = this.$router.resolve({
            path: '/grade/' + row.trainingId,
          });
          window.open(routeUrl .href, '_blank');
        } else {
          this.$router.push({
            path: '/homepage/student-training/' + row.trainingId,
            query: { endAt: row.endAt }
          });
        }
      },
    },
  }
</script>

<style lang="less">
  .training_list {
    text-align: left;
    td {
      text-align: left;
    }
    .upload-demo {
      display: flex;
    }
    .el-pagination {
      text-align: right!important;
      padding: 3px 0;
    }
    .el-dialog {
      width: 60%;
      min-width: 500px;
      .el-select {
        width: 100%;
      }
    }
    .img_td > .cell {
      line-height: 0;
    }
    .el-upload-list__item:first-child {
      margin-top: 5px!important;
      padding-left: 10px;
      a, i {
        color: green;
      }
    }
    .download {
      color: #409eff;
      margin-left: 10px;
    }
  }
</style>

<template>
  <div class="training_list">
    <div class="flex margin-b-10">
      <el-select @change="handleSelectChange" v-model="majorId" filterable placeholder="请选择学科">
        <el-option label="全部" :value="null"></el-option>
        <el-option v-for="major in allMajors" :key="major.id" :label="major.name" :value="major.id">
        </el-option>
      </el-select>
      <el-select @change="handleSelectChange" v-model="classId" filterable placeholder="请选择班级">
        <el-option label="全部" :value="null"></el-option>
        <el-option v-for="classItem in allClasses" :key="classItem.id" :label="classItem.name" :value="classItem.id">
        </el-option>
      </el-select>
      <el-select @change="handleSelectChange" v-model="trainingId" filterable placeholder="请选择练习题">
        <el-option label="全部" :value="null"></el-option>
        <el-option v-for="training in trainings" :key="training.id" :label="training.name" :value="training.id">
        </el-option>
      </el-select>
      <el-select @change="handleSelectChange" v-model="check" filterable placeholder="请选择是否已评分">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="已评分" :value="true"></el-option>
        <el-option label="未评分" :value="false"></el-option>
      </el-select>
    </div>
    <el-table
      :data="list"
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
        label="练习"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="username"
        label="学生"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="className"
        label="班级"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="majorName"
        label="学科"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="完成度"
        prop="completion"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-progress v-if="scope.row.completion" :text-inside="true" :stroke-width="18" :percentage="scope.row.completion*100" status="success"></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        label="分数"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>
            {{scope.row.check ? scope.row.score : '尚未评分'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="完成时间"
        prop="updatedAt"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.updatedAt">{{moment(scope.row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}}</span>
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
      :total="count"
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
      list() {
        return this.$store.state.trainingOfStudent.list;
      },
      count() {
        return this.$store.state.trainingOfStudent.count;
      },
      allClasses() {
        return this.$store.state.classes.list;
      },
      allMajors() {
        return this.$store.state.majors.list;
      },
    },
    data() {
      return {
        moment,
        page: 1,
        limit: 10,
        formLabelWidth: '120px',
        classId: '',
        majorId: '',
        trainingId: '',
        trainings: [],
        check: null,
      }
    },
    created() {
    },
    mounted() {
      this.$store.dispatch('trainingOfStudent/getAll', {offset: (this.page - 1) * this.limit, limit: this.limit});
      this.$store.dispatch('classes/getList');
      this.$store.dispatch('majors/getList');
      this.$store.dispatch('trainings/getAll').then(res => {
        if(res.success) {
          this.trainings = res.data || [];
        }
      });
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.$store.dispatch('trainingOfStudent/getAll', { offset: (val - 1) * this.limit, limit: this.limit, ...this.getQueryData() });
      },
      showTraining(row) {
        let routeUrl = this.$router.resolve({
          path: '/grade/' + row.trainingId,
          query: { userId: row.userId}
        });
        window.open(routeUrl .href, '_blank');
      },
      handleSelectChange() {
        this.page = 1;
        const data = { offset: 0, limit: this.limit, ...this.getQueryData() };
        this.$store.dispatch('trainingOfStudent/getAll', data);
      },
      getQueryData() {
        const data = {};
        if(this.classId) {
          data.classId = this.classId;
        }
        if(this.majorId) {
          data.majorId = this.majorId;
        }
        if(this.trainingId) {
          data.trainingId = this.trainingId;
        }
        if(this.check !== null) {
          data.check = this.check;
        }
        return data;
      }
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

import axios from 'axios';

export default {
  namespaced: true,
  state: {
    list: [],
    count: 0,
  },
  mutations: {
    updateList (state, payload) {
      state.list = payload.rows;
      state.count = payload.count;
    }
  },
  actions: {
    getAll(context, payload) {
      const state = context.state;
      return axios({
        method: 'get',
        url: '/trainings-of-student/all-trainings',
        params: payload
      }).then(res => {
        state.list = res.data.rows;
        state.count = res.data.count;
        // context.commit('updateList', res.data);
        return res;
      });
    },
    //查询某一个学员的成绩
    getTrainingsOfStudent(context, payload) {
      return axios({
        method: 'get',
        url: '/trainings-of-student/of-one',
        params: payload
      }).then(res => {
        return res;
      });
    },
    getAnswer(context, payload) {
      return axios({
        method: 'get',
        url: '/trainings-of-student/get-answer',
        params: payload
      }).then(res => {
        return res;
      });
    },
    finishExam(context, payload) {
      return axios({
        method: 'post',
        url: '/trainings-of-student/finish-exam',
        data: payload
      }).then(res => {
        return res;
      });
    },
    finishGrade(context, payload) {
      return axios({
        method: 'post',
        url: '/trainings-of-student/finish-grade',
        data: payload
      }).then(res => {
        return res;
      });
    }
  }
}
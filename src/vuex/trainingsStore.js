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
    getList(context, payload) {
      const state = context.state;
      return axios({
        method: 'get',
        url: '/trainings',
        params: payload
      }).then(res => {
        state.list = res.data.rows;
        state.count = res.data.count;
        // context.commit('updateList', res.data);
        return res;
      });
    },
    getAll() {
      return axios({
        method: 'get',
        url: '/trainings/all',
      }).then(res => {
        return res;
      });
    },
    getOne(context, payload) {
      return axios({
        method: 'get',
        url: '/trainings/' + payload.id,
      }).then(res => {
        return res;
      });
    },
    create(context, payload) {
      return axios({
        method: 'post',
        url: '/trainings',
        data: payload
      }).then(res => {
        return res;
      });
    },
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/trainings/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/trainings/' + payload.id,
      }).then(res => {
        return res;
      });
    },
    setTraining(context, payload) {
      return axios({
        method: 'post',
        url: '/trainings/set-training',
        data: payload
      }).then(res => {
        return res;
      });
    },
  }
}
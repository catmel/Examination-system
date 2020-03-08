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
        url: '/subjects',
        params: payload
      }).then(res => {
        state.list = res.data.rows;
        state.count = res.data.count;
        // context.commit('updateList', res.data);
        return res;
      });
    },
    create(context, payload) {
      return axios({
        method: 'post',
        url: '/subjects',
        data: payload
      }).then(res => {
        return res;
      });
    },
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/subjects/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/subjects/' + payload.id,
      }).then(res => {
        return res;
      });
    },
  }
}
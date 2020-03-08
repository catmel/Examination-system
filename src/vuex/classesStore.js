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
        url: '/classes',
        params: payload
      }).then(res => {
        // console.log("班级情况",res.data);
        state.list = res.data.rows;
        state.count = res.data.count;
        // context.commit('updateList', res.data);
        return res;
      });
    },
    qrcode(context, payload) {
      return axios({
        method: 'get',
        url: '/qrcode',
        params: payload,
      }).then(res => {
        return res;
      });
    },
    create(context, payload) {
      return axios({
        method: 'post',
        url: '/classes',
        data: payload
      }).then(res => {
        return res;
      });
    },
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/classes/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/classes/' + payload.id,
      }).then(res => {
        return res;
      });
    },
  }
}
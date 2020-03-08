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
        url: '/questions',
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
        url: '/questions',
        data: payload
      }).then(res => {
        return res;
      });
    },
    //上传excal文件
    uploadFile(context, payload) {
      return axios({
        method: 'post',
        url: '/questions/upload-file',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then(res => {
        return res;
      });
    },
    uploadData(context, payload) {
      return axios({
        method: 'post',
        url: '/questions/upload-data',
        data: payload,
      }).then(res => {
        return res;
      });
    },
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/questions/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/questions/' + payload.id,
      }).then(res => {
        return res;
      });
    },
  }
}
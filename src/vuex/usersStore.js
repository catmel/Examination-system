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
        url: '/users',
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
        url: '/users',
        data: payload
      }).then(res => {
        return res;
      });
    },
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/users/' + payload.id,
        data: payload
      }).then(res => {

        return res;
      });
    },
    //修改个人密码
    edit_pwd(context, payload) {
      return axios({
        method: 'put',
        url: '/users/change-pwd/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    //搜索用户
    search_user(context, payload){
      return axios({
        method: 'put',
        url: '/users/search/' + payload.keyword,
        data: payload,
      }).then(res => {
        return res;
      });
    },
    //删除用户
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/users/' + payload.id,
      }).then(res => {
        return res;
      });
    },
     //上传excal学生信息文件
     uploadFile(context, payload) {
      return axios({
        method: 'post',
        url: '/users/upload-file',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then(res => {
        return res;
      });
    },
     //批量导入学生信息
     uploadData(context, payload) {
      return axios({
        method: 'post',
        url: '/users/upload-data',
        data: payload,
      }).then(res => {
        return res;
      });
    },
  }
}
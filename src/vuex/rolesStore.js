import axios from 'axios';
import { getLoginUser } from '../utils/utils';

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
  getters: {
    getRoleName: (state) => (type) => {
      const filter = state.list.filter(role => role.type === type).concat({});
      return filter[0].name;
    },
  },
  actions: {
    //获取列表
    getList(context, payload) {
      const state = context.state;
      return axios({
        method: 'get',
        url: '/roles',
        params: payload
      }).then(res => {
        state.list = res.data.rows;
        state.count = res.data.count;
        // context.commit('updateList', res.data);
        return res;
      });
    },
    //添加
    create(context, payload) {
      return axios({
        method: 'post',
        url: '/roles',
        data: payload
      }).then(res => {
        return res;
      });
    },
    //修改
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/roles/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    //删除
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/roles/' + payload.id,
      }).then(res => {
        return res;
      });
    },
  }
}
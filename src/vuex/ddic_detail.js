import axios from 'axios';




export default {
    namespaced: true,
    state:{
        list:[],
    },
    mutations: {
      updateList (state, payload) {
        state.list = payload.rows;
        state.count = payload.count;
      }
    },
    actions: {
     //获取列表
    getList(context, payload) {
      const state = context.state;
      return axios({
        method: 'get',
        url: '/ddic_detail',
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
        url: '/ddic_detail',
        data: payload
      }).then(res => {
        return res;
      });
    },
    //修改
    edit(context, payload) {
      console.log("修改数据",payload);
      return axios({
        method: 'put',
        url: '/ddic_detail/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    //删除
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/ddic_detail/' + payload.id,
      }).then(res => {
        return res;
      });
    },
  }
}
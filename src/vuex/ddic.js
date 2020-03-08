import axios from 'axios';

export default {
    namespaced: true,
    state:{
        list:[],
    },
    mutations: {
      updateList (state, payload) {
        state.list = payload.rows;
      }
    },
    actions: {
       //获取列表
      getList(context, payload) {
        const state = context.state;
        return axios({
          method: 'get',
          url: '/ddic',
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
          url: '/ddic',
          data: payload
        }).then(res => {
          return res;
        });
      },
      //修改
      edit(context, payload) {
        return axios({
          method: 'put',
          url: '/ddic/' + payload.id,
          data: payload
        }).then(res => {
          return res;
        });
      },
      //删除
      remove(context, payload) {
        return axios({
          method: 'delete',
          url: '/ddic/' + payload.id,
        }).then(res => {
          return res;
        });
      },
    },
    getters: {
      getDetails: (state) => (key, value) => {
        const filterArr = state.list.filter(item => item[key] === value);
        if(filterArr.length > 0) {
          return filterArr[0].detail;
        } else {
          return [];
        }
      }
    }
}
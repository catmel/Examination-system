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
    // 过滤学科的，只显示当前用户的学科科目
    getMajorsForTree: state => {
      const majors = [];
      state.list.map((item, index) => {
        const { id: majorId, name:label, subjects = [] } = item;
        if(getLoginUser('majorId') === majorId)
          majors.push({
          label,
          index,
          majorId,
          children: subjects.map((subject, subjectIndex) => {
            const { id: subjectId, name:subjectLabel } = subject;
            return {
              label: subjectLabel,
              index: `${index}-${subjectIndex}`,
              majorId,
              subjectId
            }
          }),
        });
        return null;
      });
      return majors;
    }
  },
  actions: {
    //获取列表
    getList(context, payload) {
      const state = context.state;
      return axios({
        method: 'get',
        url: '/majors',
        params: payload
      }).then(res => {
        // console.log("学科信息",res.data)
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
        url: '/majors',
        data: payload
      }).then(res => {
        return res;
      });
    },
    //修改
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/majors/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    //删除
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/majors/' + payload.id,
      }).then(res => {
        return res;
      });
    },
  }
}
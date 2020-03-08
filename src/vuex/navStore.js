import axios from 'axios';

export default {
    namespaced: true,
    state:{
        list:[],
        monilist:[
          {
            "id": 1,
            "name": "userManage",
            "icon": "iconfont icon-renyuanguanli1",
            "title": "用户管理",
            "value": "",
            "discription": "用于用户管理的菜单",
            "disabled":false,
            "childs":[
              {
                "id": 1,
                "name": "taecherManage",
                "icon": "iconfont icon-renyuanguanli1",
                "title": "教师管理",
                "value": "/homepage/teachers",
                "discription": "用于用户管理的菜单",
                "disabled":false,
                 "childs":null
              },
              {
                "id": 2,
                "name": "studentManage",
                "icon": "iconfont icon-renyuanguanli1",
                "title": "学生管理",
                "value": "/homepage/students",
                "discription": "用于用户管理的菜单",
                "disabled":false,
                "childs":null
              }
            ]
          },
          {
            "id": 2,
            "name": "subject",
            "icon": "iconfont icon-renyuanguanli1",
            "title": "学科科目",
            "value": "",
            "discription": "用于学科科目管理的菜单",
            "disabled":false,
            "childs":[
              {
                "id": 3,
                "name": "majorManage",
                "icon": "iconfont icon-xuekeguanli1",
                "title": "学科管理",
                "value": "/homepage/majors",
                "discription": "用于学科管理的菜单",
                "disabled":false,
                "childs":null
              },
              {
                "id": 4,
                "name": "subjectManage",
                "icon": "iconfont icon-xuekeguanli1",
                "title": "科目管理",
                "value": "/homepage/subjects",
                "discription": "用于学科管理的菜单",
                "disabled":false,
                "childs":null
              }
            ]
          },
          {
            "id": 3,
            "name": "classManage",
            "icon": "iconfont icon-banjiguanli1",
            "title": "班级管理",
            "value": "/homepage/classes",
            "discription": "用于班级管理的菜单",
            "disabled":false,
            "childs":null
          },
          {
            "id": 4,
            "name": "questionManage",
            "icon": "iconfont icon-banjiguanli1",
            "title": "题库管理",
            "value": "/homepage/questions",
            "discription": "用于题库管理的菜单",
            "disabled":false,
            "childs":null
          },
          {
            "id": 5,
            "name": "system",
            "icon": "el-icon-setting",
            "title": "系统管理",
            "value": "/homepage/system",
            "discription": "用于题库管理的菜单",
            "disabled":false,
            "childs":null
          }
        ]
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
        url: '/nav',
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
        url: '/nav',
        data: payload
      }).then(res => {
        return res;
      });
    },
    //修改
    edit(context, payload) {
      return axios({
        method: 'put',
        url: '/nav/' + payload.id,
        data: payload
      }).then(res => {
        return res;
      });
    },
    //删除
    remove(context, payload) {
      return axios({
        method: 'delete',
        url: '/nav/' + payload.id,
      }).then(res => {
        return res;
      });
    },
  }
}
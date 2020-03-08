import Vue from 'vue';
import vuex from 'vuex';
import 'es6-promise/auto'

Vue.use(vuex);

//由于状态过多不好维护,所以将所有状态一直别的js文件夹中,然后加载进来
import commonStore from './commonStore.js';
import testStore from './testStore.js';
import usersStore from './usersStore.js';
import majorsStore from './majorsStore.js';
import subjectsStore from './subjectsStore.js';
import classesStore from './classesStore.js';
import questionsStore from './questionsStore.js';
//引入菜单vuex
import navStore from './navStore.js';
//引入数据字典vuex
import ddicStore from './ddic.js';
//引入细目
import ddicDetailStore from './ddic_detail.js';
import trainingsStore from './trainingsStore';
import rolesStore from './rolesStore';
import trainingOfStudentStore from './trainingOfStudentStore';

export default new vuex.Store({
    //modules将数据模块化,将数据分开放入vuex,便于以后维护
    modules:{
      test:testStore,
      common: commonStore,
      // other:other   //其他的模块数据引入可以写在这里
      users: usersStore,
      majors: majorsStore,
      subjects: subjectsStore,
      classes: classesStore,
      questions: questionsStore,
      nav: navStore,
      ddic:ddicStore,
      ddic_detail:ddicDetailStore,
      trainings: trainingsStore,
      roles: rolesStore,
      trainingOfStudent: trainingOfStudentStore,
    }
})

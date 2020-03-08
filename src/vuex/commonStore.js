export default {
  namespaced: true,
  state: {
    loading: false,
    error: false,
    lastTime: 0,
    errorMessage: '',
  },
  mutations: {
    loading (state, payload) {
      state.loading = payload;
    },
    handleError (state, payload) {
      const time = new Date().getTime();
      state.loading = false;
      if(time - state.lastTime > 1000) { // 两次提示的间隔时间最少为1000毫秒，防止短时间内重复提示错误信息
        state.error = !state.error;
        state.errorMessage = payload;
      }
      state.lastTime = time;
    },
  },
  actions: {
  }
}
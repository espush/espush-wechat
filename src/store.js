import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    appinfo: {
      key: '',
      password: '',
    }
  },
  mutations: {
    set_appinfo: (state, payload) => {
      let appinfo = state.appinfo;
      appinfo.key = payload.key;
      appinfo.password = payload.password;
    },
    reset_appinfo: (state) => {
      let appinfo = state.appinfo;
      appinfo.key = "";
      appinfo.password = "";
    }
  }
});

export default store;
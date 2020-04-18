import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: {
      uid: "",
      displayName: "",
      email: "",
      dpURL: "",
    },
    accessToken: {},
    reRender: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user.uid = payload.uid;
      state.user.displayName = payload.displayName;
      state.user.email = payload.email;
      state.user.dpURL = payload.photoURL;
    },
    setToken(state, payload) {
      state.accessToken = payload.token;
    },
    setReRender(state, payload) {
      state.reRender = payload;
    },
  },
  actions: {},
  getters: {
    loggedUser: (state) => {
      return state.user;
    },
    token: (state) => {
      return state.token;
    },
    reRender: (state) => {
      return state.reRender;
    }
  },
});

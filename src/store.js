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
    accessToken: null,
    loginState: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user.uid = payload.uid;
      state.user.displayName = payload.displayName;
      state.user.email = payload.email;
      state.user.dpURL = payload.photoURL;
    },
    setToken(state, payload) {
      state.accessToken = payload;
    },
    setLoginState(state, payload) {
      state.loginState = payload;
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
    loginState: (state) => {
      return state.loginState;
    }
  },
});

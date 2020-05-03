import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";
import VueRouter from "vue-router";

Vue.use(VueRouter);
Vue.config.productionTip = false;

import landing from "./components/landing.vue";
import content from "./components/content.vue";
import store from './store'

// Initialize Firebase
var firebaseConfig = {
  apiKey: "#",
  authDomain: "#",
  databaseURL: "#",
  projectId: "#",
  storageBucket: "#",
  messagingSenderId: "#",
  appId: "#",
  measurementId: "#",
};
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

// Initialize Router
const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes: [
    { path: "/", component: landing },
    { path: "/content", component: content },
  ],
});

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");

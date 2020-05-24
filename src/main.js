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
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID,
  measurementId: process.env.VUE_APP_MEASUREMENTID
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

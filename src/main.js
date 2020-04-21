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
  apiKey: "AIzaSyAedQbLk6KQ6sikIc9X6MDc434ZVVN9JI0",
  authDomain: "web-cbir.firebaseapp.com",
  databaseURL: "https://web-cbir.firebaseio.com",
  projectId: "web-cbir",
  storageBucket: "web-cbir.appspot.com",
  messagingSenderId: "1020574597102",
  appId: "1:1020574597102:web:5cf4569de3da93c7c118ff",
  measurementId: "G-55RES0W6ZW",
};
firebase.initializeApp(firebaseConfig);


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

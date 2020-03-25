import Vue from 'vue';
import App from './App.vue';
import firebase from 'firebase';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';

var firebaseui = require('firebaseui');

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyAedQbLk6KQ6sikIc9X6MDc434ZVVN9JI0",
  authDomain: "web-cbir.firebaseapp.com",
  databaseURL: "https://web-cbir.firebaseio.com",
  projectId: "web-cbir",
  storageBucket: "web-cbir.appspot.com",
  messagingSenderId: "1020574597102",
  appId: "1:1020574597102:web:5cf4569de3da93c7c118ff",
  measurementId: "G-55RES0W6ZW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var ui = new firebaseui.auth.AuthUI(firebase.auth());

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

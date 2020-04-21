<template>
  <v-app id="inspire">
    <v-content>
      <!--App Bar-->
      <v-app-bar app color="#424242" dark>
        <v-toolbar-title>Web CBIR</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <img
        alt="Vue logo"
        style="margin-top: -65px; padding-bottom: 25px;"
        height="250"
        width="250"
        src="../assets/logo.png"
      />
      <h1>Welcome to CBIR Web</h1>
      <p>The system uses Content Based Image Recognition to analyze an image and predict it's content without use of any metadata.</p>
      <h3>Login to Continue to the App</h3>
      <ul>
        <li>
          <router-link color="primary" to="/content">
            <v-btn color="primary">
              Continue to App
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </router-link>
        </li>
      </ul>
    </v-content>
  </v-app>
</template>

<script>
import store from "../store";
export default {
  data() {
    return {
      loggedIn: store.getters.loginState
    };
  }
};
</script>

<style scoped>
#inspire {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
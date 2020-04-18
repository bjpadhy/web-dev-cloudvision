<template>
  <div id="app">
    <v-app>
      <v-content>
        <!--App Bar-->
        <v-app-bar app color="#424242" dark>
          <v-toolbar-title>Web CBIR</v-toolbar-title>

          <v-spacer></v-spacer>
          <router-link v-if="loggedIn" to="/logout">
            <v-btn color="#616161">
              <span class="mr-2" id="userlog">Logout</span>
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </router-link>
        </v-app-bar>

        <!--Router View-->
        <template v-if="$route.matched.length">
          <router-view></router-view>
        </template>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import auth from "./auth";

export default {
  name: "App",
  data() {
    return {
      loggedIn: auth.loggedIn()
    };
  },
  created() {
    auth.onChange = loggedIn => {
      this.loggedIn = loggedIn;
    };
  }
};
</script>

<style scoped>
#app {
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
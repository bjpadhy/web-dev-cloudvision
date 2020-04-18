<template>
  <v-app id="inspire">
    <v-content>
    <img alt="Vue logo" style="margin-top: -65px; padding-bottom: 25px;" height="250" width="250" src="../assets/logo.png">
      <h1>Welcome to CBIR Web</h1>
      <p>The system uses Content Based Image Recognition to analyze an image and predict it's content without use of any metadata.</p>
      <h3>Login to Continue to the App</h3>
      <ul>
        <li>
          <router-link color="primary" v-if="loggedIn" to="/content">
            <v-btn color="primary">
              Continue to App
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </router-link>
          <router-link color="primary" v-if="!loggedIn" to="/login">
          <br/>
          <v-btn color="primary">
            Login
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          </router-link>
        </li>
      </ul>
    </v-content>
  </v-app>
</template>

<script>
import auth from "../auth";

export default {
  data() {
    return {
      loggedIn: auth.loggedIn(),
      error: false,
    };
  },
  created() {
    auth.onChange = loggedIn => {
      this.loggedIn = loggedIn;
    };
  },
  methods: {
    login() {
      auth.login(loggedIn => {
        if (!loggedIn) {
          this.error = true;
        } else {
          this.$router.push("/content");
        }
      });
    }
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
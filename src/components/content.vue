<template>
<!--Page Content-->
  <div id="app">
    <!--App Bar-->
    <v-app-bar app color="#424242" dark>
      <v-toolbar-title>Web CBIR</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="#616161" @click="logIn">
        <span class="mr-2">Sign In</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <!--Main Content-->
    <v-app id="inspire">
      <v-content>
        <!--Upload and Preview-->
        <v-container fluid>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-text-field
                label="Select Image"
                @click="pickFile"
                v-model="imageName"
                prepend-icon="mdi-paperclip"
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="previewImage"
              />

              <v-btn color="primary" @click="onUpload">Upload</v-btn>
            </v-flex>
          </v-layout>

          <br/>

          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-progress-linear
                id="progress"
                :value="uploadValue"
                max="100"
                style="min-height: 4px; display: none"
              ></v-progress-linear>
            </v-flex>
          </v-layout>
          <v-layout align-left>
            <div v-if="imageData!=null">
              <img :src="picture" height="500" v-if="imageData" />
            </div>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
/* eslint-disable */
import firebase from "firebase";

export default {
  name: "pagecontent",

  // Component Data
  data() {
    return {
      imageData: null,
      imageName: "",
      picture: null,
      uploadValue: 0
    };
  },

  // Component Methods
  methods: {

    // Firebase Login methods.
    logIn() {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function() {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.

          return firebase
            .auth()
            .signInWithPopup(provider)
            .then(function(result) {
              // This gives you a Google Access Token. You can use it to access the Google API.
              var token = result.credential.accessToken;
              // The signed-in user info.
              //var user = result.user;
              var user = firebase.auth().currentUser;
              // ...
              if (user != null) {
                this.user.providerData.forEach(function(profile) {
                  console.log("Sign-in provider: " + profile.providerId);
                  console.log("  Provider-specific UID: " + profile.uid);
                  console.log("  Name: " + profile.displayName);
                  console.log("  Email: " + profile.email);
                  console.log("  Photo URL: " + profile.photoURL);
                });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
            });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(`${errorCode}` + `${errorMessage}`);
        });
    },

    // Image preview on upload
    previewImage(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event.target.files[0];
      this.imageName = this.imageData.name;
    },

    // Set filename in TextBox
    pickFile() {
      this.$refs.image.click();
    },

    // Upload image to Firestore
    onUpload() {
      var x = document.getElementById("progress");
      if (x.style.display === "none") {
        x.style.display = "block";
      }
      this.picture = null;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        snapshot => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.picture = url;
          });
          x.style.display = none;
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

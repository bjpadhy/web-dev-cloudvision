<template>
  <!--Page Content-->
  <div id="app">
    <!--App Bar-->
    <v-app-bar app color="#424242" dark>
      <v-toolbar-title>Web CBIR</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="#616161" @click="logIn">
        <span class="mr-2" id="userlog"></span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <!--Main Content-->
    <v-app id="inspire">
      <v-content>
        <!--Upload and Preview-->
        <v-container fluid>
          <!--Input Field-->
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

          <br />
          <!--Progress Bar-->
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
          <!--Image Preview-->
          <v-layout align-left>
            <div v-if="picture != null">
              <img :src="picture" height="500" />
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
var uid,
  displayName,
  email,
  photoURL,
  isAnonymous,
  emailVerified,
  providerData,
  providerId;
export default {
  name: "pagecontent",

  // Component Data
  data() {
    return {
      imageData: null,
      imageName: "",
      picture: null,
      uploadValue: 0,
      displayName: "",
      email: "",
      photoURL: ""
    };
  },
  // Initialize login on page load.
  created: function() {
    this.initApp();
  },

  // Component Methods
  methods: {
    // Firebase Login methods.
    logIn() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
          .then(function() {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.

            return firebase
              .auth()
              .signInWithPopup(provider)
              .then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
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
      } else {
        firebase.auth().signOut();
      }
    },

    initApp() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          displayName = user.displayName;
          email = user.email;
          emailVerified = user.emailVerified;
          photoURL = user.photoURL;
          isAnonymous = user.isAnonymous;
          uid = user.uid;
          providerData = user.providerData;
          providerId = user.providerId;
          document.getElementById("userlog").textContent = "Sign Out";
          console.log("User Signed in.");
        } else {
          // User is signed out.
          console.log("User Signed out.");
          document.getElementById("userlog").textContent = "Sign In";
        }
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
      var progressBar = document.getElementById("progress");
      if (progressBar.style.display === "none") {
        progressBar.style.display = "block";
      }

      var storageRef = firebase.storage().ref();
      // Image file
      var file = this.imageData;
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child(`${uid}` + "/" + file.name).put(file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        function(error) {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("User doesn't have permission to access the object");
              break;
            case "storage/unknown":
              console.log(
                "Unknown error occurred, inspect error.serverResponse"
              );
              break;
          }
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            this.picture = downloadURL;
            progressBar.style.display = none;
          });
        }
      );

      /*  
      const path = "user/"+`${uid}`;
      console.log(uid);
      const storageRef = firebase
        .storage()
        .ref(path+`${this.imageData.name}`)
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
          
        }
      );*/
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

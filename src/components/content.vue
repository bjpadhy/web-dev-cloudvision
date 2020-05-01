<template>
  <!--Page Content-->
  <!--Main Content-->
  <v-app id="inspire">
    <v-content>
      <!--App Bar-->
      <v-app-bar app color="#424242" dark>
        <v-toolbar-title>Web CBIR</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu
          v-model="menu"
          bottom
          right
          transition="scale-transition"
          origin="top left"
        >
          <template v-slot:activator="{ on }">
            <v-chip color="error" label v-on="on">
              <v-avatar left>
                <v-img :src="displayPhotoURL"></v-img>
              </v-avatar>
              {{ displayName }}
            </v-chip>
          </template>
          <v-card width="300">
            <v-list dark>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="displayPhotoURL"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ displayName }}</v-list-item-title>
                  <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="alert = !alert">
                <v-list-item-title>Clear Search History</v-list-item-title>
              </v-list-item>
              <router-link to="/">
                <v-list-item @click="() => {}">
                  <v-list-item-title>About</v-list-item-title>
                </v-list-item>
              </router-link>
              <v-list-item @click="login">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-dialog v-model="alert" light style="max-height:10px;">
          <v-card>
            <v-alert prominent type="error">
              <v-row align="center">
                <v-col class="grow"
                  >Attention! Clearing the search history will also clear any
                  data stored on the database. Do you want to continue?</v-col
                >
                <v-col class="shrink">
                  <v-btn outlined>Confirm</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-card>
        </v-dialog>
      </v-app-bar>
      <!--Main Content-->
      <v-container fluid>
        <!--Login Dialog-->
        <v-row justify="center">
          <v-dialog v-model="loginDialog" persistent max-width="290">
            <v-card>
              <v-card-title class="headline">Login via Google</v-card-title>
              <v-card-text
                >The App stores uploaded images to in an authenticated user
                accessible storage bucket. This ensures user privacy. Please
                login via google to continue</v-card-text
              >
              <v-card-actions style="padding-bottom:25px;">
                <v-btn
                  style="margin-left:auto;margin-right:auto;"
                  outlined
                  color="blue darken-1"
                  text
                  @click="login"
                  >Login with Google&nbsp;<v-icon>mdi-google</v-icon></v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <!--Input Field-->
        <h3>Upload an Image from device to predict</h3>
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
              @change="fileHandling"
            />
            <v-btn
              type="submit"
              color="primary"
              style="font-family: Avenir, Helvetica, Arial, sans-serif;"
              :disabled="dialog"
              :loading="dialog"
              @click="onUpload"
              >Predict</v-btn
            >
            <br />
            <br />
            <br />
          </v-flex>
        </v-layout>

        <!--Progress Bar-->
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-dialog v-model="dialog" hide-overlay persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Running Prediction
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <!--Output-->
        <div class="result">
          <v-layout>
            <br />
            <br />
            <!--Image Preview-->
            <div v-show="previewSrc" class="previewImg">
              <h3 style="padding-top:35px;">Image preview:</h3>
              <img
                id="picture"
                style="padding-top:10px;"
                height="500"
                width="550"
              />
            </div>
            <!--Prediction Result-->
            <div
              class="predictTags"
              style="padding:35px; max-height:500px;"
              v-show="tagFetch"
            >
              <h3 style="padding-bottom:10px;margin-left:-15px;">
                Prediction result:
              </h3>
              <v-card
                class="mx-auto"
                max-width="750"
                style="padding-left:10px;"
              >
                <v-list two-line subheader column>
                  <v-subheader
                    style="font-family: Avenir, Helvetica, Arial, sans-serif;"
                    >Web Detection</v-subheader
                  >
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title
                        style="font-family: Avenir, Helvetica, Arial, sans-serif; font-weight: bold;"
                        >Label:</v-list-item-title
                      >
                      <v-list-item-subtitle
                        style="font-family: Avenir, Helvetica, Arial, sans-serif;text-transform: capitalize;"
                        >{{ prediction.bestGuessLabels }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title
                        style="font-family: Avenir, Helvetica, Arial, sans-serif; font-weight: bold;"
                        >Web Entity:</v-list-item-title
                      >
                      <v-list-item-subtitle
                        style="font-family: Avenir, Helvetica, Arial, sans-serif;text-transform: capitalize;"
                        >Description:
                        {{
                          prediction.webEntities.description
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle
                        style="font-family: Avenir, Helvetica, Arial, sans-serif;"
                        >Score:
                        {{ prediction.webEntities.score }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-title
                        style="font-family: Avenir, Helvetica, Arial, sans-serif; font-weight: bold;"
                        >Pages with Matching Images:</v-list-item-title
                      >
                      <v-list-item-subtitle
                        style="font-family: Avenir, Helvetica, Arial, sans-serif;text-transform: capitalize;"
                        >Page Title:
                        {{
                          prediction.pagesWithMatchingImages.pageTitle
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle
                        style="font-family: Avenir, Helvetica, Arial, sans-serif;"
                      >
                        <a target="_blank">{{
                          prediction.pagesWithMatchingImages.url
                        }}</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title
                        style="font-family: Avenir, Helvetica, Arial, sans-serif; font-weight: bold;"
                        >Partially Matching Images:</v-list-item-title
                      >
                      <v-list-item-subtitle
                        style="font-family: Avenir, Helvetica, Arial, sans-serif;"
                        >{{
                          prediction.partialMatchingImages
                        }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title
                        style="font-family: Avenir, Helvetica, Arial, sans-serif; font-weight: bold;"
                        >Visually Matching Images:</v-list-item-title
                      >
                      <v-list-item-subtitle
                        style="font-family: Avenir, Helvetica, Arial, sans-serif;"
                      >
                        <a target="_blank">{{
                          prediction.visuallySimilarImages
                        }}</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </div>
          </v-layout>
        </div>
        <!--History-->
        <h2 style="padding:10px;margin-left:15px;float:left">
          History
        </h2>
        <v-layout align-center justify-center style="margin-top:45px;">
          <v-item-group active-class="primary">
            <v-container>
              <v-row>
                <v-col v-for="n in gridURL" :key="n" cols="12" md="3">
                  <v-hover>
                    <template v-slot:default="{ hover }">
                      <v-card class="d-flex align-center">
                        <v-item hover>
                          <v-img :src="n" height="150" />
                        </v-item>
                        <v-fade-transition>
                          <v-overlay v-if="hover" absolute color="#036358">
                            <v-btn @click="historyView(n)">Predict</v-btn>
                          </v-overlay>
                        </v-fade-transition>
                      </v-card>
                    </template>
                  </v-hover>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable */
import firebase from "firebase";
import store from "../store";
import { db } from "../main";

//TODO Change data credentials to fetch from getters directly

const user = store.getters.loggedUser;
var loginState = store.getters.loginState;
var token, imgURL;

export default {
  name: "pagecontent",
  // Component Data
  data() {
    return {
      menu: false,
      alert: false,
      loggedIn: loginState,
      loginDialog: !loginState,
      overlay: false,
      previewSrc: false,
      imageData: null,
      imageName: "",
      uploadValue: 0,
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      displayPhotoURL: user.dpURL,
      dialog: false,
      tagFetch: false,
      prediction: {
        bestGuessLabels: "-",
        webEntities: {
          description: "-",
          score: 0,
        },
        visuallySimilarImages: "-",
        partialMatchingImages: "-",
        pagesWithMatchingImages: {
          pageTitle: "-",
          url: "-",
        },
      },
      model: 1,
      gridURL: [],
      historyPredict: [],
    };
  },

  created() {
    this.initAuth();
  },

  // Component Methods
  methods: {
    // Set login state
    initAuth() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in
          store.commit("setUser", user);
          store.commit("setLoginState", true);
          this.loginDialog = false;
          console.log("User Signed in.");
          // Get Snapshot from Firestore
          db.collection("users")
            .doc(`${this.uid}`)
            .onSnapshot((doc) => {
              let gridData = [];
              let predictData = [];
              this.gridURL = [];
              this.historyPredict = [];
              gridData = doc.data().url;
              predictData = doc.data().predictions;
              gridData.forEach((element) => {
                this.gridURL.push(element);
              });
              predictData.forEach((element) => {
                this.historyPredict.push(element);
              });
            });
        } else {
          // User is signed out
          this.loginDialog = true;
          console.log("User Signed out.");
        }
      });
    },

    // Show previously searched images and prediction data fetched from Firestore
    historyView(n) {
      this.tagFetch = false;
      this.clearField();
      document.getElementById("picture").src = n;
      this.prediction = this.historyPredict[
        this.gridURL.findIndex((element) => element === n)
      ];
      this.tagFetch = true;
    },

    // Google sign-in
    login() {
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
                token = result.credential.accessToken;
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
        store.commit("setLoginState", false);
      }
    },

    // File Handling on upload
    fileHandling(event) {
      this.tagFetch = false;
      this.clearField();
      this.uploadValue = 0;
      this.imageData = event.target.files[0];
      this.imageName = this.imageData.name;
      var reader = new FileReader();
      reader.readAsDataURL(this.imageData);
      this.previewSrc = true;
      reader.onloadend = function() {
        // Output Image fetched locally
        document.getElementById("picture").src = reader.result;
      };
    },

    // Set filename in TextBox
    pickFile() {
      this.$refs.image.click();
    },

    clearField() {
      this.previewSrc = "";
      this.prediction.bestGuessLabels = "-";
      this.prediction.webEntities.description = "-";
      this.prediction.webEntities.score = 0;
      this.prediction.pagesWithMatchingImages.pageTitle = "-";
      this.prediction.pagesWithMatchingImages.url = "-";
      this.prediction.partialMatchingImages = "-";
      this.prediction.visuallySimilarImages = "-";
    },

    // Make prediction call for uploaded image
    async predict() {
      let requests = {
        requests: [
          {
            image: {
              source: {
                imageUri: `${imgURL}`,
              },
            },
            features: [
              {
                type: "WEB_DETECTION",
                maxResults: 1,
              },
            ],
          },
        ],
      };

      try {
        let response = await fetch(
          "https://vision.googleapis.com/v1/images:annotate?prettyPrint=true&alt=json&key=AIzaSyCJfkjRZ9m-uKwGsI60RPRn9itHRXCTfiM",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Accept: "application/json",
            },
            body: JSON.stringify(requests),
          }
        );
        let responses = await response.json();
        this.prediction.bestGuessLabels =
          responses.responses[0].webDetection.bestGuessLabels[0].label;
        this.prediction.webEntities.description =
          responses.responses[0].webDetection.webEntities[0].description;
        this.prediction.webEntities.score =
          responses.responses[0].webDetection.webEntities[0].score;
        this.prediction.pagesWithMatchingImages.pageTitle =
          responses.responses[0].webDetection.pagesWithMatchingImages[0].pageTitle;
        this.prediction.pagesWithMatchingImages.url =
          responses.responses[0].webDetection.pagesWithMatchingImages[0].url;
        this.prediction.partialMatchingImages =
          responses.responses[0].webDetection.partialMatchingImages[0].url;
        this.prediction.visuallySimilarImages =
          responses.responses[0].webDetection.visuallySimilarImages[0].url;
      } catch (error) {
        console.log("Error in prediction: " + error);
      }
      //console.log(responses);
      console.log(this.prediction);
      this.tagFetch = true;
      this.dialog = false;
      this.writeFirestore();
    },

    // Write prediciton data and image URL to firestore
    writeFirestore() {
      var userRef = db.collection("users").doc(`${this.uid}`);
      // Write to firestore for existing user
      userRef
        .update({
          url: firebase.firestore.FieldValue.arrayUnion(imgURL),
          predictions: firebase.firestore.FieldValue.arrayUnion(
            this.prediction
          ),
        })
        .then(() => {
          console.log("Data successfully written to Firestore");
        })
        .catch((error) => {
          // Handle non existent user
          if (error.code == "not-found") {
            var docData = {
              url: [imgURL],
              predictions: [this.prediction],
            };
            userRef
              .set(docData)
              .then(() => {
                console.log("User created and data written successfully");
              })
              .catch((error) => {
                console.log("User creation error");
              });
          }
          // Log any other error
          else {
            console.log("Firestore error code: " + error.code);
            console.log("Error message: " + error.message);
          }
        });
    },

    // Upload image to cloud storage
    onUpload() {
      const uid = this.uid;
      var storageRef = firebase.storage().ref();
      // Image file
      var file = this.imageData;
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child(`${uid}` + "/" + file.name).put(file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.dialog = true;
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
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
            imgURL = downloadURL;
            this.predict();
          });
        }
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h3 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-weight: normal;
}

h2 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-weight: normal;
}

.result {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.result div {
  text-align: left;
  font-family: arial, sans-serif;
}

.result .predictTags {
  padding-left: 15px;
  padding-bottom: 15px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-weight: normal;
}
</style>

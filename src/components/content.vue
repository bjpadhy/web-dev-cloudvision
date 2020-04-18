<template>
  <!--Page Content-->
  <!--Main Content-->
  <v-app id="inspire">
    <v-content>
      <!--Upload and Preview-->
      <v-container fluid>
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
            <!-- <v-file-input
                chips
                show-size
                counter
                label="Select Image"
                prepend-icon="mdi-camera"
                style="font-family: Avenir, Helvetica, Arial, sans-serif;"
                type="file"
                id="image"
                name="image"
                ref="image"
                accept="image/*"
                @change="fileHandling"
            />-->
            <v-btn
              type="submit"
              color="primary"
              style="font-family: Avenir, Helvetica, Arial, sans-serif;"
              :disabled="dialog"
              :loading="dialog"
              @click="onUpload"
            >Upload</v-btn>
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
                  Uploading
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
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
            <div class="previewImg">
              <h3 style="padding-top:35px;">Image preview:</h3>
              <img id="picture" style="padding-top:10px;" height="500" width="650" />
            </div>
            <div class="predictTags" style="padding:35px; max-height:500px;" v-show="tagFetch">
              <h3 style="padding-bottom:10px;margin-left:-15px;">Prediction result:</h3>
              <v-card class="mx-auto" min-width="200" style="padding-left:10px;">
                <v-list two-line subheader column>
                  <v-subheader style="font-family: Avenir, Helvetica, Arial, sans-serif;">Tags</v-subheader>

                  <v-list-item>
                    <v-row>
                      <v-col v-for="item in items" :key="item.id" cols="12" md="3">
                        <v-list-item-content>
                          <v-list-item-title
                            style="font-family: Avenir, Helvetica, Arial, sans-serif; font-weight: bold; text-transform: capitalize"
                          >{{ item.name }}</v-list-item-title>
                          <v-list-item-subtitle
                            style="font-family: Avenir, Helvetica, Arial, sans-serif;"
                          >Confidence: {{ item.value }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>
            </div>
          </v-layout>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable */
import firebase from "firebase";
import clarifai from "clarifai";
import Vue from "vue";
import auth from "../auth";
import store from "../store";
Vue.forceUpdate();

const user = store.getters.loggedUser;
const token = auth.getToken;
const reRenderFlag = store.getters.reRender;

var results = [];
const clarifaiapp = new clarifai.App({
  apiKey: "aee327ef51054a36a98e51e8abddce5e"
});

export default {
  name: "pagecontent",
  mounted: () => {
      if (!reRenderFlag) {
        store.commit("setReRender", "true");
        this.$forceUpdate();
      }
    },
  // Component Data
  data() {
    return {
      imageData: null,
      imageName: "",
      uploadValue: 0,
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      displayPhotoURL: user.dpURL,
      dialog: false,
      dialogLogin: true,
      tagFetch: false,
      alert: false,
      items: [],
      model: 1,
      renderComponent: false
    };
  },

  // Component Methods
  methods: {
    // File Handling on upload
    fileHandling(event) {
      console.log(event);
      this.uploadValue = 0;
      this.imageData = event.target.files[0];
      this.imageName = this.imageData.name;
      var reader = new FileReader();
      reader.readAsDataURL(this.imageData);
      reader.onloadend = function() {
        // Output Image fetched locally
        document.getElementById("picture").src = reader.result;
      };
    },

    // Set filename in TextBox
    pickFile() {
      this.$refs.image.click();
    },

    // Upload image to Firestore and run prediction API call
    onUpload() {
      const uid = this.uid;
      console.log(uid);
      var storageRef = firebase.storage().ref();
      // Image file
      console.log(this.imageData);
      var file = this.imageData;
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child(`${uid}` + "/" + file.name).put(file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        snapshot => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.dialog = true;
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (this.uploadValue === 100) {
            this.dialog = false;
          }
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
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log("File available at", downloadURL);
            clarifaiapp.models
              .predict(Clarifai.GENERAL_MODEL, `${downloadURL}`, {
                minValue: 0.8
              })
              .then(response => {
                this.items = [];
                var i = 0;
                let looper = response["outputs"][0]["data"]["concepts"];
                for (i = 0; i < looper.length; i++) {
                  results.push(looper[i]);
                }
              })
              .catch(error => {
                console.log(error);
              });
          });
        }
      );
      this.items = results;
      this.tagFetch = true;
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

h3 {
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

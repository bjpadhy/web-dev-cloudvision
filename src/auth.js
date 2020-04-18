/* globals localStorage */
import firebase from "firebase";
import store from './store'
export default {
  login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    if (!firebase.auth().currentUser) {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.

          return firebase
            .auth()
            .signInWithPopup(provider)
            .then( result => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              var token = result.credential.accessToken;
              store.commit('setToken',token);
              localStorage.token = token;
              this.onChange(true);
              // The signed-in user info.
            })
            .catch( error => {
              // Handle Errors here.
              this.onChange(false);
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // eslint-disable-next-line
              console.log(
                "Code: " +
                  `${errorCode}` +
                  " Message: " +
                  `${errorMessage}` +
                  " Email: " +
                  `${email}` +
                  " Credential type: " +
                  `${credential}`
              );
            });
        })
        .catch( error => {
          this.onChange(false);
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // eslint-disable-next-line
          console.log(`${errorCode}` + `${errorMessage}`);
        });
    }
      firebase.auth().onAuthStateChanged( user => {
        if (user) {
          store.commit('setUser',user);
          this.onChange = true;
          return;
        } else {
          // User is signed out.
          // eslint-disable-next-line
          console.log("User Signed out.");
        }
      });
  },

  getToken() {
    return localStorage.token;
  },

  logout() {
    delete localStorage.token;
    firebase.auth().signOut();
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.token;
  },

  onChange() {},
};

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    drawer: null,
    items: [
      { icon: 'settings', text: 'Settings' },
      { icon: 'chat_bubble', text: 'API' },
      { icon: 'info', text: 'About' },
    ],
    tags: [
    ],
  }),
  methods: {
    generate: function (event) {
      const app = new Clarifai.App({apiKey: 'aee327ef51054a36a98e51e8abddce5e'});
      app.workflow.predict('{workflow-1}', "https://samples.clarifai.com/metro-north.jpg").then(
        response => {console.log(response);}).catch(
                err => {console.log(err);});

    }
  }
})
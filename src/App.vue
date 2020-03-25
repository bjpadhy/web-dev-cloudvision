<template>
  <v-app>
    <v-content>
      <upload/>
    </v-content>
  </v-app>
</template>

<script>
import Upload from './components/Upload.vue';

export default {
  name: 'App',

  components: {
    Upload,
  },

  data: () => ({
    //
  }),
};
</script>

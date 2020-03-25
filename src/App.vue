<template>
  <v-app>
    <v-content>
      <pagecontent/>
    </v-content>
  </v-app>
</template>

<script>
import pagecontent from './components/content.vue';

export default {
  name: 'App',

  components: {
    pagecontent,
  },

  data: () => ({
    //
  }),
};
</script>

<template>
  <div id="app">
    <router-view v-if="isContactView" />

    <connect-layout v-else>
      <router-view />
    </connect-layout>
  </div>
</template>

<script>
import ConnectLayout from './layouts/ConnectLayout';

export default {
  name: 'App',

  components: {
    ConnectLayout,
  },

  computed: {
    isContactView() {
      return this.$route.name === 'contact';
    },
  },
};
</script>

<template>
  <v-app class="gradient-background">
    <v-main>
      <router-view></router-view>
    </v-main>
    <infotext/>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components:{
    infotext: () => import('./components/snackbars/infotext.vue'),
  },
  data: () => ({
    //
  }),
  mounted () {
    this.$store.dispatch('getSettings')
  },
};
</script>

<style>
  #app.gradient-background{
    background-color: #00DBDE;
    background-image: linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%);
  }
</style>

<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
// import axios from 'axios'
// import Keycloak from 'assets/keycloak/keycloak.js'
// import Vue from 'vue'
// import VueKeycloak from 'vue-keycloak'
// Vue.use(VueKeycloak, {
//   keycloakOptions: '/statics/keycloak.json',
//   keycloakInitOptions: {
//     // onLoad: 'check-sso'
//   }
// })
export default {
  name: 'App',
  props: ['authenticated', 'blah'],
  mounted () {
    // var self = this
    this.$store.dispatch('checkAuth', {axios: this.$axios})
    this.$store.dispatch('fetchValidators', {axios: this.$axios})
    this.$store.dispatch('fetchTypes', {axios: this.$axios})
    this.$store.dispatch('fetchStatuses', {axios: this.$axios})
    console.log('$store', this.$store)
    // once mounted, we need to trigger
    // console.log('set axios defaults', [document.cookie, document])
    // axios.defaults.withCredentials = true
    // axios.defaults.xsrfCookieName = 'csrftoken'
    // axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    // axios.defaults.baseURL = '/server'
    // {withCredentials: true, xsrfCookieName: 'csrftoken', xsrfHeaderName: 'X-CSRFToken'}
    // this.$axios.get('/api/validators/')
    //   .then(function (response) {
    //     self.validators = response.data
    //   })
  }
}
</script>

<style>
</style>

<template>
  <div id="q-app">
    {{blah}} HELLO?
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
// import Keycloak from 'assets/keycloak/keycloak.js'
import Vue from 'vue'
import VueKeycloak from 'vue-keycloak'
Vue.use(VueKeycloak, {
  keycloakOptions: '/statics/keycloak.json',
  keycloakInitOptions: {
    // onLoad: 'check-sso'
  }
})
// Vue.use(VueKeycloak, {
//   keycloakOptions: {
//     'realm': '',
//     'url': 'http://ec2-54-153-33-35.us-west-1.compute.amazonaws.com/auth',
//     'ssl-required': 'external',
//     'resource': 'MyClient',
//     'public-client': true,
//     'clientId': 'MyClient'
//   },
//   keycloakInitOptions: {
//     onLoad: 'check-sso'
//   }
// })
export default {
  name: 'App',
  props: ['authenticated', 'blah'],
  // data () {
  //   return {
  //     authenticated: false,
  //     blah: 'testing'
  //   }
  // },
  mounted () {
    // this.auth.init()
    /*
    var self = this
    self.blah = 'sdsdfsdlfjsdl'
    console.log('Keycloak', Keycloak)
    // var keycloak = Keycloak({
    //   'realm': 'master',
    //   'auth-server-url': 'http://ec2-54-153-33-35.us-west-1.compute.amazonaws.com/auth',
    //   'ssl-required': 'external',
    //   'resource': 'submission',
    //   'public-client': true,
    //   'confidential-port': 0,
    //   'clientId': 'submission'
    // }
    // )
    var keycloak = Keycloak('/statics/keycloak.json')
    keycloak.onAuthSuccess = function () {
      alert('authenticated')
      self.authenticated = true
    }
    // kc.authServerUrl = 'http://ec2-54-153-33-35.us-west-1.compute.amazonaws.com/auth'
    console.log('keycloak', keycloak)
    keycloak.init().then(function (authenticated) { // {onLoad: 'login-required'}
      // alert(authenticated ? 'authenticated' : 'not authenticated')
      console.log('authenticated?', authenticated)
      self.authenticated = authenticated
      if (!authenticated) {
        keycloak.login()
        // console.log('login')
      }
    }).catch(function () {
      alert('failed to initialize')
    })
    */
    // once mounted, we need to trigger
    console.log('set axios defaults', [document.cookie, document])
    axios.defaults.withCredentials = true
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    // {withCredentials: true, xsrfCookieName: 'csrftoken', xsrfHeaderName: 'X-CSRFToken'}
  }
}
</script>

<style>
</style>

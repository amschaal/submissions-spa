// import axios from 'axios'
import Keycloak from 'assets/keycloak/keycloak.js'

var auth = {
  blah: 'stuff',
  authenticated: false,
  isAuthenticated: function () {
    console.log('isAuthenticated', auth.authenticated)
    return auth.authenticated
  },
  login: function () {
    auth.keycloak.login()
  },
  logout: function () {
    console.log('logout')
    auth.keycloak.logout()
  },
  init: function () {
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
    auth.keycloak = Keycloak('/statics/keycloak.json')
    auth.keycloak.onAuthSuccess = function () {
      alert('authenticated')
      console.log('authenticated', auth.authenticated, auth.blah)
      auth.authenticated = true
    }
    // kc.authServerUrl = 'http://ec2-54-153-33-35.us-west-1.compute.amazonaws.com/auth'
    // console.log('keycloak', keycloak)
    auth.keycloak.init().then(function (authenticated) { // {onLoad: 'login-required'}
      console.log('authenticated?', authenticated)
      self.authenticated = authenticated
      // alert(authenticated ? 'authenticated' : 'not authenticated')

      // // self.authenticated = authenticated
      // if (!authenticated) {
      //   keycloak.login()
      //   // console.log('login')
      // }
    }).catch(function () {
      alert('failed to initialize')
    })
  }

}

export default ({ app, Vue }) => {
  // Vue.prototype.auth = auth
  console.log('app', app)
  Vue.prototype.auth = auth
}

export { auth }

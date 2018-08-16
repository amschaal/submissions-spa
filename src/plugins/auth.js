import auth from '../store/auth/index.js'

export default ({ app, Vue }) => {
  console.log('export auth', auth)
  Vue.prototype.$auth = auth
}

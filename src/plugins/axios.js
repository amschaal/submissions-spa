// axios app plugin file (src/plugins/axios.js)

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: 'http://submission.ucdavis.edu'// ,
  // withCredentials: true,
  // xsrfCookieName: 'csrftoken',
  // xsrfHeaderName: 'X-CSRFToken'
})

export default ({ Vue }) => {
  // for use inside Vue files through this.$axios
  Vue.prototype.$axios = axiosInstance
}

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance }

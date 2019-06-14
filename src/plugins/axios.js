// axios app plugin file (src/plugins/axios.js)

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: '/server' //  'http://submission.ucdavis.edu'// ,
  // withCredentials: true,
  // xsrfCookieName: 'csrftoken',
  // xsrfHeaderName: 'X-CSRFToken'
})

axiosInstance.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  console.log('oops', error.response.data['status_code'])
  if ((error.response.data['status_code'] === 401 || error.response.data['status_code'] === 403) && error.response.data['authenticated'] === false) {
    alert('Oops, you might need to sign back in!')
  }
  return error // Promise.reject(error)
})

export default ({ Vue }) => {
  // for use inside Vue files through this.$axios
  Vue.prototype.$axios = axiosInstance
}

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance }

// Passing in this.$axios from application.  Seems like an antipattern, but I need to use same configuration for axios.
// import axios from 'axios'
// import axiosInstance from '../../plugins/axios'

export const login = (context, {username, password, axios}) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/login/', {
      username: username,
      password: password
      // headers: auth.getAuthHeader(),
    })
      .then(function (response) {
        context.commit('login', response.data.user)
        resolve(response)
      })
      .catch(function (error) {
        console.log('errors', error.message)
        reject(error.message)
      })
  })
}

// return axios.post('/api/login/', {
//   username: username,
//   password: password
//   // headers: auth.getAuthHeader(),
// })
//   .then(function (response) {
//     context.commit('login', response.data.user)
//   })
//   .catch(function (error) {
//     console.log('errors', error.message)
//   })

export const checkAuth = (context, {axios}) => {
  console.log('context', context)
  return axios.post('/api/login/')
    .then(function (response) {
      context.commit('login', response.data.user)
    })
    .catch(function (error) {
      console.log(error.message)
    })
}

export const logout = (context, {axios}) => {
  return axios.post('/api/logout/', {
    // headers: auth.getAuthHeader(),
  })
    .then(function (response) {
      context.commit('logout')
    })
    .catch(function (error) {
      console.log('error!!!', error.message)
      return Promise.reject(new Error('failed'))
    })
}

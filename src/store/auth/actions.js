import axios from 'axios'

export const login = (context, {username, password}) => {
  return axios.post('/api/login/', {
    username: username,
    password: password
    // headers: auth.getAuthHeader(),
  })
    .then(function (response) {
      context.commit('login', response.data.user)
    })
    .catch(function (error) {
      console.log(error.message)
    })
}

export const checkAuth = (context) => {
  return axios.post('/api/login/')
    .then(function (response) {
      context.commit('login', response.data.user)
    })
    .catch(function (error) {
      console.log(error.message)
    })
}

export const logout = (context) => {
  return axios.post('/api/logout/', {
    // headers: auth.getAuthHeader(),
  })
    .then(function (response) {
      context.commit('logout')
    })
    .catch(function (error) {
      console.log('error!!!', error.message)
    })
}

export const foo = () => {
  console.log('running foo')
  return 'bar'
}

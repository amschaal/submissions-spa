import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import cache from './cache'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    cache
  }
})

export default store

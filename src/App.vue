<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  mounted () {
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

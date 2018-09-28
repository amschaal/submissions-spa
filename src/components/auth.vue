<template>
  <div>
    <q-modal v-model="opened" :content-css="{minHeight: '90vh'}" ref="modal">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Login
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-field
            label="Username"
          >
            <q-input v-model="username"/>
          </q-field>
          <q-field
            label="Password"
          >
            <q-input v-model="password" type="password"/>
          </q-field>
        </div>
        <q-toolbar slot="footer">
          <q-toolbar-title>
            <q-btn
              color="positive"
              label="submit"
              @click="login"
            />
          </q-toolbar-title>
        </q-toolbar>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  props: ['show_login'],
  data () {
    return {
      opened: this.show_login,
      username: null,
      password: null
    }
  },
  methods: {
    login () {
      var self = this
      console.log('$auth', this.$store._actions)
      this.$store.dispatch('login', {username: this.username, password: this.password, axios: this.$axios}).then(
        function () {
          self.opened = false
        })
      // console.log('login')
      // this.opened = true
      // // axios.defaults.withCredentials = true
      // axios
      //   .post(`http://127.0.0.1:8002/api/login/`, {username: this.username, password: this.password}) //, headers: {'X-CSRFToken': 'Bar'}
      //   .then(({ data }) => {
      //     console.log('login', data)
      //   })
      //   .catch(error => {
      //     console.log('error', error)
      //   })
    },
    logout () {
      this.$store.dispatch('logout', {axios: this.$axios})
    }
  },
  mounted () {
    console.log('mounting auth')
  }
}

</script>

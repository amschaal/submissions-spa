<template>
  <q-page padding class="docs-input row">
    Settings
  </q-page>
</template>

<script>
export default {
  name: 'settings',
  data () {
    return {
      lab: '',
      settings: null
    }
  },
  methods: {
    foo () {
    }
  },
  mounted () {
    this.$axios
      .get(`/api/labs/`)
      .then(({ data }) => {
        console.log('data', data)
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<style>

</style>

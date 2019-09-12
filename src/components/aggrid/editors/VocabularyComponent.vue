<template>
    <div class="autocomplete">
      <q-input color="amber" v-model="value" placeholder="Featuring static data">
        <q-autocomplete
          @search="search"
          :min-characters="2"
          @selected="selected"
        />
      </q-input>
    </div>
</template>

<script>
import Vue from 'vue'
// import { filter } from 'quasar'
export default Vue.extend({
  data () {
    return {
      value: null,
      options: ['one', 'two', 'three']
    }
  },
  methods: {
    selected (item) {
      this.value = item.value
      // this.$q.notify(`Selected suggestion "${item.label}"`)
    },
    search (terms, done) {
      this.$axios
        .get(`/api/terms/test/?search=${terms}`)
        .then(function (response) {
          console.log('response', response)
          done(response.data.results.map(o => ({value: o.value, label: o.value})))
        })
        // .catch(function (error, stuff) {
        // })
      console.log(terms)
    },
    getValue () {
      return this.value
    },
    setValue (value) {
      if (!value) return
      this.value = value
    }
  },
  created () {
    this.value = this.params.value
    console.log('autocomplete params', this.params)
  },
  mounted () {
    Vue.nextTick(() => {
      if (this.$refs.input) {
        this.$refs.input.select()
      }
    })
  }
})

</script>

<style scoped>
</style>

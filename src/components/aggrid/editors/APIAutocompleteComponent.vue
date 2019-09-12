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
      value: null
    }
  },
  methods: {
    selected (item) {
      this.value = item.value
      // this.$q.notify(`Selected suggestion "${item.label}"`)
    },
    search (terms, done) {
      var self = this
      this.$axios
        .get(`${this.url}?search=${terms}&${this.params}`)
        .then(function (response) {
          console.log('response', response)
          done(response.data.results.map(o => ({value: o[self.value_property], label: o[self.label_property]})))
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
    var options = this.params.widget_options ? this.params.widget_options : {}
    this.url = options.url
    this.params = options.params
    this.value_property = options.value_property
    this.label_property = options.label_property
    if (!this.url) {
      this.$q.notify({message: 'No API has been specified.', color: 'red'})
    }
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

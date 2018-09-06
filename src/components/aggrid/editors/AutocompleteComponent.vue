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

export default Vue.extend({
  data () {
    return {
      value: null,
      options: ['one', 'two', 'three']
    }
  },
  methods: {
    selected (item) {
      this.$q.notify(`Selected suggestion "${item}"`)
    },
    search (terms, done) {
      console.log(terms)
      setTimeout(() => {
        done([{value: 'one', label: 'one'}, {value: 'two', label: 'two'}]) // filter(terms, {field: 'value', list: ['one', 'two', 'three']}) // ['one', 'two', 'three']
      }, 100)
    },
    getValue () {
      return this.value
    },
    setValue (value) {
      if (!value) return
      this.value = value
      // this.params.onNumberChanged()
    }
  },
  created () {
    this.value = this.params.value
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

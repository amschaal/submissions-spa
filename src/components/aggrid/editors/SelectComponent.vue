<template>
    <div>
      <q-select
        v-model="value"
        :options="select_options"
        ref="select"
        @input="selected(value)"
        :multiple="widget_options.multiple"
      />
    </div>
</template>

<script>
import Vue from 'vue'
// import { filter } from 'quasar'
export default Vue.extend({
  data () {
    return {
      value: null,
      select_options: [],
      widget_options: {}
    }
  },
  methods: {
    selected (value) {
      this.params.stopEditing()
    },
    getValue () {
      return Array.isArray(this.value) ? this.value.join(',') : this.value
    },
    setValue () {
      this.value = this.params.value
      if (this.widget_options.multiple) {
        this.value = this.value ? this.value : []
        if (!Array.isArray(this.value)) {
          if (typeof this.value === 'string') {
            this.value = this.value.split(',')
          } else {
            this.value = [this.value]
          }
        }
        var filtered = []
        // filter bad values here
        for (var i in this.options) {
          if (this.value.indexOf(this.options[i]) >= 0) {
            filtered.push(this.options[i])
          }
        }
        this.value = filtered
      }
    }
  },
  created () {
    this.widget_options = this.params.widget_options ? this.params.widget_options : {}
    this.options = this.params.definition.enum
    this.setValue()
    this.select_options = this.options.map(function (val) { return {'label': val, 'value': val} })
    console.log('select params', this.params)
    console.log('value', this.value)
    // var options = this.params.widget_options ? this.params.widget_options : {}
  },
  mounted () {
    Vue.nextTick(() => {
      if (this.$refs.select) {
        console.log('select', this.$refs.select)
        this.$refs.select.show()
      }
    })
  }
})

</script>

<style scoped>
</style>

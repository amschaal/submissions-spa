<template>
    <div>
      <q-select
        v-model="value"
        :options="options"
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
      options: [],
      widget_options: {}
    }
  },
  methods: {
    selected (value) {
      this.params.stopEditing()
    },
    getValue () {
      return this.value
    }
  },
  created () {
    this.widget_options = this.params.widget_options ? this.params.widget_options : {}
    this.value = this.params.value
    if (this.widget_options.multiple) {
      this.value = this.value ? this.value : []
      if (!Array.isArray(this.value)) {
        if (this.value instanceof String) {
          this.value = this.value.split(',')
        } else {
          this.value = [this.value]
        }
      }
    }
    this.options = this.params.definition.enum.map(function (val) { return {'label': val, 'value': val} })
    console.log('select params', this.params)
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

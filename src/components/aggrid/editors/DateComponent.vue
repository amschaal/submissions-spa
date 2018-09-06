<template>
    <div class="date">
      <q-datetime :ref="'input'" v-model="value" type="date" />
    </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      value: null
    }
  },
  methods: {
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
    .date {
        margin: 2px
    }
    .date input {
      width: 100%;
    }
</style>

<template>
  <div class="row">
    <div class="col-sm-12 col-md-6 col-lg-3">
      <q-field
        :error="errors.order_id"
        :error-label="errors.order_id"
        helper="Please ensure that you have an account and order set up at: https://ppms.us/ucdavis/"
      >
        <q-input v-model="value.order_id" type="text" stack-label="PPMS Order ID"/>
      </q-field>
    </div>
  </div>
</template>

<script>
// import { QSelect } from 'quasar'
// import _ from 'lodash'

export default {
  props: ['value', 'editable', 'errors', 'modify'],
  data () {
    return {
      payment: this.value
    }
  },
  // methods: {
  // },
  // computed: {
  // },
  // components: {
  //   QSelect
  // },
  watch: {
    // payment: function (newValue, oldValue) {
    //   this.$emit('input', this.payment)
    // }
  }
}
</script>
<style>
.q-field {
  padding: 3px !important;
}
</style>

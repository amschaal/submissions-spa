<template>
  <div class="row">
    <div class="col-sm-12 col-md-6">
      <q-field
        :error="errors.payment_type"
        :error-label="errors.payment_type"
        :helper="type_help"
      >
        <q-select
          float-label="Select"
          v-model="value.payment_type"
          :options="[
            {label: 'UCD KFS Account', value: 'DaFIS'},
            {label: 'UC Chart String', value: 'UC Chart String'},
            {label: 'Credit Card (Non UC only)', value: 'Credit Card'},
            {label: 'Purchase Order', value: 'Purchase Order'}
          ]"
          stack-label="* Payment Type"

        />
      </q-field>
    </div>
    <div class="col-sm-12 col-md-6">
      <q-field
        :error="errors.payment_info"
        :error-label="errors.payment_info"
      >
        <q-input v-model="value.payment_info" type="text" stack-label="Payment Info"/>
      </q-field>
    </div>
    <div class="col-sm-12 col-md-12">
      <q-field
        :error="errors.ppms_order_id"
        :error-label="errors.ppms_order_id"
        helper="Please see our getting started page for more details: https://dnatech.genomecenter.ucdavis.edu/getting-started/"
      >
        <q-input v-model="value.ppms_order_id" type="text" stack-label="PPMS Order ID"/>
      </q-field>
    </div>
  </div>
</template>

<script>
import { QSelect } from 'quasar'
// import _ from 'lodash'

export default {
  props: ['value', 'editable', 'errors', 'modify'],
  data () {
    return {
      payment: this.value
    }
  },
  methods: {

  },
  computed: {
    type_help () {
      console.log('type_help', this.value.payment_type)
      switch (this.value.payment_type) {
        case 'DaFIS':
          return 'Enter payment info in the form CHART-ACCOUNT, e.g. 3-MYACCNT'
        case 'Credit Card':
          return 'Details required after invoicing (leave payment info blank)'
        default:
          return ''
      }
    }
  },
  components: {
    QSelect
  },
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

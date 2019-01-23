<template>
  <div class="row">
    <div class="col-sm-12 col-md-6">
      <q-field
        :error="errors.payment_type"
        :error-label="errors.payment_type"
      >
        <q-select
          float-label="Select"
          v-model="value.payment_type"
          :options="[
            {label: 'Credit Card', value: 'Credit Card'},
            {label: 'DaFIS', value: 'DaFIS'},
            {label: 'UC Chart String', value: 'UC Chart String'},
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

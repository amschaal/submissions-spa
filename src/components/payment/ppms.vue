<template>
    <div class="row">
    <p class="col-sm-12 col-lg-12">Please ensure that your lab has an account set up at: <a href="https://ppms.us/ucdavis/">https://ppms.us/ucdavis/</a>. Use the same email address as the PI listed for the group.</p>
    <div class="col-sm-12 col-md-6 col-lg-3">
      <q-field
        :error="errors.pi_email"
        :error-label="errors.pi_email"
        helper="Please ensure that your lab has an account set up at: https://ppms.us/ucdavis/.  Use the same email address as the PI listed for the group."
      >
        <q-input v-model="value.ppms_email" type="text" stack-label="PI Email"/>
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
  }
}
</script>
<style>
.q-field {
  padding: 3px !important;
}
</style>

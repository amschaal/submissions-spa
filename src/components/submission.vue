<template>
  <div>
        <div class="row">
          <div class="col-sm-12">
            <p class="caption">Type</p>
            <span v-if="submission && submission.type">{{submission.type.name}}</span><span v-else>None</span>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-4">
            <p class="caption">Submitter</p>
            {{submission.name}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <p class="caption">Email</p>
            {{submission.email}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <p class="caption">Phone</p>
            {{submission.phone}}
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-4">
            <p class="caption">PI</p>
            {{submission.pi_name}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <p class="caption">PI Email</p>
            {{submission.pi_email}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <p class="caption">Institute</p>
            {{submission.institute}}
          </div>
        </div>
        <p class="caption">Payment</p>
        <div class="row">
          <div class="col-sm-12 col-md-6">
            {{submission.payment_type}}
          </div>
          <div class="col-sm-12 col-md-6">
            <p class="caption">Payment information</p>
            {{submission.payment_info}}
          </div>
        </div>
          <!-- <Samplesheet v-model="submission.sample_data" :type="type"/> -->
          <Agschema v-model="submission.sample_data" :type="submission.type" :editable="false"/>
      </div>
</template>

<script>
// import './docs-input.styl'
import Agschema from './agschema.vue'
// import Vue from 'vue'

export default {
  // name: 'submission',
  props: ['id', 'submission'],
  // data () {
  //   return {
  //     // submission: {},
  //     // type: {}
  //   }
  // },
  // mounted: function () {
  //   console.log('mounted')
  //   var self = this
  //
  //   self.$axios
  //     .get('/api/submissions/' + self.id)
  //     .then(function (response) {
  //       console.log('response', response)
  //       self.submission = response.data
  //       // self.$axios
  //       //   .get(`/api/submission_types/${self.submission.type}/`)
  //       //   .then(function (response) {
  //       //     self.type = response.data
  //       //   })
  //     })
  // },
  components: {
    Agschema
  }
}
</script>
<style scoped>
  .q-field {
    padding: 0px 10px;
  }
</style>

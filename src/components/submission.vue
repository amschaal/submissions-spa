<template>
  <div>
        <p class="caption">Submitter</p>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-4">
            {{submission.name}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            {{submission.email}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            {{submission.phone}}
          </div>
        </div>
        <p class="caption">PI</p>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-4">
            {{submission.pi_name}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            {{submission.pi_email}}
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            {{submission.institute}}
          </div>
        </div>
        <p class="caption">Payment</p>
        <div class="row">
          <div class="col-sm-12 col-md-6">
            {{submission.payment_type}}
          </div>
          <div class="col-sm-12 col-md-6">
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
  props: ['id'],
  data () {
    return {
      submission: {},
      type: {}
    }
  },
  mounted: function () {
    console.log('mounted')
    var self = this

    self.$axios
      .get('/api/submissions/' + self.id)
      .then(function (response) {
        console.log('response', response)
        self.submission = response.data
        // self.$axios
        //   .get(`/api/submission_types/${self.submission.type}/`)
        //   .then(function (response) {
        //     self.type = response.data
        //   })
      })
  },
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

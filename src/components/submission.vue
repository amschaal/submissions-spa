<template>
  <div>
        <div class="row">
          <div class="col-sm-12 col-lg-4">
            <StatusSelector v-model="submission.status" :submission="submission" v-if="submission.id"/>
          </div>
          <div class="col-sm-12 col-lg-8">

            <q-btn v-if="submission.editable && !modify && !submission.cancelled" label="Modify" class="float-right" @click="$router.push({name: 'modify_submission', params: {id: submission.id}})"/>
            <Lock class="float-right" v-if="submission.id" :submission="submission"/>
            <Cancel class="float-right" v-if="submission.id" :submission="submission"/>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <p class="caption">Type</p>
            {{submission_type.name}}
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
        <div class="row" v-if="submission.biocore">
          <div class="col-sm-12">
            <q-icon size="18px" name="check_circle" color="green"/> Bioinformatics Core to analyze data
          </div>
        </div>
          <!-- <Samplesheet v-model="submission.sample_data" :type="type"/> -->
          <Agschema v-model="submission.sample_data" :type="submission_type" :editable="false" ref="samplesheet"/>
          <q-btn :label="'Samples ('+submission.sample_data.length+')'"  @click="openSamplesheet"/>

      </div>
</template>

<script>
// import './docs-input.styl'
import Agschema from './agschema.vue'
import StatusSelector from './statusSelector.vue'
import Lock from './lock.vue'
import Cancel from './cancel.vue'
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
  methods: {
    openSamplesheet () {
      this.$refs.samplesheet.openSamplesheet()
    }
  },
  computed: {
    submission_type () {
      if (this.submission && this.submission.type && this.submission.type.id) {
        return this.submission.type
      } else if (this.submission && this.submission.type) {
        return this.$store.getters.typesDict[this.submission.type]
      }
      return {}
    }
  },
  components: {
    Agschema,
    StatusSelector,
    Lock,
    Cancel
  }
}
</script>
<style scoped>
  .q-field {
    padding: 0px 10px;
  }
</style>

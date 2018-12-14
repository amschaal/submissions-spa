<template>
  <div>
        <div class="row">
          <div class="field col-sm-12 col-lg-4">
            <StatusSelector v-model="submission.status" :submission="submission" v-if="submission.id"/>
          </div>
          <div class="col-sm-12 col-lg-8">
            <div class="row">
              <div class="col-lg-12">
                <q-btn v-if="submission.editable && !submission.cancelled" label="Modify" class="float-right" @click="$router.push({name: 'modify_submission', params: {id: submission.id}})"/>
                <Lock v-if="submission.id" :submission="submission" class="float-right"/>
                <Cancel v-if="submission.id" :submission="submission" class="float-right"/>
              </div>
            </div>
            <div class="row" v-if="submission.id">
              <div class="col-lg-12">
                <q-btn label="Download" @click="download()"  class="float-right"/>
                <q-select
                  v-model="downloadParams.format"
                  :options="formatOptions"
                  v-if="downloadParams.data !== 'all'"
                  class="float-right"
                />
                <q-select
                  v-model="downloadParams.data"
                  :options="dataOptions"
                  class="float-right"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="field col-sm-12">
            <p class="caption">Type</p>
            {{submission_type.name}}
          </div>
        </div>
        <div class="row">
          <div class="field col-sm-12 col-md-12 col-lg-4">
            <p class="caption">Submitter</p>
            {{submission.name}}
          </div>
          <div class="field col-sm-12 col-md-6 col-lg-4">
            <p class="caption">Email</p>
            {{submission.email}}
          </div>
          <div class="field col-sm-12 col-md-6 col-lg-4">
            <p class="caption">Phone</p>
            {{submission.phone}}
          </div>
        </div>
        <div class="row">
          <div class="field col-sm-12 col-md-12 col-lg-4">
            <p class="caption">PI</p>
            {{submission.pi_name}}
          </div>
          <div class="field col-sm-12 col-md-6 col-lg-4">
            <p class="caption">PI Email</p>
            {{submission.pi_email}}
          </div>
          <div class="field col-sm-12 col-md-6 col-lg-4">
            <p class="caption">Institute</p>
            {{submission.institute}}
          </div>
        </div>
        <p class="caption" v-if="submission.contacts && submission.contacts.length">Additional Contacts</p>
        <div class="row" v-for="(c, index) in submission.contacts" :key="index">
          <div class="field col-sm-12 col-md-12 col-lg-4">
            <p class="caption">First name</p>
            {{c.first_name}}
          </div>
          <div class="field col-sm-12 col-md-12 col-lg-4">
            <p class="caption">Last name</p>
            {{c.last_name}}
          </div>
          <div class="field col-sm-12 col-md-12 col-lg-4">
            <p class="caption">Email</p>
            {{c.email}}
          </div>
        </div>
        <p class="caption">Payment</p>
        <div class="row">
          <div class="field col-sm-12 col-md-6">
            {{submission.payment_type}}
          </div>
          <div class="field col-sm-12 col-md-6">
            <p class="caption">Payment information</p>
            {{submission.payment_info}}
          </div>
        </div>
        <div class="row" v-if="submission.biocore">
          <div class="field col-sm-12">
            <q-icon size="18px" name="check_circle" color="green"/> Bioinformatics Core to analyze data
          </div>
        </div>
        <CustomFields v-model="submission.submission_data" :schema="submission_type.schema" ref="submission_fields" v-if="submission_type && submission_type.schema" :modify="false"/>
          <!-- <Samplesheet v-model="submission.sample_data" :type="type"/> -->
        <Agschema v-model="submission.sample_data" :type="submission_type" :editable="false" ref="samplesheet" v-if="submission_type && submission_type.sample_schema"/>
        <q-btn :label="'Samples ('+submission.sample_data.length+')'"  @click="openSamplesheet"/>

      </div>
</template>

<script>
// import './docs-input.styl'
import Agschema from './agschema.vue'
import CustomFields from './forms/customFields.vue'
import StatusSelector from './statusSelector.vue'
import Lock from './lock.vue'
import Cancel from './cancel.vue'
// import Vue from 'vue'

export default {
  // name: 'submission',
  props: ['id', 'submission'],
  data () {
    return {
      downloadParams: {'data': 'all', 'format': 'xlsx'},
      dataOptions: [
        {
          label: 'Submission + Samples',
          value: 'all'
        },
        {
          label: 'Submission',
          value: 'submission'
        },
        {
          label: 'Samples',
          value: 'samples'
        }
      ]
    }
  },
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
      if (!this.submission_type || !this.submission_type.sample_schema) {
        this.$q.dialog({
          title: 'Alert',
          message: 'Please select a submission type first.'
        })
      } else {
        this.$refs.samplesheet.openSamplesheet()
      }
    },
    download () {
      window.location.href = `/server/api/submissions/${this.submission.id}/download/?format=${this.downloadParams.format}&data=${this.downloadParams.data}`
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
    },
    formatOptions () {
      var options = [
        {
          label: 'XLSX',
          value: 'xlsx'
        },
        {
          label: 'TSV',
          value: 'tsv'
        }
      ]
      if (this.downloadParams.data === 'all') {
        return [options[0]]
      } else {
        return options
      }
    }
  },
  components: {
    Agschema,
    CustomFields,
    StatusSelector,
    Lock,
    Cancel
  }
}
</script>
<style>
  .q-field {
    padding: 0px 10px;
  }
  .field {
    margin-bottom: 10px;
  }
  div.row div p.caption {
    margin: 0 0 5px;
  }
</style>

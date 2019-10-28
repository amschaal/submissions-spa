<template>
  <div>
        <div class="row">
          <div v-if="$route.query.created" class="field col-12">
            <q-alert
              type="positive"
              appear
              class="q-mb-sm"
            >
              <p>Submission Created!</p>
              <pre id="confirmation">{{submission_type.confirmation_text}}</pre>
            </q-alert>
          </div>
          <div class="field col-sm-12 col-lg-4">
            <StatusSelector v-model="submission.status" :submission="submission" v-if="submission.id && isAdmin"/>
          </div>
          <div class="col-sm-12 col-lg-8">
            <div class="row">
              <div class="col-lg-12">
                <q-btn v-if="canModify" label="Modify" class="float-right" @click="$router.push({name: 'modify_submission', params: {id: submission.id}})"/>
                <q-btn label="Print" class="float-right" @click="$router.push({name: 'print_submission', params: {id: submission.id}})"/>
                <Lock v-if="submission.id && isAdmin" :submission="submission" class="float-right"/>
                <Cancel v-if="submission.id && canCancel" :submission="submission" class="float-right"/>
              </div>
            </div>
          </div>
        </div>
        <div class="row">

          <div class="field col-sm-6 col-md-2">
            <p class="caption">Internal ID</p>
            {{submission.internal_id}}
          </div>
          <div class="field col-sm-6 col-md-2">
            <p class="caption">ID</p>
            {{submission.id}}
          </div>
          <div class="field col-sm-12 col-md-4" v-if="$store.getters.isStaff">
            <p class="caption">Participants</p>
            <span v-if="submission.participant_names">{{submission.participant_names.join(', ')}}</span>
          </div>
          <div class="field col-sm-12 col-md-4">
            <p class="caption">Type</p>
            {{submission_type.name}}
          </div>
        </div>
        <div class="row">
          <div class="field col-sm-6 col-md-6 col-lg-2">
            <p class="caption">First Name</p>
            {{submission.first_name}}
          </div>
          <div class="field col-sm-6 col-md-6 col-lg-2">
            <p class="caption">Last Name</p>
            {{submission.last_name}}
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
          <div class="field col-sm-6 col-md-6 col-lg-2">
            <p class="caption">PI First Name</p>
            {{submission.pi_first_name}}
          </div>
          <div class="field col-sm-6 col-md-6 col-lg-2">
            <p class="caption">PI Last Name</p>
            {{submission.pi_last_name}}
          </div>
          <div class="field col-sm-12 col-md-6 col-lg-4">
            <p class="caption">PI Email</p>
            {{submission.pi_email}}
          </div>
          <div class="field col-sm-12 col-md-6 col-lg-4">
            <p class="caption">PI Phone</p>
            {{submission.pi_phone}}
          </div>
          <div class="field col-sm-12 col-md-4 col-lg-4">
            <p class="caption">Institute</p>
            {{submission.institute}}
          </div>
          <div class="field col-sm-12 col-md-8 col-lg-8">
            <p class="caption">Special Instructions / Comments</p>
            {{submission.comments}}
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
          <div class="field col-sm-12 col-md-6" v-for="(value, label) in submission.payment.display" :key="label">
            <p class="caption">{{label}}</p>
            {{value}}
          </div>
          <!-- <div class="field col-sm-12 col-md-6">
            {{submission.payment_type}}
          </div>
          <div class="field col-sm-12 col-md-6">
            <p class="caption">Payment information</p>
            {{submission.payment_info}}
          </div> -->
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
    },
    canCancel () {
      return this.submission && !this.submission.cancelled && (!this.submission.locked || this.isAdmin)
    },
    canModify () {
      return !this.submission.locked || this.isAdmin
      // return this.submission.editable && !submission.cancelled
    },
    isAdmin () {
      return this.submission.permissions.indexOf('ADMIN') !== -1
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
  pre#confirmation {
    white-space: pre-wrap;
  }
</style>

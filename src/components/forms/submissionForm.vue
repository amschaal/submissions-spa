<template>
  <div>
      <q-checkbox v-model="debug" label="Debug" />
        <span v-if="debug">
          {{errors}}
          {{submission}}
        </span>
        <q-field
          label="Participants"
          label-width="2"
          :error="errors.type"
          :error-label="errors.type"
          v-if="submission.participants && user_options"
        >
          <q-select
            float-label="Select"
            multiple
            v-model="submission.participants"
            :options="user_options"
          />
        </q-field>
        <p class="caption">Submitter</p>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-4">
            <q-field
              helper="Some helper"
              :error="errors.name"
              :error-label="errors.name"
              :warning="errors.name"
              warning-label="Hey, we got a warning."
            >
              <q-input v-model="submission.name" type="text" stack-label="Full name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.email"
              :error-label="errors.email"
            >
              <q-input v-model="submission.email" type="email" :disable="submission.id != undefined" stack-label="Email"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.phone"
              :error-label="errors.phone"
            >
              <q-input v-model="submission.phone" type="text" stack-label="Submitter phone"/>
            </q-field>
          </div>
        </div>
        <p class="caption">PI</p>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-4">
            <q-field
              :error="errors.pi_name"
              :error-label="errors.pi_name"
            >
              <q-input v-model="submission.pi_name" type="text" stack-label="PI Full Name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.pi_email"
              :error-label="errors.pi_email"
            >
              <q-input v-model="submission.pi_email" type="text" stack-label="PI Email"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.institute"
              :error-label="errors.institute"
            >
            <q-input v-model="submission.institute" type="text" stack-label="Institute"/>
            </q-field>
          </div>
        </div>
        <p class="caption">Payment</p>
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <q-field
              :error="errors.payment_type"
              :error-label="errors.payment_type"
            >
              <q-select
                float-label="Select"
                v-model="submission.payment_type"
                :options="[
                  {label: 'Credit Card', value: 'Credit Card'},
                  {label: 'DaFIS', value: 'DaFIS'}
                ]"
                stack-label="Payment Type"
              />
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6">
            <q-field
              :error="errors.payment_info"
              :error-label="errors.payment_info"
            >
              <q-input v-model="submission.payment_info" type="text" stack-label="Payment Info"/>
            </q-field>
          </div>
        </div>
        <q-field
          label="Submission Type"
          label-width="2"
          :error="errors.type"
          :error-label="errors.type"
        >
          <q-select
            float-label="Select"
            v-model="submission.type"
            :options="type_options"
            :disable="submission.id != undefined"
          />
        </q-field>
        <q-field
          label="Samples"
          label-width="2"
          :error="errors.sample_data"
          :error-label="errors.sample_data"
        >
          <!-- <Samplesheet v-model="submission.sample_data" :type="type"/> -->
          <Agschema v-model="submission.sample_data" :type="type" :editable="true"/>
        </q-field>
        <span v-if="debug">
          <p>SCHEMA:
            {{type.schema}}
          </p>
          <p>DATA:
            {{submission.sample_data}}
          </p>
        </span>
        <q-card-actions>
          <q-btn @click="submit" label="Submit"></q-btn>
        </q-card-actions>
      </div>
</template>

<script>
import './docs-input.styl'
// import axios from 'axios'
// import Samplesheet from '../../components/samplesheet.vue'
import Agschema from '../../components/agschema.vue'
// import Files from '../../components/files.vue'
import Vue from 'vue'

export default {
  // name: 'submission',
  props: ['id'],
  data () {
    return {
      submission: {'sample_data': [{}]},
      errors: {},
      submission_types: [{ foo: 'bar' }],
      type_options: [{ 'label': 'test', 'value': 2 }],
      type: {},
      debug: false,
      user_options: null
    }
  },
  mounted: function () {
    console.log('mounted')
    var self = this
    this.$axios
      .get('/api/submission_types/?show=true')
      .then(function (response) {
        console.log('response', response)
        console.log('id', self.id)
        self.type_options = response.data.results.map(opt => ({label: opt.name, value: opt.id}))
        self.submission_types = response.data.results
        if (self.id && self.id !== 'create') {
          self.$axios
            .get('/api/submissions/' + self.id)
            .then(function (response) {
              console.log('response', response)
              self.submission = response.data
              Vue.set(self.submission, 'type', response.data.type.id)
            })
        }
      })
    this.$axios
      .get('/api/users/?show=true')
      .then(function (response) {
        self.user_options = response.data.results.map(opt => ({label: `${opt.first_name} ${opt.last_name}`, value: opt.id}))
      })
  },
  methods: {
    submit () {
      var self = this
      var id = this.submission.id
      var action = id ? 'put' : 'post'
      var url = id ? '/api/submissions/' + id + '/update/' : '/api/submit/'
      this.$axios[action]('' + url, this.submission)
        .then(function (response) {
          // console.log('submit', self.$emit)
          self.errors = {}
          // console.log(response)
          self.$q.notify({message: 'Submission successfully saved.', type: 'positive'})
          self.$emit('submission_updated', self.submission)
          if (!id) {
            self.$router.push({name: 'submission', params: {id: response.data.id}})
          }
        })
        .catch(function (error, stuff) {
          // raise different exception if due to invalid credentials
          console.log('ERROR', error.response)
          self.$q.notify({message: 'There were errors saving your submission.', type: 'negative'})
          if (error.response) {
            self.errors = error.response.data.errors
          }
          throw error
        })
    }
  },
  watch: {
    'submission.type': function (newType) {
      console.log('type changed', newType)
      for (var i in this.submission_types) {
        if (this.submission_types[i].id === newType) {
          console.log('type', this.submission_types[i])
          this.type = this.submission_types[i]
        }
      }
    },
    'id': function (id) {
      var self = this
      if (self.id && self.id !== 'create') {
        self.$axios
          .get('/api/submissions/' + self.id)
          .then(function (response) {
            console.log('response', response)
            self.submission = response.data
            Vue.set(self.submission, 'type', response.data.type.id)
          })
      } else {
        this.submission = {'sample_data': [{}, {}]}
      }
    }
  },
  computed: {
    error_message (field) {
      return this.errors[field]
    }
    // type_options () {
    //   return this.submission_types.map(opt => ({label: opt.name, value: opt.id}))
    // }

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

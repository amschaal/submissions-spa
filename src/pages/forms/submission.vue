<template>
  <q-page padding class="docs-input row justify-center">
    <q-card style="width:800px">
      <q-card-title>
        Create submission
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        {{errors}}
        {{submission}}
        <q-field
          label="Full name"
          helper="Some helper"
          :error="errors.name"
          :error-label="errors.name"
          :warning="errors.name"
          warning-label="Hey, we got a warning."
        >
          <q-input v-model="submission.name" type="text"/>
        </q-field>
        <q-field
          label="Email"
          :error="errors.email"
          :error-label="errors.email"
        >
          <q-input v-model="submission.email" type="email"/>
        </q-field>
        <q-field
          label="Submitter phone"
          :error="errors.phone"
          :error-label="errors.phone"
        >
          <q-input v-model="submission.phone" type="text"/>
        </q-field>
        <br>
        <q-field
          label="PI Full Name"
          :error="errors.pi_name"
          :error-label="errors.pi_name"
        >
          <q-input v-model="submission.pi_name" type="text"/>
        </q-field>
        <q-field
          label="PI Email"
          :error="errors.pi_email"
          :error-label="errors.pi_email"
        >
          <q-input v-model="submission.pi_email" type="text"/>
        </q-field>
        <q-field
          label="Institute"
          :error="errors.institute"
          :error-label="errors.institute"
        >
        <q-input v-model="submission.institute" type="text"/>
        </q-field>
        <q-field
          label="Payment Type"
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
          />
        </q-field>
        <q-field
          label="Payment Info"
          :error="errors.payment_info"
          :error-label="errors.payment_info"
        >
          <q-input v-model="submission.payment_info" type="text"/>
        </q-field>
        <q-field
          label="Submission Type"
          :error="errors.type"
          :error-label="errors.type"
        >
          <q-select
            float-label="Select"
            v-model="submission.type"
            :options="type_options"
          />
        </q-field>
        <Samplesheet v-model="submission.sample_data" :schema="schema" />
        <p>SCHEMA:
          {{schema}}
        </p>
        <p>DATA:
          {{submission.sample_data}}
        </p>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn @click="submit" label="Submit"></q-btn>
      </q-card-actions>

    </q-card>
  </q-page>
</template>

<script>
import './docs-input.styl'
import axios from 'axios'
import Samplesheet from '../../components/samplesheet.vue'

export default {
  name: 'submission',
  data () {
    return {
      submission: {'sample_data': [{}, {}]},
      errors: {},
      submission_types: [{ foo: 'bar' }],
      type_options: [{ 'label': 'test', 'value': 2 }],
      schema: []
    }
  },
  mounted: function () {
    var self = this
    axios
      .get('http://127.0.0.1:8002/api/submission_types')
      .then(function (response) {
        console.log('response', response)
        self.type_options = response.data.results.map(opt => ({label: opt.name, value: opt.id}))
        self.submission_types = response.data.results
      })
  },
  methods: {
    submit () {
      var self = this
      axios
        .post('http://127.0.0.1:8002', this.submission)
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error, stuff) {
          // raise different exception if due to invalid credentials
          console.log('ERROR', error.response)
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
          this.schema = this.submission_types[i].schema
        }
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
    Samplesheet
  }
}
</script>

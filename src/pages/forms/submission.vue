<template>
  <q-page padding class="docs-input row justify-center">
    <q-card style="width:800px">
      <q-card-title>
        Create submission
      </q-card-title>
      <q-card-separator />
      <Samplesheet v-model="submission.selected" :options="[]" />
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
      submission: {},
      errors: {}
    }
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
  },
  computed: {
    error_message (field) {
      return this.errors[field]
    }
  },
  components: {
    Samplesheet
  }
}
</script>

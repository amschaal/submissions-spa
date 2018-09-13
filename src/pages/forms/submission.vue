<template>
  <q-page padding class="docs-input row justify-center">
    <q-card style="width:800px">
    <q-tabs>
      <q-tab slot="title" name="submission" label="Submission" default/>
      <q-tab slot="title" name="files" label="Files"  v-if="submission.id"/>

    <q-tab-pane name="submission">

      <q-card-title>
        Create submission
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-checkbox v-model="debug" label="Debug" />
        <span v-if="debug">
          {{errors}}
          {{submission}}
        </span>
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
          <q-input v-model="submission.email" type="email" :disable="submission.id != undefined"/>
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
            :disable="submission.id != undefined"
          />
        </q-field>
        <q-field
          label="Samples"
          :error="errors.sample_data"
          :error-label="errors.sample_data"
        >
          <!-- <Samplesheet v-model="submission.sample_data" :type="type"/> -->
          <Agschema v-model="submission.sample_data" :type="type"/>
        </q-field>
        <span v-if="debug">
          <p>SCHEMA:
            {{type.schema}}
          </p>
          <p>DATA:
            {{submission.sample_data}}
          </p>
        </span>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn @click="submit" label="Submit"></q-btn>
      </q-card-actions>
    </q-tab-pane>
    <q-tab-pane name="files"  v-if="submission.id">
      <q-card-main>
        <!-- <q-uploader url="/api/submission_files/" :upload-factory="uploadFile" multiple="true"/> -->
        <files :submission="submission"/>
      </q-card-main>

  </q-tab-pane>
  </q-tabs>
  </q-card>
  </q-page>
</template>

<script>
import './docs-input.styl'
// import axios from 'axios'
// import Samplesheet from '../../components/samplesheet.vue'
import Agschema from '../../components/agschema.vue'
import Files from '../../components/files.vue'
import Vue from 'vue'

export default {
  name: 'submission',
  props: ['id'],
  data () {
    return {
      submission: {'sample_data': [{}, {}, {}]},
      errors: {},
      submission_types: [{ foo: 'bar' }],
      type_options: [{ 'label': 'test', 'value': 2 }],
      type: {},
      debug: false
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
  },
  methods: {
    submit () {
      var self = this
      var id = this.submission.id
      var action = id ? 'put' : 'post'
      var url = id ? '/api/submissions/' + id + '/update/' : '/api/submit/'
      this.$axios[action]('' + url, this.submission)
        .then(function (response) {
          self.errors = {}
          console.log(response)
          self.$q.notify({message: 'Submission successfully saved.', type: 'positive'})
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
    },
    uploadFile (file, uploadProgress) {
      var formData = new FormData()
      formData.append('file', file)
      formData.append('submission', this.submission.id)

      return this.$axios.post('/api/submission_files/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function (progressEvent) {
            var percentCompleted = progressEvent.loaded / progressEvent.total
            // execute the callback
            uploadProgress(percentCompleted)
            return percentCompleted * 100.0
          }
        }
      )
      // .then(function (response) {
      //   console.log('success', response.data)
      //   uploadProgress(1.0)
      // })
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
    Files,
    Agschema
  }
}
</script>

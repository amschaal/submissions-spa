<template>
  <q-page padding class="docs-input row justify-center">
    <q-card class="p90">
    <q-tabs>
      <q-tab slot="title" name="submission" label="Submission" default/>
      <q-tab slot="title" name="files" label="Files"  v-if="submission.id"/>
      <q-tab slot="title" name="comments" label="comments"  v-if="submission.id"/>

    <q-tab-pane name="submission">

      <q-card-title>
        <span v-if="submission.id">Update submission</span><span v-else>Create submission</span>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <Submission :id="id"/>
      </q-card-main>
    </q-tab-pane>
    <q-tab-pane name="files"  v-if="submission.id">
      <q-card-main>
        <!-- <q-uploader url="/api/submission_files/" :upload-factory="uploadFile" multiple="true"/> -->
        <files :submission="submission"/>
      </q-card-main>
    </q-tab-pane>
    <q-tab-pane name="comments" v-if="submission.id">
      <q-card-main>
        <notes-tree :submission="submission"/>
      </q-card-main>
    </q-tab-pane>
  </q-tabs>
  </q-card>
  </q-page>
</template>

<script>
// import './docs-input.styl'
// import axios from 'axios'
// import Samplesheet from '../../components/samplesheet.vue'
// import Agschema from '../components/agschema.vue'
import Submission from './forms/submission.vue'
import Files from '../components/files.vue'
import NotesTree from '../components/notesTree.vue'
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
    }
  },
  watch: {
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
    Submission,
    NotesTree
  }
}
</script>

<style scoped>
  .p90 {
    width: 90%;
  }
</style>

<template>
  <q-page padding class="docs-input row justify-center">
    <q-card class="p90">
    <q-tabs>
      <q-tab slot="title" name="submission"  default><span v-if="submission.id">Submission</span><span v-else>Create Submission</span></q-tab>
      <q-tab slot="title" name="files" label="Files"  v-if="submission.id"/>
      <q-tab slot="title" name="comments" label="comments"  v-if="submission.id"/>

    <q-tab-pane name="submission">

      <q-btn v-if="submission.editable && !modify" label="Modify" class="float-right" @click="modify=true"/> <Lock class="float-right" v-if="submission.id" :submission="submission"/>
      <q-card-main>
        <SubmissionForm :submission="submission" :create="create" :submission_types="submission_types" :type_options="type_options" :id="id" v-if="modify || create" v-on:submission_updated="submissionUpdated"/>
        <Submission :submission="submission" v-if="!modify && submission.id"/>
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
import SubmissionForm from '../components/forms/submissionForm.vue'
import Submission from '../components/submission.vue'
import Files from '../components/files.vue'
import NotesTree from '../components/notesTree.vue'
import Lock from '../components/lock.vue'
import Vue from 'vue'

export default {
  name: 'submission',
  props: ['id'],
  data () {
    return {
      submission: {'sample_data': [{}]},
      errors: {},
      submission_types: [],
      type_options: [],
      // type: {},
      // debug: false,
      modify: false,
      create: false
    }
  },
  mounted: function () {
    console.log('mounted')
    var self = this
    if (!this.id || this.id === 'create') {
      this.create = true
    }
    this.$axios
      .get('/api/submission_types/?show=true')
      .then(function (response) {
        console.log('response', response)
        console.log('id', self.id)
        self.type_options = response.data.results.map(opt => ({label: opt.name, value: opt.id}))
        self.submission_types = response.data.results
      })
    if (!self.create) {
      this.$axios
        .get('/api/submissions/' + self.id)
        .then(function (response) {
          console.log('response', response)
          self.submission = response.data
          // Vue.set(self.submission, 'type', response.data.type.id)
        })
    }
  },
  methods: {
    submissionUpdated (submission) {
      this.modify = false
      this.submission = submission
    }
  },
  watch: {
    'id': function (id) {
      console.log('id', id)
      if (!id || id === 'create') {
        this.create = true
      }
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
    SubmissionForm,
    NotesTree,
    Lock,
    Submission
  }
}
</script>

<style scoped>
  .p90 {
    width: 90%;
  }
</style>

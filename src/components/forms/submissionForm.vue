<template>
  <div>
      <q-checkbox v-model="debug" label="Debug" v-if="$store.getters.isStaff" />
        <span v-if="debug">
          {{type}}
          {{submission_types}}
          {{type_options}}
          {{submission}}
        </span>
<!-- v-if="submission.participants && user_options && !create" -->
        <q-field
          label="Participants"
          label-width="2"
          :error="errors.type"
          :error-label="errors.type"
          v-if="isAdmin && user_options && submission.participants"
        >
          <q-select
            float-label="Select"
            multiple
            v-model="submission.participants"
            :options="user_options"
          />
        </q-field>
        <p class="caption">PI</p>
        <div class="row">
          <div class="col-sm-6 col-md-6 col-lg-3">
            <q-field
              :error="errors.pi_first_name"
              :error-label="errors.pi_first_name"
            >
              <q-input v-model="submission.pi_first_name" type="text" stack-label="* PI First Name"/>
            </q-field>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-3">
            <q-field
              :error="errors.pi_last_name"
              :error-label="errors.pi_last_name"
            >
              <q-input v-model="submission.pi_last_name" type="text" stack-label="* PI Last Name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-3">
            <q-field
              :error="errors.pi_email"
              :error-label="errors.pi_email"
            >
              <q-input v-model="submission.pi_email" type="text" stack-label="* PI Email"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-3">
            <q-field
              :error="errors.pi_phone"
              :error-label="errors.pi_phone"
            >
              <q-input v-model="submission.pi_phone" type="text" stack-label="* PI phone"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-12 col-lg-12">
            <q-field
              :error="errors.institute"
              :error-label="errors.institute"
            >
            <q-input v-model="submission.institute" type="text" stack-label="* Institute"/>
            </q-field>
          </div>
        </div>
        <p class="caption">Submitter (<a class="link" @click="copyPI">Copy from PI</a>)</p>
        <div class="row">
          <div class="col-sm-6 col-md-6 col-lg-3">
            <q-field
              :error="errors.first_name"
              :error-label="errors.first_name"
            >
              <q-input v-model="submission.first_name" type="text" stack-label="* First name"/>
            </q-field>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-3">
            <q-field
              :error="errors.last_name"
              :error-label="errors.last_name"
            >
              <q-input v-model="submission.last_name" type="text" stack-label="* Last name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-3">
            <q-field
              :error="errors.email"
              :error-label="errors.email"
            >
              <q-input v-model="submission.email" type="email" :disable="submission.id != undefined" stack-label="* Email"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-3">
            <q-field
              :error="errors.phone"
              :error-label="errors.phone"
            >
              <q-input v-model="submission.phone" type="text" stack-label="* Submitter phone"/>
            </q-field>
          </div>
        </div>
        <p class="caption">Additional Contacts <q-btn @click="addContact" label="Add" color="positive"/></p>
        <div class="row" v-for="(c, index) in submission.contacts" :key="index">
          <div class="col-sm-12 col-md-4 col-lg-4">
            <q-field
              :error="hasContactError(index,'first_name')"
              :error-label="getContactError(index,'first_name')"
            >
              <q-input v-model="c.first_name" type="text" stack-label="* First Name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-4 col-lg-4">
            <q-field
              :error="hasContactError(index,'last_name')"
              :error-label="getContactError(index,'last_name')"
            >
              <q-input v-model="c.last_name" type="text" stack-label="* Last Name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-4 col-lg-4">
            <q-field
              :error="hasContactError(index,'email')"
              :error-label="getContactError(index,'email')"
            >
              <q-input v-model="c.email" type="text" stack-label="* Email"/>
            </q-field>
            <q-btn @click="removeContact(index)" color="negative" label="remove"/>
          </div>
        </div>
        <p class="caption">Payment</p>
        <!-- <UCDAccount v-model="submission.payment" :errors="errors.payment"/> -->
        <!-- <PPMS v-model="submission.payment" :errors="errors.payment"/> -->
        <Account v-model="submission.payment" :errors="errors.payment"/>
        <!-- <div class="row">
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
                stack-label="* Payment Type"
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
        </div> -->
        <q-field>
          <q-checkbox v-model="submission.biocore" label="I want the Bioinformatics Core to analyze my data" />
        </q-field>
        <q-field
          label="* Submission Type"
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
        <CustomFields v-model="submission.submission_data" :schema="submission.type.submission_schema || type.submission_schema" ref="submission_fields" v-if="type && type.submission_schema" :errors="errors.submission_data" modify="true"/>
        <q-field
          label="* Samples"
          label-width="2"
          :error="errors.sample_data"
          :error-label="errors.sample_data"
          :warning="sample_data_warning != null"
          :warning-label="sample_data_warning"
          v-if="type && type.sample_schema"
        >
          <!-- <Samplesheet v-model="submission.sample_data" :type="type"/> -->
          <Agschema v-model="submission.sample_data" :schema="submission.sample_schema" :type="type" :editable="true" :allow-examples="true" :allow-force-save="true" ref="samplesheet" v-if="type && type.sample_schema" :submission="submission" v-on:warnings="updateWarnings"/>
          <q-btn :label="'Samples ('+submission.sample_data.length+')'"  @click="openSamplesheet" />
        </q-field>
        <q-field
          :error="errors.comments"
          :error-label="errors.comments"
        >
          <q-input
            v-model="submission.comments" type="textarea"
            stack-label="Special Instructions / Comments"
            :max-height="100"
            rows="1"
          />
        </q-field>
        <span v-if="debug">
          <p>SCHEMA:
            {{type.sample_schema}}
          </p>
          <p>DATA:
            {{submission.sample_data}}
          </p>
        </span>
        <q-card-actions>
          <q-btn @click="submit" label="Submit"></q-btn>
          <q-btn @click="saveDraft" v-if="!id" color="positive" label="Save Draft"></q-btn>
          <q-btn v-if="submission.id" label="Cancel" color="negative" class="float-right" @click="$router.push({name: 'submission', params: {id: submission.id}})"/>
          <q-btn color="primary" @click="show_help = true" label="Help" icon="fas fa-question-circle" v-if="type && type.submission_help"/>
        </q-card-actions>
        <q-modal v-model="show_help">
          <q-modal-layout>
            <q-toolbar slot="header">
              <q-toolbar-title>
                Submission Help
              </q-toolbar-title>
            </q-toolbar>
            <div class="layout-padding">
              <div v-html="type.submission_help" v-if="type && type.submission_help"></div>
              <q-btn
                color="primary"
                @click="show_help = false"
                label="Close"
              />
            </div>
          </q-modal-layout>
        </q-modal>
      </div>
</template>

<script>
import './docs-input.styl'
// import axios from 'axios'
// import Samplesheet from '../../components/samplesheet.vue'
import Agschema from '../../components/agschema.vue'
import CustomFields from '../../components/forms/customFields.vue'
import Account from '../../components/payment/ucdAccount.vue'
// import PPMS from '../../components/payment/ppms.vue'
// import Files from '../../components/files.vue'
import Vue from 'vue'
import _ from 'lodash'

export default {
  // name: 'submission',
  props: ['id', 'submission_types', 'create'],
  data () {
    return {
      submission: {'submission_data': {}, 'sample_data': [], 'contacts': [], biocore: false, 'payment': {}},
      errors: {contacts: [], payment: {}},
      // submission_types: [{ foo: 'bar' }],
      // type_options: this.$store.getters.typeOptions,
      type: {},
      debug: false,
      user_options: null,
      show_help: false,
      payment: {},
      draft: null,
      messages: []
      // create: false
    }
  },
  mounted: function () {
    console.log('mounted')
    console.log('type', this.type)
    console.log('submission.type', this.submission.type)
    var submission = window.localStorage.getItem('submission')
    var self = this
    if (!this.create) {
      // this.$axios
      //   .get(`/api/submissions/${self.id}/`)
      //   .then(function (response) {
      //     console.log('response', response)
      //     if (!response.data.sample_data) {
      //       response.data.sample_data = []
      //     }
      //     self.submission = response.data
      //     Vue.set(self.submission, 'type', response.data.type.id)
      //   })
      this.loadSubmission(this.id)
    } else {
      this.draft = !this.id && this.$route.query.draft ? this.$route.query.draft : null
      if (this.draft) {
        this.loadDraft(this.draft)
      } else if (submission && window.JSON && window.JSON.parse) {
        var message = this.$q.notify({
          message: `An unsaved draft was found.  Would you like to load it?`,
          timeout: 0, // in milliseconds; 0 means no timeout
          type: 'info',
          position: 'top', // 'top', 'left', 'bottom-left' etc.
          actions: [
            {
              label: 'Restore',
              handler: () => {
                try {
                  self.submission = window.JSON.parse(submission)
                  this.$q.notify({message: 'Submission restored.', type: 'positive', position: 'top'})
                } catch {
                  this.$q.notify({message: 'There was an error restoring the submission.', type: 'negative'})
                }
              }
            },
            {
              label: 'Ignore',
              handler: () => {
                self.removeCached()
              }
            }

          ]
        })
        this.messages.push(message)
        // if (confirm('An unsaved draft was found.  Would you like to load it?')) {
        //   this.submission = window.JSON.parse(submission)
        // } else {
        //   this.removeCached()
        // }
      }
      console.log('draft', this.draft)
    }
    if (this.submission.type) {
      if (this.submission.type.id) {
        this.submission.type = this.submission.type.id
      } else {
        this.type = this.$store.getters.typesDict[this.submission.type]
      }
    }

    // this.$axios
    //   .get('/api/submission_types/?show=true')
    //   .then(function (response) {
    //     console.log('response', response)
    //     console.log('id', self.id)
    //     self.type_options = response.data.results.map(opt => ({label: opt.name, value: opt.id}))
    //     self.submission_types = response.data.results
    //     if (self.create) {
    //       self.$axios
    //         .get('/api/submissions/' + self.id)
    //         .then(function (response) {
    //           console.log('response', response)
    //           self.submission = response.data
    //           Vue.set(self.submission, 'type', response.data.type.id)
    //         })
    //     }
    //   })
    if (this.$store.getters.isStaff) {
      this.$axios
        .get('/api/users/?show=true')
        .then(function (response) {
          self.user_options = response.data.results.map(opt => ({label: `${opt.first_name} ${opt.last_name}`, value: opt.id}))
        })
    }
  },
  beforeDestroy: function () {
    if (this.draft_message) {
      this.draft_message()
    }
    this.messages.forEach(m => m())
  },
  methods: {
    openSamplesheet () {
      if (!this.type || !this.type.sample_schema) {
        this.$q.dialog({
          title: 'Alert',
          message: 'Please select a submission type first.'
        })
      } else {
        this.$refs.samplesheet.openSamplesheet()
      }
    },
    updateWarnings (warnings) {
      console.log('update', warnings)
      Vue.set(this.warnings, 'sample_data', warnings)
    },
    removeCached () {
      window.localStorage.removeItem('submission')
    },
    submit () {
      var self = this
      var id = this.submission.id
      var action = this.create ? 'post' : 'put'
      var url = !this.create ? `/api/submissions/${id}/` : '/api/submissions/'
      // var url = !this.create ? '/api/submissions/' + id + '/update/' : '/api/submit/'
      this.$axios[action]('' + url, this.submission)
        .then(function (response) {
          console.log('submit', response)
          // self.errors = {}
          // self.warnings = {}
          self.submission = response.data
          self.errors = response.data.data.errors
          self.warnings = response.data.data.warnings
          // console.log(response)
          self.$q.notify({message: 'Submission successfully saved.', type: 'positive'})
          self.$emit('submission_updated', self.submission)
          // if (self.create) {
          if (self.draft_message) {
            self.draft_message()
          }
          self.removeCached()
          self.$router.push({name: 'submission', params: {id: response.data.id}, query: {created: self.create}})
          // }
        })
        .catch(function (error, stuff) {
          // raise different exception if due to invalid credentials
          console.log('ERROR', error.response)
          var message = error.response.data.detail || 'There were errors saving your submission.'
          self.$q.notify({message: message, type: 'negative'})
          if (error.response) {
            // Vue.set(self, 'errors', error.response.data)
            self.errors = error.response.data
            Vue.set(self.errors, 'payment', error.response.data.payment || {})
          }
          throw error
        })
    },
    loadDraftMessage () {
      console.log(this.draft_message, this.draft)
      if (!this.draft_message && this.draft) {
        var page = window.location.href // self.$router.query.page
        if (!this.$route.query.draft) {
          page += '?draft=' + this.draft
        }
        var self = this
        this.draft_message = this.$q.notify({
          message: `This is a draft.  In order to make it a submission, you must first click on the submit button at the bottom of the form and ensure that the form submits without errors.  You may refer to this draft by the following URL: ${page}`,
          timeout: 0, // in milliseconds; 0 means no timeout
          type: 'info',
          position: 'top', // 'top', 'left', 'bottom-left' etc.
          actions: [
            {
              label: 'Dismiss',
              handler: () => {
                self.draft_message()
                self.draft_message = null
              }
            }
          ]
        })
      }
    },
    saveDraft () {
      var self = this
      var action = !this.draft ? 'post' : 'put'
      var url = this.draft ? `/api/drafts/${this.draft}/` : '/api/drafts/'
      // var url = !this.create ? '/api/submissions/' + id + '/update/' : '/api/submit/'
      this.$axios[action]('' + url, {data: this.submission})
        .then(function (response) {
          console.log('saveDraft', response)

          self.$q.notify({message: `Draft saved.`, type: 'positive'})
          self.draft = response.data.id
          self.loadDraftMessage()
          // self.$router.push({name: 'submission', params: {id: response.data.id}, query: {created: self.create}})
          // }
        })
        .catch(function (error, stuff) {
          // raise different exception if due to invalid credentials
          console.log('ERROR', error)
          self.$q.notify({message: 'There were errors saving your draft.', type: 'negative'})
          throw error
        })
    },
    loadDraft: function (id) {
      var self = this
      this.$axios
        .get(`/api/drafts/${id}/`)
        .then(function (response) {
          console.log('response', response)
          // if (!response.data.sample_data) {
          //   response.data.data.sample_data = []
          // }
          self.submission = response.data.data
          self.loadDraftMessage()
          // Vue.set(self.submission, 'type', response.data.type.id)
        }).catch(function (error, stuff) {
          self.$q.notify({message: `No draft was found with ID: ${id}`, type: 'negative'})
          self.draft = null
          self.$router.push({name: 'create_submission'})
          throw error
        })
    },
    loadSubmission: function (id) {
      var self = this
      this.$axios
        .get(`/api/submissions/${id}/`)
        .then(function (response) {
          console.log('response', response)
          if (!response.data.sample_data) {
            response.data.sample_data = []
          }
          self.submission = response.data
          self.errors = response.data.data.errors || {}
          self.warnings = response.data.data.warnings || {}
          Vue.set(self.submission, 'type', response.data.type.id)
        })
    },
    addContact () {
      this.submission.contacts.push({})
      console.log('contacts', this.submission.contacts)
    },
    removeContact (index) {
      this.submission.contacts.splice(index, 1)
    },
    hasContactError (index, field) {
      return this.getContactError(index, field) !== ''
    },
    getContactError (index, field) {
      if (this.errors && this.errors.contacts && this.errors.contacts[index] && this.errors.contacts[index][field]) {
        return this.errors.contacts[index][field].join(', ')
      }
      return ''
    },
    // assignType (id) {
    //   for (var i in this.submission_types) {
    //     if (this.submission_types[i].id === id) {
    //       // console.log('type', this.submission_types[i])
    //       this.type = this.submission_types[i]
    //     }
    //   }
    // },
    copyPI () {
      Vue.set(this.submission, 'first_name', this.submission.pi_first_name)
      Vue.set(this.submission, 'last_name', this.submission.pi_last_name)
      Vue.set(this.submission, 'phone', this.submission.pi_phone)
      Vue.set(this.submission, 'email', this.submission.pi_email)
    }
  },
  watch: {
    'submission.type': function (id) {
      // this.assignType(id)
      this.type = this.$store.getters.typesDict[id]
      console.log('type', id, this.type, this.$store.getters.typesDict)
      // this.type = this.submission.type
      // this.submission.type = this.type.id
    },
    'submission': {
      handler (newVal, oldVal) {
        console.log('submission changed')
        if (window.JSON && window.JSON.stringify && !newVal.id) {
          window.localStorage.setItem('submission', window.JSON.stringify(newVal))
        }
        // console.log('submission saved', window.localStorage.getItem('submission'))
      },
      deep: true
    },
    'id': function (id) {
      console.log('form id', id)
      this.loadSubmission(id)
    },
    'create': function (create) {
      console.log('form create', create)
      this.loadSubmission(create ? null : this.id)
    }
    // 'id': function (id) {
    //   var self = this
    //   if (self.id && self.id !== 'create') {
    //     self.$axios
    //       .get('/api/submissions/' + self.id)
    //       .then(function (response) {
    //         console.log('response', response)
    //         self.submission = response.data
    //         Vue.set(self.submission, 'type', response.data.type.id)
    //       })
    //   } else {
    //     this.submission = {'sample_data': [{}, {}]}
    //   }
    // }
  },
  computed: {
    error_message (field) {
      return this.errors[field]
    },
    sample_data_warning () {
      if (!this.warnings || !this.warnings.sample_data || _.size(this.warnings.sample_data) === 0) {
        return null
      } else {
        var warnings = _.size(this.warnings.sample_data)
        return `${warnings} samples have warnings.`
      }
    },
    type_options () {
      return this.$store.getters.typeOptions
    },
    isAdmin () {
      return this.submission.permissions && this.submission.permissions.indexOf('ADMIN') !== -1
    }
    // type_options () {
    //   return this.submission_types.map(opt => ({label: opt.name, value: opt.id}))
    // }

  },
  components: {
    Agschema,
    CustomFields,
    Account
    // UCDAccount
    // PPMS
  }
}
</script>
<style scoped>
  .q-field {
    padding: 0px 10px;
  }
  .link {
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
  }

</style>

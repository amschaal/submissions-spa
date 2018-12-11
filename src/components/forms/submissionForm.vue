<template>
  <div>
      <q-checkbox v-model="debug" label="Debug" />
        <span v-if="debug">
          {{type}}
          {{submission_types.length}}
          {{submission}}
        </span>
<!-- v-if="submission.participants && user_options && !create" -->
        <q-field
          label="Participants"
          label-width="2"
          :error="errors.type"
          :error-label="errors.type"
          v-if="$store.getters.isStaff && user_options && submission.participants"
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
              <q-input v-model="submission.name" type="text" stack-label="* Full name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.email"
              :error-label="errors.email"
            >
              <q-input v-model="submission.email" type="email" :disable="submission.id != undefined" stack-label="* Email"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.phone"
              :error-label="errors.phone"
            >
              <q-input v-model="submission.phone" type="text" stack-label="* Submitter phone"/>
            </q-field>
          </div>
        </div>
        <p class="caption">PI (<a class="link" @click="copySubmitter">Copy from submitter</a>)</p>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-4">
            <q-field
              :error="errors.pi_name"
              :error-label="errors.pi_name"
            >
              <q-input v-model="submission.pi_name" type="text" stack-label="* PI Full Name"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.pi_email"
              :error-label="errors.pi_email"
            >
              <q-input v-model="submission.pi_email" type="text" stack-label="* PI Email"/>
            </q-field>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4">
            <q-field
              :error="errors.institute"
              :error-label="errors.institute"
            >
            <q-input v-model="submission.institute" type="text" stack-label="* Institute"/>
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
        </div>
        <q-field>
          <q-checkbox v-model="submission.biocore" label="Do you want the Bioinformatics Core to analyze the data?" />
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
        <CustomFields v-model="submission.submission_data" :schema="type.schema" ref="submission_fields" v-if="type && type.schema" :errors="errors.submission_data" modify="true"/>
        <q-field
          label="* Samples"
          label-width="2"
          :error="errors.sample_data"
          :error-label="errors.sample_data"
          v-if="type && type.sample_schema"
        >
          <!-- <Samplesheet v-model="submission.sample_data" :type="type"/> -->
          <Agschema v-model="submission.sample_data" :type="type" :editable="true" :allow-examples="true" ref="samplesheet" v-if="type && type.sample_schema"/>
          <q-btn :label="'Samples ('+submission.sample_data.length+')'"  @click="openSamplesheet" />
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
// import Files from '../../components/files.vue'
import Vue from 'vue'

export default {
  // name: 'submission',
  props: ['id', 'submission_types', 'type_options', 'create'],
  data () {
    return {
      submission: {'submission_data': {}, 'sample_data': [], 'contacts': [], biocore: false},
      errors: {contacts: []},
      // submission_types: [{ foo: 'bar' }],
      // type_options: [{ 'label': 'test', 'value': 2 }],
      type: {},
      debug: false,
      user_options: null,
      show_help: false
      // create: false
    }
  },
  mounted: function () {
    console.log('mounted')
    console.log('type', this.type)
    console.log('submission.type', this.submission.type)
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
    submit () {
      var self = this
      var id = this.submission.id
      var action = this.create ? 'post' : 'put'
      var url = !this.create ? `/api/submissions/${id}/` : '/api/submissions/'
      // var url = !this.create ? '/api/submissions/' + id + '/update/' : '/api/submit/'
      this.$axios[action]('' + url, this.submission)
        .then(function (response) {
          console.log('submit', response)
          self.errors = {}
          self.submission = response.data
          // console.log(response)
          self.$q.notify({message: 'Submission successfully saved.', type: 'positive'})
          self.$emit('submission_updated', self.submission)
          // if (self.create) {
          self.$router.push({name: 'submission', params: {id: response.data.id}})
          // }
        })
        .catch(function (error, stuff) {
          // raise different exception if due to invalid credentials
          console.log('ERROR', error.response)
          self.$q.notify({message: 'There were errors saving your submission.', type: 'negative'})
          if (error.response) {
            self.errors = error.response.data
          }
          throw error
        })
    },
    loadSubmission: function (id) {
      var self = this
      if (id) {
        this.$axios
          .get(`/api/submissions/${id}/`)
          .then(function (response) {
            console.log('response', response)
            if (!response.data.sample_data) {
              response.data.sample_data = []
            }
            self.submission = response.data
            Vue.set(self.submission, 'type', response.data.type.id)
          })
      } else {
        Vue.set(this, 'submission', {'sample_data': [], 'contacts': [], biocore: false})
      }
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
    copySubmitter () {
      Vue.set(this.submission, 'pi_name', this.submission.name)
      Vue.set(this.submission, 'pi_email', this.submission.email)
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
    }
    // type_options () {
    //   return this.submission_types.map(opt => ({label: opt.name, value: opt.id}))
    // }

  },
  components: {
    Agschema,
    CustomFields
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

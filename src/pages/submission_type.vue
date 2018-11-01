<template>
  <q-page padding class="docs-input row justify-center">
    <q-card style="width:100%">
      <q-card-title>
        Submission Type <q-btn @click="delete_type" color="negative" label="Delete" class="float-right" v-if="type.submission_count === 0"/><router-link :to="{'name': 'submissions', 'query': { 'search': type.name }}" class="float-right" v-else>{{type.submission_count}} Submissions</router-link>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field
          label="Name"
          helper="This shows up in the dropdown on the submission form"
          :error="errors.name"
          :error-label="errors.name"
        >
          <q-input v-model="type.name" type="text"/>
        </q-field>
        <q-field
          label="Description"
          :error="errors.description"
          :error-label="errors.description"
        >
          <q-input v-model="type.description" type="textarea"/>
        </q-field>
        <h6>Submission Fields</h6>
        <table v-if="type.schema" style="width:100%">
          <tr><th></th><th>Required</th><th>Variable</th><th>Name</th><th>Type</th><th></th></tr>
          <tr v-for="variable in submission_fields_sorted" :key="variable.variable">
            <td><q-btn flat dense round icon="arrow_upward" color="primary" @click="move(variable.variable, -1, 'schema')" v-if="type.schema.order && type.schema.order.indexOf(variable.variable) != 0"/> <q-btn flat dense round icon="arrow_downward" color="primary" @click="move(variable.variable, 1, 'schema')" v-if="type.schema.order && type.schema.order.indexOf(variable.variable) != type.schema.order.length - 1"/>
            <td><q-checkbox v-model="type.schema.required" :val="variable.variable"/></td>
            <td>{{variable.variable}}</td>
            <td><q-input v-model="variable.schema.title" /></td>
            <td>
              <q-select
                v-model="variable.schema.type"
                :options="type_options"
              />
            </td>
            <td class="row">
              <fieldoptions v-model="type.schema.properties[variable.variable]" :variable="variable.variable" type="submission"/> <q-btn label="Delete" color="negative" @click="deleteVariable(variable.variable, 'schema')"></q-btn>
            </td>
          </tr>
        </table>
        <q-btn
          color="positive"
          @click="openModal('schema')"
          label="Add"
        />
        <h5>Samplesheet definition</h5>
        <h6>Column Definitions</h6>
        <div v-if="type && type.sample_schema && type.sample_schema.properties">
          <Agschema v-model="type.examples" :type="type" :editable="true"  ref="samplesheet"/>
          <q-btn :label="'Examples ('+type.examples.length+')'"  @click="openExamples"/>
        </div>
        <table v-if="type.sample_schema" style="width:100%">
          <tr><th></th><th>Required</th><th>Variable</th><th>Name</th><th>Type</th><th></th></tr>
          <tr v-for="variable in sample_fields_sorted" :key="variable.variable">
            <td><q-btn flat dense round icon="arrow_upward" color="primary" @click="move(variable.variable, -1, 'sample_schema')" v-if="type.sample_schema.order && type.sample_schema.order.indexOf(variable.variable) != 0"/> <q-btn flat dense round icon="arrow_downward" color="primary" @click="move(variable.variable, 1, 'sample_schema')" v-if="type.sample_schema.order && type.sample_schema.order.indexOf(variable.variable) != type.sample_schema.order.length - 1"/>
            <td><q-checkbox v-model="type.sample_schema.required" :val="variable.variable"/></td>
            <td>{{variable.variable}}</td>
            <td><q-input v-model="variable.schema.title" /></td>
            <td>
              <q-select
                v-model="variable.schema.type"
                :options="type_options"
              />
            </td>
            <td class="row">
              <fieldoptions v-model="type.sample_schema.properties[variable.variable]" :variable="variable.variable" type="sample"/> <q-btn label="Delete" color="negative" @click="deleteVariable(variable.variable, 'sample_schema')"></q-btn>
            </td>
          </tr>
        </table>
        <q-btn
          color="positive"
          @click="openModal('sample_schema')"
          label="Add"
        />
        <q-field
          label="Help"
          :error="errors.help"
          :error-label="errors.help"
        >
          <q-editor v-model="type.help"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
              ['token', 'hr', 'link', 'custom_btn'],
              ['print', 'fullscreen'],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
              ['undo', 'redo'],
              ['table']
            ]"
          />
        </q-field>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn @click="submit" label="Save" color="primary"></q-btn>
      </q-card-actions>

    </q-card>
    <q-modal v-model="variable_modal" :content-css="{minWidth: '30vw', minHeight: '30vh'}" ref="modal">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Add a variable
          </q-toolbar-title>
        </q-toolbar>
      <div class="layout-padding">
        <q-field label="Type">
            <q-select
              v-model="new_variable.type"
              :options="type_options"
            />
        </q-field>
        <q-field label="Variable Name" :error="variableError(new_variable.name)" :error-label="variableMessage(new_variable.name)">
            <q-input
              v-model="new_variable.name"
            />
        </q-field>
      </div>
      <q-toolbar slot="footer">
        <q-toolbar-title>
          <q-btn
            color="positive"
            @click="addVariable()"
            label="Add"
            :disable="variableError(new_variable.name) || !new_variable.name || !new_variable.type"
          />
          <q-btn
            @click="variable_modal = false"
            label="Cancel"
            color="negative"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-modal-layout>
    </q-modal>
  </q-page>

</template>

<script>
import '../components/forms/docs-input.styl'
// import axios from 'axios'
import Fieldoptions from '../components/fieldoptions.vue'
import Vue from 'vue'
import Agschema from '../components/agschema.vue'
export default {
  name: 'submission_type',
  props: ['id'],
  data () {
    return {
      type: {help: '', examples: [], schema: {properties: {}, order: [], required: []}, sample_schema: {properties: {}, order: [], required: []}},
      errors: {},
      type_options: [{ 'label': 'Text', 'value': 'string' }, { 'label': 'Number', 'value': 'number' }, { 'label': 'True / False', 'value': 'boolean' }],
      schema: [],
      new_variable: {},
      variable_modal: false,
      examples: []
    }
  },
  mounted: function () {
    var self = this
    if (!this.id || this.id === 'create') {
      this.create = true
    } else {
      this.$axios
        .get('/api/submission_types/' + self.id + '/')
        .then(function (response) {
          self.type = response.data
          if (!self.type.examples) {
            self.type.examples = []
          }
        })
    }
  },
  methods: {
    openModal (schema) {
      this.new_variable = {schema: schema}
      this.variable_modal = true
    },
    openExamples () {
      this.$refs.samplesheet.openSamplesheet()
    },
    variableError (name) {
      return this.variableMessage(name) !== null
    },
    variableMessage (name, schema) {
      if (name && this.type && this.type[schema]) {
        for (var n in this.type[schema].properties) {
          if (n.toLowerCase() === name.toLowerCase()) {
            return 'That variable name exists'
          }
        }
      }
      return null
    },
    addVariable () {
      Vue.set(this.type[this.new_variable.schema].properties, this.new_variable.name, {type: this.new_variable.type, unique: false})
      this.type[this.new_variable.schema].order.push(this.new_variable.name)
      // // this.type.schema.properties['VARIABLE_NAME'] = {added: true}
      // console.log(this.type.schema.properties)
      this.variable_modal = false
    },
    move (variable, displacement, schema) {
      console.log('moveUp', variable)
      var index = this.type[schema].order.indexOf(variable)
      this.type[schema].order.splice(index + displacement, 0, this.type[schema].order.splice(index, 1)[0])
    },
    deleteVariable (variable, schema) {
      var self = this
      this.$q.dialog({
        title: 'Confirm variable deletion',
        message: 'Are you sure you want to delete the variable "' + variable + '"?',
        ok: 'Okay',
        cancel: 'Cancel'
      }).then(() => {
        if (self.type[schema].order) {
          var index = self.type[schema].order.indexOf(variable)
          if (index) {
            self.type[schema].order.splice(index, 1)
          }
        }
        Vue.delete(this.type[schema].properties, variable)
        self.$q.notify({message: 'Variable "' + variable + '" deleted.', type: 'negative'})
      })
    },
    submit () {
      var self = this
      var id = this.id
      var action = !this.create ? 'put' : 'post'
      var url = !this.create ? '/api/submission_types/' + id + '/' : '/api/submission_types/'
      this.errors = {}
      this.$axios[action](url, this.type)
        .then(function (response) {
          console.log(response)
          self.$q.notify({message: 'Submission type successfully saved.', type: 'positive'})
          if (self.create) {
            self.$router.push({name: 'submission_type', params: {id: response.data.id}})
          }
        })
        .catch(function (error, stuff) {
          // raise different exception if due to invalid credentials
          console.log('ERROR', error.response)
          if (error.response) {
            self.errors = error.response.data
          }
          self.$q.notify('Error saving submission type!')
        })
    },
    delete_type () {
      var self = this
      if (this.type.id && this.type.submission_count === 0) {
        this.$axios.delete(`/api/submission_types/${this.type.id}/`)
          .then(function (response) {
            self.$router.push({name: 'submission_types'})
          })
          .catch(function () {
            self.$q.notify('Error deleting submission type!')
          })
      }
    },
    fields_sorted (schema) {
      var self = this
      if (!self.type[schema]) {
        return []
      }
      if (self.type[schema].order) {
        return self.type[schema].order.map(function (variable) {
          return {'variable': variable, 'schema': self.type[schema].properties[variable]}
        })
      }
      // return this.submission_types.map(opt => ({label: opt.name, value: opt.id}))
    }
    // removeOptions (property) {
    //   console.log(property)
    //   // delete property.enum
    //   property.enum = null
    //   delete property.enum
    //   console.log(property)
    // },
    // useOptions (property) {
    //   property.enum = []
    // }
  },
  // watch: {
  //   'submission.type': function (newType) {
  //     console.log('type changed', newType)
  //     for (var i in this.submission_types) {
  //       if (this.submission_types[i].id === newType) {
  //         console.log('type', this.submission_types[i])
  //         this.schema = this.submission_types[i].sample_schema
  //       }
  //     }
  //   }
  // },
  computed: {
    error_message (field) {
      return this.errors[field]
    },
    sample_fields_sorted () {
      return this.fields_sorted('sample_schema')
      // return this.submission_types.map(opt => ({label: opt.name, value: opt.id}))
    },
    submission_fields_sorted () {
      // return []
      console.log('submission_fields_sorted', this.fields_sorted('schema'), this.type['schema'])
      return this.fields_sorted('schema')
      // return this.submission_types.map(opt => ({label: opt.name, value: opt.id}))
    }

  },
  components: {
    Fieldoptions,
    Agschema
  }
}
</script>

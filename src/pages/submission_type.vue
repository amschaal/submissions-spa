<template>
  <q-page padding class="docs-input row justify-center">
    <q-card style="width:100%">
      <q-card-title>
        Submission Type
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
        <h6>Column Definitions</h6>
        <table v-if="type.schema" style="width:100%">
          <tr><th>Required</th><th>Variable</th><th>Type</th><th></th></tr>
          <tr v-for="(p, variable) in type.schema.properties" :key="variable">
            <td><q-checkbox v-model="type.schema.required" :val="variable"/></td>
            <td>{{variable}}</td>
            <td>
              <q-select
                v-model="p.type"
                :options="type_options"
              />
            </td>
            <td class="row">
              <fieldoptions v-model="type.schema.properties[variable]" :variable="variable"/> <q-btn label="Delete" color="negative" @click="deleteVariable(variable)"></q-btn>
            </td>
          </tr>
        </table>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn @click="openModal" label="Add Variable" color="positive"></q-btn> <q-btn @click="submit" label="Save" color="primary"></q-btn>
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
            @click="addVariable"
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
export default {
  name: 'submission_type',
  props: ['id'],
  data () {
    return {
      type: {},
      errors: {},
      type_options: [{ 'label': 'Text', 'value': 'string' }, { 'label': 'Number', 'value': 'number' }, { 'label': 'True / False', 'value': 'boolean' }],
      schema: [],
      new_variable: {},
      variable_modal: false
    }
  },
  mounted: function () {
    var self = this
    this.$axios
      .get('/api/submission_types/' + self.id + '/')
      .then(function (response) {
        self.type = response.data
      })
  },
  methods: {
    openModal () {
      this.new_variable = {}
      this.variable_modal = true
    },
    variableError (name) {
      return this.variableMessage(name) !== null
    },
    variableMessage (name) {
      if (name) {
        for (var n in this.type.schema.properties) {
          if (n.toLowerCase() === name.toLowerCase()) {
            return 'That variable name exists'
          }
        }
      }
      return null
    },
    addVariable () {
      Vue.set(this.type.schema.properties, this.new_variable.name, {type: this.new_variable.type})
      // // this.type.schema.properties['VARIABLE_NAME'] = {added: true}
      // console.log(this.type.schema.properties)
      this.variable_modal = false
    },
    deleteVariable (variable) {
      var self = this
      this.$q.dialog({
        title: 'Confirm variable deletion',
        message: 'Are you sure you want to delete the variable "' + variable + '"?',
        ok: 'Okay',
        cancel: 'Cancel'
      }).then(() => {
        Vue.delete(this.type.schema.properties, variable)
        self.$q.notify({message: 'Variable "' + variable + '" deleted.', type: 'negative'})
      })
    },
    submit () {
      var self = this
      var id = this.id
      var action = id ? 'put' : 'post'
      var url = id ? '/api/submission_types/' + id + '/' : '/api/submission_types/'
      this.$axios[action](url, this.type)
        .then(function (response) {
          console.log(response)
          self.$q.notify({message: 'Submission type successfully saved.', type: 'positive'})
        })
        .catch(function (error, stuff) {
          // raise different exception if due to invalid credentials
          console.log('ERROR', error.response)
          if (error.response) {
            self.errors = error.response.data.errors
          }
          self.$q.notify('Error saving submission type!')
        })
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
    Fieldoptions
  }
}
</script>

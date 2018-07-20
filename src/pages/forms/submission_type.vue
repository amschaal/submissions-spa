<template>
  <q-page padding class="docs-input row justify-center">
    <q-card style="width:100%">
      <q-card-title>
        Submission Type
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        {{id}}
        {{errors}}
        {{type}}
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
        <h6>Column Definitions</h6>
        <table v-if="type.schema" style="width:100%">
          <tr><th>Variable</th><th>Type</th><th>Regex</th><th></th></tr>
          <tr v-for="(p, variable) in type.schema.properties" :key="variable">
            <td>{{variable}}</td>
            <td>
              <q-select
                v-model="p.type"
                :options="type_options"
              />
            </td>
            <td><q-input v-model="p.pattern" type="text"/></td>
            <td><fieldoptions v-model="p.options"/></td>
          </tr>
        </table>
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
import Fieldoptions from '../../components/fieldoptions.vue'

export default {
  name: 'submission_type',
  props: ['id'],
  data () {
    return {
      type: {},
      errors: {},
      type_options: [{ 'label': 'Text', 'value': 'string' }, { 'label': 'Number', 'value': 'number' }, { 'label': 'True / False', 'value': 'boolean' }],
      schema: []
    }
  },
  mounted: function () {
    var self = this
    axios
      .get('http://127.0.0.1:8002/api/submission_types/' + self.id + '/')
      .then(function (response) {
        self.type = response.data
      })
  },
  methods: {
    submit () {
      var self = this
      var id = this.id
      var action = id ? 'put' : 'post'
      var url = id ? '/api/submission_types/' + id + '/' : '/api/submission_types/'
      axios[action]('http://127.0.0.1:8002' + url, this.type)
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

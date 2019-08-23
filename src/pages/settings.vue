<template>
  <q-page padding>
    <q-field
      label="Select Lab"
      label-width="2"
    >
      <q-select
        v-model="lab"
        :options="labOptions"
      />
    </q-field>
    <div v-if="lab">
      <q-field
        label="Home Page"
        label-width="2"
      >
        <q-editor v-model="lab.home_page"
        :toolbar="[
      ['bold', 'italic', 'strike', 'underline'],
      ['token', 'link', 'custom_btn'],
      ['print', 'fullscreen'],
      [
        {
          label: $q.i18n.editor.formatting,
          icon: $q.icon.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
        },
        'removeFormat'
      ],
      ['quote', 'unordered', 'ordered'],
      [
        {
          label: $q.i18n.editor.align,
          icon: $q.icon.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
      ],
      ['undo', 'redo']
    ]"
        />
      </q-field>
      <h5>Submission variables</h5>
      <schemaForm v-model="lab.submission_variables" :options="{variables: lab.sample_variables}"/>
      <h5>Sample variables</h5>
      <schemaForm v-model="lab.sample_variables" :options="{variables: lab.submission_variables}"/>
      <q-card-actions>
        <q-btn @click="save" label="Save"></q-btn>
      </q-card-actions>
    </div>
  </q-page>
</template>

<script>
import schemaForm from '../components/forms/schemaForm.vue'
export default {
  name: 'settings',
  data () {
    return {
      lab: null,
      settings: null,
      labs: [],
      submission_variables: {},
      sample_variables: {}
    }
  },
  methods: {
    getLab (lab) {
      this.lab = lab // this.labs[index]
    },
    save () {
      var self = this
      if (this.lab.id) {
        this.$axios
          .put(`/api/labs/${this.lab.id}/`, this.lab)
          .then(({ data }) => {
            if (data.id === self.default_lab.id) {
              // self.default_lab = data
              self.$store.commit('lab', data)
            }
            self.$q.notify({message: `Settings saved for ${data.name}`, type: 'positive'})
          })
          .catch(error => {
            self.$q.notify({message: `Error: unable to save settings`, type: 'negative'})
            console.log('error', error)
          })
      }
    }
  },
  mounted () {
    var self = this
    this.$axios
      .get(`/api/labs/`)
      .then(({ data }) => {
        console.log('data', data)
        self.labs = data.results
        if (self.labs.length === 1) {
          self.lab_id = self.labs[0].id
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  computed: {
    default_lab () {
      return this.$store.getters.lab
    },
    labOptions () {
      return this.labs.map((l, k) => ({label: l.name, value: l}))
    }
  },
  components: {
    schemaForm
  }
}
</script>
<style>

</style>

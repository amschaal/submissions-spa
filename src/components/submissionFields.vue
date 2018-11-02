<template>
  <div>
      Submission fields go here {{fields}}....
      <div v-for="v in fields" :key="v.variable">
        <q-field
          :error="errors && errors[v.variable]"
          :error-label="errors ? errors[v.variable] : ''"
        >
          <q-input v-model="value[v.variable]" type="text" :stack-label="v.schema.title ? v.schema.title : v.variable"/>
        </q-field>
    </div>
  </div>
</template>

<script>
import { QSelect } from 'quasar'
// import _ from 'lodash'

export default {
  props: ['value', 'type', 'editable', 'errors'],
  data () {
    return {
      data: this.value ? this.value : {}
    }
  },
  methods: {

  },
  computed: {
    fields () {
      var self = this
      if (!self.type.schema) {
        return []
      }
      if (self.type.schema.order) {
        return self.type.schema.order.map(function (variable) {
          return {'variable': variable, 'schema': self.type.schema.properties[variable]}
        })
      }
    }
  },
  components: {
    QSelect
  },
  watch: {
  }
}
</script>

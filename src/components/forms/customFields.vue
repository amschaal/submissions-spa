<template>
  <div>
      <div v-for="v in fields" :key="v.variable">
        {{v}}
        <q-field
          :error="errors && errors[v.variable]"
          :error-label="errors ? errors[v.variable] : ''"
        >
          <!-- <q-input v-model="value[v.variable]" type="text" :stack-label="v.schema.title ? v.schema.title : v.variable"/> -->
          <component :is="widgetClass(v).id" v-model="value[v.variable]" v-bind="{ 'type': 'text', 'stack-label': v.schema.title ? v.schema.title : v.variable }" />

        </q-field>
    </div>
  </div>
</template>

<script>
import widgetFactory from '../forms/widgets.js'
import { QSelect } from 'quasar'
// import _ from 'lodash'

export default {
  props: ['value', 'schema', 'editable', 'errors'],
  data () {
    return {
      data: this.value ? this.value : {}
    }
  },
  methods: {
    widgetClass (v) {
      var widget = v.schema.widget ? v.schema.widget : {}
      return widgetFactory.getWidget(v.schema.type, widget.type)
    },
    widget (v) {
      var options = v.schema.widget && v.schema.widget.options ? v.schema.widget.options : {}
      var WidgetClass = this.widgetClass(v)
      return new WidgetClass(options)
    }

  },
  computed: {
    fields () {
      if (!this.schema) {
        return []
      }
      var self = this
      if (self.schema.order) {
        return self.schema.order.map(function (variable) {
          return {'variable': variable, 'schema': self.schema.properties[variable]}
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

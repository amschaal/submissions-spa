<template>
  <div class="row">
      <div v-for="v in fields" :key="v.variable" v-bind:class="colWidth(v.variable)">
        <q-field
          :error="errors && errors[v.variable]"
          :error-label="errors ? errors[v.variable] : ''"
        >
        {{widget(v).getOptions()}} {{widget(v).getDefault()}} value: "{{value[v.variable]}}"
          <!-- <q-input v-model="value[v.variable]" type="text" :stack-label="v.schema.title ? v.schema.title : v.variable"/> -->
          <component :is="widgetClass(v).id"
          :value="value[v.variable] || widget(v).getDefault()"
          @input="val => {$q.notify('input: '+val); $set(value, v.variable, val)}"
          @change="val => {$q.notify('change: '+val); $set(value, v.variable, val)}"
            v-bind="widget(v).getOptions()"
          />

<!--
v-model="value[v.variable]"
:value="value[v.variable] || widgetClass(v).default"
@change="val => { value[v.variable] = val }"
-->
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
      return new WidgetClass(v, options)
    },
    colWidth (variable) {
      return this.schema.layout[variable] && this.schema.layout[variable].width ? [this.schema.layout[variable].width] : ['col-12']
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

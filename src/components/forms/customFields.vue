<template>
  <div class="row">
      <div v-for="v in fields" :key="v.variable" class="field" v-bind:class="colWidth(v.variable)">
        <div v-if="$store.getters.isLoggedIn || !v.schema.internal">
          <span v-if="!modify">
            <p class="caption">{{v.schema.title ? v.schema.title : v.variable}}</p>

            {{widget(v).formatValue(value[v.variable])}}
          </span>
          <q-field
            v-else
            :error="errors && errors[v.variable]"
            :error-label="errors ? getError(v) : ''"
            :label="v.schema.title ? v.schema.title : v.variable"
            orientation="vertical"
          >
          <!-- {{widget(v).getOptions()}} {{widget(v).getDefault()}} value: "{{value[v.variable]}}" -->
            <!-- <q-input v-model="value[v.variable]" type="text" :stack-label="v.schema.title ? v.schema.title : v.variable"/> -->
            <component :is="widgetClass(v).component"
            :value="value[v.variable] || widget(v).getDefault()"
            @input="val => {$set(value, v.variable, val)}"
            @change="val => {$set(value, v.variable, val)}"
              v-bind="widget(v).getOptions()"

            />

  <!--
  :stack-label="v.schema.title ? v.schema.title : v.variable"
  v-model="value[v.variable]"
  :value="value[v.variable] || widgetClass(v).default"
  @change="val => { value[v.variable] = val }"
  -->
          </q-field>
        </div>
    </div>
  </div>
</template>

<script>
import widgetFactory from '../forms/widgets.js'
import { QSelect } from 'quasar'
// import _ from 'lodash'

export default {
  props: ['value', 'schema', 'editable', 'errors', 'modify'],
  data () {
    return {
      data: this.value ? this.value : {}
    }
  },
  mounted () {
    console.log('customFields', this.schema, this.value)
  },
  methods: {
    widgetClass (v) {
      var widget = v.schema.widget ? v.schema.widget : {}
      console.log('widgetClass', v, widget)
      return widgetFactory.getWidget(widget.type, v.schema.type)
    },
    widget (v) {
      var options = v.schema.widget && v.schema.widget.options ? v.schema.widget.options : {}
      var WidgetClass = this.widgetClass(v)
      return new WidgetClass(v, options)
    },
    colWidth (variable) {
      return this.schema.layout[variable] && this.schema.layout[variable].width ? [this.schema.layout[variable].width] : ['col-12']
    },
    getError (v) {
      return v.schema.error_message || this.errors[v.variable]
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
      return []
    }
  },
  components: {
    QSelect
  },
  watch: {
  }
}
</script>
<style>
.q-field {
  padding: 3px !important;
}
</style>

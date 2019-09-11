// import _ from 'lodash'
import AutocompleteComponent from './editors/AutocompleteComponent.vue'
import DateComponent from './editors/DateComponent.vue'
import BooleanComponent from './editors/BooleanComponent.vue'
class Widget {
  defaultValue = null
  constructor (variable, options) {
    this.variable = variable
    this.options = options || {}
  }
  /*
  static schema = {
                      'required': [
                        'organism'
                      ],
                      'order': [
                        'organism',
                        'extra_pipeline'
                      ],
                      'properties': {
                        'extra_pipeline': {
                          'validators': [],
                          'unique': false,
                          'enum': [
                            'Special pipeline A',
                            'Special pipeline B',
                            'Special pipeline C'
                          ],
                          'type': 'string',
                          'title': 'Pipeline'
                        },
                        'organism': {
                          'unique': false,
                          'type': 'string',
                          'title': 'Organism name'
                        }
                      }
                    }
  */
  getType () {
    return this.type
  }
  validate () {
    // TODO: use JSON schema to validate this.options against schema
    return true
  }
  // getOptions () {
  //   return _.merge(this.options, {'stack-label': this.variable.schema.title || this.variable.variable})
  // }
  getDefault () {
    return this.defaultValue
  }
  // formatValue (value) {
  //   if (value instanceof Array) {
  //     return value.join(', ')
  //   }
  //   return value
  // }
}

class EnumWidget extends Widget {
  defaultValue = []
  // getOptions () {
  //   return _.merge(this.options, this.getSelectOptions())
  // }
  // getSelectOptions () {
  //   var options = this.variable.schema.enum || []
  //   return {options: options.map(function (val) { return {'label': val, 'value': val} })}
  // }
}

class DateWidget extends Widget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'string'
  static id = 'date'
  static component = DateComponent
  static name = 'Date'
  static schema =
  {
    'foo': {'widget': 'q-input', 'label': 'Foo'}
  }
}

class BooleanWidget extends Widget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'boolean'
  static id = 'boolean'
  static component = BooleanComponent
  static name = 'Checkbox'
  static schema = {
  }
}

class AutocompleteWidget extends EnumWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'string'
  static id = 'autocomplete'
  static component = AutocompleteComponent
  static name = 'Autocomplete'
  static schema = {
  }
}

class WidgetFactory {
  constructor (widgets) {
    this.widgets = widgets
    this.type_lookup = {}
    this.defaults = {}
    this.lookup = {}
    var self = this
    widgets.forEach(function (widget, index) {
      if (!self.type_lookup[widget.type]) {
        self.type_lookup[widget.type] = []
      }
      self.type_lookup[widget.type].push(widget)
      self.lookup[widget.id] = widget
      if (widget.default) {
        self.defaults[widget.type] = widget
      }
    })
  }
  getWidget (id) {
    return this.lookup[id]
    // console.log('getWidget', type, id)
    // if (id && this.lookup[id]) {
    //   return this.lookup[id]
    // } else if (type && this.defaults[type]) {
    //   return this.defaults[type]
    // } else {
    //   return this.defaults['string']
    // }
  }
  getWidgetSchema (id) {
    return this.lookup[id] ? this.lookup[id].schema : {}
  }
  getWidgetOptions (type) {
    if (!type || !this.type_lookup[type]) {
      return []
    }
    return this.type_lookup[type].map(widget => ({ label: widget.name, value: widget.id }))
  }
}

var widgetFactory = new WidgetFactory([DateWidget, BooleanWidget, AutocompleteWidget])

export default widgetFactory

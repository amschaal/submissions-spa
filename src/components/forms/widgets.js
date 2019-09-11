import _ from 'lodash'

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
  getOptions () {
    return _.merge(this.options, {'stack-label': this.variable.schema.title || this.variable.variable})
  }
  getDefault () {
    return this.defaultValue
  }
  formatValue (value) {
    if (value instanceof Array) {
      return value.join(', ')
    }
    return value
  }
}

class TextWidget extends Widget {
  static type = 'string'
  static id = 'input'
  static component = 'q-input'
  static name = 'Text input'
  static default = true
  static schema = {
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
}

class WYSIWYGWidget extends Widget {
  static type = 'string'
  static id = 'wysiwyg'
  static component = 'q-editor'
  static name = 'WYSIWYG'
  defaultValue = ''
  static schema = {
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
}

class CheckboxWidget extends Widget {
  static type = 'boolean'
  static id = 'checkbox'
  static component = 'q-checkbox'
  static name = 'Checkbox'
  static default = true
  defaultValue = false
}

class EnumWidget extends Widget {
  defaultValue = []
  getOptions () {
    return _.merge(this.options, this.getSelectOptions())
  }
  getSelectOptions () {
    var options = this.variable.schema.enum || []
    return {options: options.map(function (val) { return {'label': val, 'value': val} })}
  }
}

class ChipsWidget extends EnumWidget {
  static type = 'string'
  static id = 'chips'
  static component = 'q-chips-input'
  static name = 'Chips Input'
  static schema = {
  }
  // static defaultValue = []
}
class SelectWidget extends EnumWidget {
  static type = 'string'
  static id = 'select'
  static component = 'q-select'
  static name = 'Select Input'
  static schema = {
  }
  getOptions () {
    return _.merge(this.options, this.getSelectOptions(), {clearable: true})
  }
}
class RadioWidget extends EnumWidget {
  defaultValue = null
  static type = 'string'
  static id = 'radio'
  static component = 'q-option-group'
  static name = 'Radio Select'
  static schema = {
  }
  getOptions () {
    return _.merge(this.options, this.getSelectOptions(), {type: 'radio', inline: true})
  }
}
class MultiCheckboxWidget extends RadioWidget {
  defaultValue = []
  static id = 'multicheck'
  static name = 'Multi Checkbox'
  static schema = {
  }
  getOptions () {
    return _.merge(this.options, this.getSelectOptions(), {type: 'checkbox', inline: true})
  }
}

class AutocompleteWidget extends EnumWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'string'
  static id = 'autocomplete'
  static component = 'q-autocomplete'
  static name = 'Autocomplete'
  static schema = {
  }
  getStaticData () {
    var staticData = this.variable.schema.enum || []
    return {field: 'value', list: staticData.map(function (val) { return {'label': val, 'value': val} })}
  }
  getOptions () {
    return _.merge(this.options, {'static-data': this.getStaticData(), clearable: true})
  }
}
class MultiSelectWidget extends SelectWidget {
  static id = 'multi-select'
  static component = 'q-select'
  static name = 'MultiSelect'
  getOptions () {
    return _.merge(this.options, this.getSelectOptions(), {multiple: true, clearable: true})
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
  getWidgetSchema (id) {
    return this.lookup[id] ? this.lookup[id].schema : {}
  }
  getWidget (type, id) {
    console.log('getWidget', type, id)
    if (id && this.lookup[id]) {
      return this.lookup[id]
    } else if (type && this.defaults[type]) {
      return this.defaults[type]
    } else {
      return this.defaults['string']
    }
  }
  getWidgetOptions (type) {
    if (!type || !this.type_lookup[type]) {
      return []
    }
    return this.type_lookup[type].map(widget => ({ label: widget.name, value: widget.id }))
  }
}

var widgetFactory = new WidgetFactory([TextWidget, WYSIWYGWidget, ChipsWidget, SelectWidget, MultiSelectWidget, CheckboxWidget, AutocompleteWidget, RadioWidget, MultiCheckboxWidget])

export default widgetFactory

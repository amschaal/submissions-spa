import _ from 'lodash'

class Widget {
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
}

class TextWidget extends Widget {
  static type = 'string'
  static id = 'q-input'
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
  static id = 'q-editor'
  static name = 'WYSIWYG'
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

class EnumWidget extends Widget {
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
  static id = 'q-chips-input'
  static name = 'Chips Input'
  static schema = {
  }
}
class SelectWidget extends EnumWidget {
  static type = 'string'
  static id = 'q-select'
  static name = 'Select Input'
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

var widgetFactory = new WidgetFactory([TextWidget, WYSIWYGWidget, ChipsWidget, SelectWidget])

export default widgetFactory

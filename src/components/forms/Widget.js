import _ from 'lodash'

export class Widget {
  defaultValue = null
  constructor (variable, options) {
    this.variable = variable
    this.options = options || {}
  }
  static schema = [
    // {'variable': 'test', 'label': 'Test', 'type': 'text'}
  ]
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

export class WidgetFactory {
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
  getWidget (id, type) {
    console.log('getWidget', id, type, this.lookup)
    if (id && this.lookup[id]) {
      return this.lookup[id]
    } else if (type && this.defaults[type]) {
      return this.defaults[type]
    } else {
      return this.defaults['string']
    }
  }
  getWidgets (type) {
    if (!type || !this.type_lookup[type]) {
      return []
    }
    return this.type_lookup[type].map(widget => ({ label: widget.name, value: widget.id }))
  }
}

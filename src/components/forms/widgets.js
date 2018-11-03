
class Widget {
  constructor (options) {
    this.options = options
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

var widgetFactory = new WidgetFactory([TextWidget, WYSIWYGWidget])

export default widgetFactory

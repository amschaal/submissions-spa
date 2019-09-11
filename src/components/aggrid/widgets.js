// import _ from 'lodash'
import AutocompleteComponent from './editors/AutocompleteComponent.vue'
import DateComponent from './editors/DateComponent.vue'
import BooleanComponent from './editors/BooleanComponent.vue'
import {Widget, WidgetFactory} from '../forms/WidgetFactory.js'

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
  [
    {'variable': 'foo', 'label': 'Foo', 'type': 'text'},
    {'variable': 'bar', 'label': 'Bar', 'type': 'text', 'options': [{'label': 'One', 'value': 1}, {'label': 'Two', 'value': 2}]}
  ]
}

class BooleanWidget extends Widget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'boolean'
  static id = 'boolean'
  static component = BooleanComponent
  static name = 'Checkbox'
  // static schema = {
  // }
}

class AutocompleteWidget extends EnumWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'string'
  static id = 'autocomplete'
  static component = AutocompleteComponent
  static name = 'Autocomplete'
  // static schema = {
  // }
}

var widgetFactory = new WidgetFactory([DateWidget, BooleanWidget, AutocompleteWidget])

export default widgetFactory

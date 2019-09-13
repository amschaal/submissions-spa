// import _ from 'lodash'
import AutocompleteComponent from './editors/AutocompleteComponent.vue'
import DateComponent from './editors/DateComponent.vue'
import BooleanComponent from './editors/BooleanComponent.vue'
import VocabularyComponent from './editors/VocabularyComponent.vue'
import APIAutocompleteComponent from './editors/APIAutocompleteComponent.vue'
import SelectComponent from './editors/SelectComponent.vue'
import {Widget, WidgetFactory} from '../forms/Widget.js'

class GridWidget extends Widget {
}

// class EnumWidget extends GridWidget {
//   defaultValue = []
//   // getOptions () {
//   //   return _.merge(this.options, this.getSelectOptions())
//   // }
//   // getSelectOptions () {
//   //   var options = this.variable.schema.enum || []
//   //   return {options: options.map(function (val) { return {'label': val, 'value': val} })}
//   // }
// }

class DateWidget extends GridWidget {
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

class VocabularyWidget extends GridWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'string'
  static id = 'vocabulary'
  static component = VocabularyComponent
  static name = 'Vocabulary Autocomplete'
  static schema =
  [
    {'variable': 'vocabulary', 'label': 'Vocabulary ID', 'type': 'text'},
    {'variable': 'vocabulary_variable', 'label': 'Variable specifying vocabulary', 'type': 'text'}
    // {'variable': 'bar', 'label': 'Bar', 'type': 'text', 'options': [{'label': 'One', 'value': 1}, {'label': 'Two', 'value': 2}]}
  ]
}

class APIAutocompleteWidget extends GridWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'string'
  static id = 'api_autocomplete'
  static component = APIAutocompleteComponent
  static name = 'API Autocomplete'
  static schema =
  [
    {'variable': 'url', 'label': 'API URL', 'type': 'text'},
    {'variable': 'params', 'label': 'Additional query parameters', 'type': 'text'},
    {'variable': 'value_property', 'label': 'Value property', 'type': 'text'},
    {'variable': 'label_property', 'label': 'Label property', 'type': 'text'}
  ]
}

class APISelectWidget extends APIAutocompleteWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  // static type = 'string'
  static id = 'api_select'
  static component = SelectComponent
  static name = 'API Select'
  // static schema =
  // [
  //   {'variable': 'url', 'label': 'API URL', 'type': 'text'},
  //   {'variable': 'params', 'label': 'Additional query parameters', 'type': 'text'},
  //   {'variable': 'value_property', 'label': 'Value property', 'type': 'text'},
  //   {'variable': 'label_property', 'label': 'Label property', 'type': 'text'}
  // ]
}

class BooleanWidget extends GridWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'boolean'
  static id = 'boolean'
  static component = BooleanComponent
  static name = 'Checkbox'
  // static schema = {
  // }
}

class AutocompleteWidget extends GridWidget {
  // @TODO: wrap this in another component as in the guide https://quasar-framework.org/components/autocomplete.html
  static type = 'string'
  static id = 'autocomplete'
  static component = AutocompleteComponent
  static name = 'Autocomplete'
  // static schema = {
  // }
}

var widgetFactory = new WidgetFactory([DateWidget, BooleanWidget, AutocompleteWidget, VocabularyWidget, APIAutocompleteWidget, APISelectWidget])

export default widgetFactory

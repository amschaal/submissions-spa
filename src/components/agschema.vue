<template>
  <div>
    <!-- <HotTable :settings="settings"></HotTable> -->
    <!-- <q-select :value="value" :options="options" @change="handleChange" filter filter-placeholder="select"/> -->
    <q-modal v-model="opened" :content-css="{minWidth: '90vw', minHeight: '90vh'}" ref="modal" no-backdrop-dismiss no-esc-dismiss :maximized="maximized">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Samplesheet ({{type.name}}) <span class="float-right">{{rootNode.allChildrenCount}} samples <q-btn color="white" text-color="dark" label="Maximize" @click="maximized=true" v-if="!maximized"/><q-btn color="white" text-color="dark" label="Minimize" @click="maximized=false" v-if="maximized"/></span>
          </q-toolbar-title>
        </q-toolbar>

        <!-- <q-toolbar slot="header">
        </q-toolbar> -->

        <div style="height:100%">
          <!-- {{type}} -->
          <q-btn
            color="primary"
            @click="show_help = true"
            label="Help"
            icon="fas fa-question-circle"
            v-if="type.help"
          />
          <q-checkbox v-model="showDescriptions" label="Show descriptions"/> <q-checkbox v-model="showExamples" label="Show examples" v-if="allowExamples"/>
          <ag-grid-vue style="width: 100%; max-height: 400px;" class="ag-theme-balham"
            domLayout='autoHeight'
            rowSelection='multiple'
            :enableColResize='true'
            :enableSorting='true'
            :gridOptions='gridOptions'
            :rowData='rowData'
            :columnDefs='columnDefs'
            :ref="'grid'"
            :pinnedTopRowData="getExampleRows"
            >
          </ag-grid-vue>
        </div>
        <q-toolbar slot="footer">
          <q-toolbar-title v-if="editable">
            <q-btn-dropdown split label="Add row" @click="addRow(1)" color="positive">
              <!-- dropdown content -->
              <q-list link>
                <q-item v-close-overlay @click.native="addRow(10)">
                  <q-item-main>
                    <q-item-tile label>Add 10</q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item v-close-overlay @click.native="addRow(25)">
                  <q-item-main>
                    <q-item-tile label>Add 25</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <!-- <q-btn
              color="positive"
              label="Add Row"
              @click="addRow"
            /> -->
            <q-btn
              color="negative"
              label="Remove selected rows"
              @click="removeRows"
            />
            <q-btn
              label="Validate"
              @click="validate(false)"
            />
            <q-btn
              color="negative"
              label="Discard"
              @click="close"
              class="float-right"
            />
            <q-btn
              color="positive"
              label="Keep Changes"
              @click="validate(true)"
              class="float-right"
            />
          </q-toolbar-title>
          <q-toolbar-title v-else>
            <q-btn
              color="negative"
              label="Close"
              @click="close"
              class="float-right"
            />
          </q-toolbar-title>
        </q-toolbar>
      </q-modal-layout>
    </q-modal>
    <q-modal v-model="show_help">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Help
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <div v-html="type.help" v-if="type.help"></div>
          <q-btn
            color="primary"
            @click="show_help = false"
            label="Close"
          />
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>
<!-- <link type="text/css" rel="stylesheet" href="https://docs.handsontable.com/4.0.0/components/handsontable/dist/handsontable.full.min.css"> -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/ajv/6.5.2/ajv.bundle.js"></script> -->

<!-- <script src='../assets/hot/handsontable.full.min.js'></script>
<script src='/statics/hot-schema/example_schema.js'></script>
<script src='/statics/hot-schema/hotschema.js'></script> -->

<script>
import { QSelect } from 'quasar'
import { AgGridVue } from 'ag-grid-vue'
import '../../node_modules/ag-grid/dist/styles/ag-grid.css'
import '../../node_modules/ag-grid/dist/styles/ag-theme-balham.css'
import 'ag-grid-enterprise/main'
import NumericComponent from './aggrid/editors/NumericComponent.vue'
// import DateComponent from './aggrid/DateComponent.vue'
// import AutocompleteComponent from './aggrid/editors/AutocompleteComponent.vue'
import BooleanComponent from './aggrid/editors/BooleanComponent.vue'
import _ from 'lodash'

// import { ClipboardService } from '../../node_modules/ag-grid-enterprise/dist/lib/clipboardService.js'
// import axios from 'axios'
// var clipboardService = null

export default {
  props: ['value', 'type', 'editable', 'allowExamples'],
  data () {
    return {
      opened: false,
      show_help: false,
      showExamples: this.allowExamples,
      showDescriptions: true,
      // exampleRows: [], // [{}, {}],
      columnDefs: [
        {headerName: 'Make', field: 'make'},
        {headerName: 'Model', field: 'model'},
        {headerName: 'Price', field: 'price'}
      ],
      rowData: this.value,
      rootNode: {},
      gridOptions: {
        enableRangeSelection: true,
        defaultColDef: {
          editable: this.editable
        },
        getRowStyle: function (params) {
          if (params.node.rowPinned) {
            return {'font-weight': 'bold'}
          }
        },
        suppressMultiRangeSelection: true,
        suppressRowClickSelection: true,
        checkboxSelection: function () { return true },
        processCellFromClipboard (params) {
          switch (params.column.colDef.dataType) {
            case 'boolean':
              if (params.value === 'true' || params.value === 'True' || params.value === true) {
                return true
              }
              return false
            case 'numeric':
              return parseFloat(params.value)
            default:
              return params.value
          }
        }
      },
      errors: {},
      maximized: false
    }
  },
  methods: {
    openSamplesheet () {
      var self = this
      this.errors = {}
      this.rowData = _.cloneDeep(this.value)
      if (!this.type || !this.type.sample_schema) {
        this.$q.dialog({
          title: 'Alert',
          message: 'Please select a submission type first.'
        })
        return
      }
      this.columnDefs = this.schema2Columns(this.type.sample_schema)
      console.log('openSamplesheet', this.rowData, this.value, this.columnDefs)
      this.$refs.modal.show().then(() => {
        if (self.value.length === 0) {
          self.addRow()
        }
        this.rootNode = this.gridOptions.api.getModel().rootNode
      })
    },
    schema2Columns (schema) {
      var columnDefs = []
      if (schema.order) {
        for (var i in schema.order) {
          columnDefs.push(this.getColDef(schema.order[i], schema.properties[schema.order[i]], schema))
        }
      } else {
        for (var prop in schema.properties) {
          if (schema.properties.hasOwnProperty(prop)) {
            columnDefs.push(this.getColDef(prop, schema.properties[prop], schema))
          }
        }
      }

      if (this.editable) {
        columnDefs[0].headerCheckboxSelection = true
        columnDefs[0].headerCheckboxSelectionFilteredOnly = true
        columnDefs[0].checkboxSelection = true
      }
      return columnDefs
    },
    getColDescriptions (schema) {
      var descriptions = {}
      for (var prop in schema.properties) {
        if (schema.properties.hasOwnProperty(prop)) {
          descriptions[prop] = schema.properties[prop].description
        }
      }
      console.log('descriptions', this.columnDefs)
      return descriptions
    },
    getColDef (id, definition, schema) {
      var self = this
      function cellClass (params) {
        // console.log('cellClass', params, self.errors)
        if (params.node.rowPinned) {
          return ['example']
        } else if (self.errors[params.rowIndex] && self.errors[params.rowIndex][params.colDef.field]) {
          return ['error']
        }
        return []
      }
      function cellTooltip (params) {
        if (self.errors[params.rowIndex] && self.errors[params.rowIndex][params.colDef.field]) {
          return self.errors[params.rowIndex][params.colDef.field].join(', ')
        }
      }
      // var cellTooltip = 'testing testing'
      console.log('definition', id, definition, schema)
      var header = id
      var tooltip = null
      if (definition.title) {
        header = definition.title
      }
      if (schema.required && schema.required.indexOf(id) !== -1) {
        header = '*' + header
      }
      if (definition.description) {
        tooltip = definition.description
      }
      switch (definition.type) {
        case 'string':
          if (definition.enum) {
            return {headerName: header, headerTooltip: tooltip, field: id, cellEditor: 'agRichSelectCellEditor', cellEditorParams: {values: definition.enum}, cellClass: cellClass, tooltip: cellTooltip, pinned: definition.pinned} // cellEditor: 'agRichSelectCellEditor', cellEditorParams: {values: definition.enum} // cellEditorFramework: AutocompleteComponent
          } else {
            return {headerName: header, headerTooltip: tooltip, field: id, type: 'text', cellClass: cellClass, tooltip: cellTooltip, pinned: definition.pinned}
          }
        case 'number':
          return {headerName: header, headerTooltip: tooltip, field: id, cellEditorFramework: NumericComponent, cellClass: cellClass, tooltip: cellTooltip, dataType: 'numeric', pinned: definition.pinned}
        case 'boolean':
          return {headerName: header, headerTooltip: tooltip, field: id, type: 'checkbox', cellEditorFramework: BooleanComponent, cellClass: cellClass, tooltip: cellTooltip, dataType: 'boolean', pinned: definition.pinned}
        case 'array':
          var def = {headerName: header, field: id, type: 'dropdown', cellClass: cellClass, tooltip: cellTooltip, pinned: definition.pinned}
          if (definition.items && definition.items.enum) {
            def.source = definition.items.enum
          }
          return def
        default:
          // console.log(id,definition);
          throw new Error('Unsupported type ' + definition.type)
      }
    },
    save () {
      this.$emit('input', this.getRowData(false))
      this.close()
    },
    validate (save) {
      // this.hst.validateTable(true)
      console.log('validate', save)
      var self = this
      if (this.type) {
        // this.$axios.post('/api/submission_types/' + this.type.id + '/validate_data/', {data: this.getRowData(true)})
        this.$axios.post('/api/validate/', {sample_schema: this.type.sample_schema, data: this.getRowData(true)})
          .then(function (response) {
            console.log(response)
            self.errors = {}
            self.gridOptions.api.redrawRows() // redrawCells({force: true})
            self.$q.notify({message: 'Samples successfully validated.  Please save the submission.', type: 'positive'})
            if (save) {
              self.save()
            }
          })
          .catch(function (error, stuff) {
            console.log('ERROR', error.response, self.$refs.grid, self.gridOptions.api.refreshCells)
            self.errors = error.response.data.errors
            self.gridOptions.api.redrawRows() // redrawCells({force: true})
            self.$q.notify({message: 'There were errors in your data.', type: 'negative'})

            // if (error.response) {
            //   self.errors = error.response.data.errors
            // }
          })
      }
    },
    getRowData (filterAndSort) {
      var data = []
      var method = filterAndSort ? 'forEachNodeAfterFilterAndSort' : 'forEachNode'
      if (!this.gridOptions.api) {
        return []
      }
      this.gridOptions.api[method](function (node) {
        data.push(node.data)
      })
      return data
    },
    addRow (number) {
      var rows = []
      for (var i = 0; i < number; i++) {
        rows.push({})
      }
      this.gridOptions.api.updateRowData({add: rows})
      // console.log('addRow', this.getRowData())
    },
    removeRows () {
      console.log('grid', this.gridOptions)
      var selectedData = this.gridOptions.api.getSelectedRows()
      this.gridOptions.api.updateRowData({remove: selectedData})
      // this.errors = {}
      this.gridOptions.api.redrawRows()
      // this.validate(false)
    },
    close () {
      // this.data = this.value.slice()
      this.$refs.modal.hide()
    },
    modalOpened () {
      alert('hello?')
      console.log('modal opened')
    }
    // ,
    // beforeMount () {
    //   this.gridOptions.numericComponentFramework = NumericComponent
    // }
  },
  computed: {
    sampleCount () {
      if (this.gridOptions.api) {
        return this.gridOptions.api.getModel().rootNode.allChildrenCount
      }
      return 0
      // return this.getRowData().length
    },
    getExampleRows () {
      var examples = []
      if (this.showDescriptions) {
        examples.push(this.getColDescriptions(this.type.sample_schema))
      }
      if (this.showExamples) {
        console.log('examples', this.type.examples)
        examples = examples.concat(this.type.examples)
      }
      return examples
    }
  },
  components: {
    QSelect,
    AgGridVue
  },
  watch: {
  }
}

</script>

<style>
  .ag-row .error {
    background-color: pink;
  }
  .ag-row .example {
    background-color: lightgrey !important;
  }
</style>

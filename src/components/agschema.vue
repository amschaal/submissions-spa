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
            v-if="type.sample_help"
          />
          <q-checkbox v-model="showDescriptions" label="Show descriptions" class="show_descriptions" v-if="hasDescriptions"/> <q-checkbox v-model="showExamples" label="Show examples" v-if="allowExamples && this.sample_schema.examples && sample_schema.examples.length"  class="show_examples"/>
          <q-btn-dropdown label="Resize Columns" class="float-right">
          <q-list link>
            <q-item @click.native="sizeToFit">
              <q-item-main>
                <q-item-tile label>Fit all columns</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item @click.native="autoSizeAll">
              <q-item-main>
                <q-item-tile label>Auto-size</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
                <q-item v-close-overlay @click.native="addRow(1)">
                  <q-item-main>
                    <q-item-tile label>Add 1</q-item-tile>
                  </q-item-main>
                </q-item>
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
              label="Save"
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
          <div v-html="type.sample_help" v-if="type.sample_help"></div>
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
// import { QSelect } from 'quasar'
import { AgGridVue } from 'ag-grid-vue'
import '../../node_modules/ag-grid-community/dist/styles/ag-grid.css'
import '../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
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
  props: ['value', 'type', 'schema', 'editable', 'allowExamples'],
  data () {
    return {
      opened: false,
      show_help: false,
      showExamples: this.allowExamples,
      showDescriptions: true,
      sample_schema: {},
      rowData: this.value,
      rootNode: {},
      columnDefs: [],
      gridOptions: {
        enableRangeSelection: true,
        defaultColDef: {
          editable: this.cellEditable
        },
        getRowStyle: function (params) {
          if (params.node.rowPinned) {
            return {'font-weight': 'bold'}
          }
        },
        getRowHeight: function (params) {
          console.log('getRowHeight', params, params.node.rowPinned, params.data)
          if (params.node.rowPinned === 'top' && params.data && params.data._row_type === 'description') {
            return 75
          } else {
            return 25
          }
        },
        onPinnedRowDataChanged: this.expandDescriptionRow,
        onCellFocused: this.onCellFocused,
        suppressMultiRangeSelection: true,
        suppressRowClickSelection: true,
        // checkboxSelection: function () { return true },
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
      this.sample_schema = this.schema || this.type.sample_schema
      this.columnDefs = this.schema2Columns(this.sample_schema)
      console.log('openSamplesheet', this.rowData, this.value, this.columnDefs)
      this.$refs.modal.show().then(() => {
        if (self.rowData.length === 0) {
          self.addRow()
        }
        this.rootNode = this.gridOptions.api.getModel().rootNode
      })
    },
    cellEditable (params) {
      console.log('cellEditable', this.editable, params)
      if (params.node.rowPinned === 'top') {
        this.$q.notify({position: 'top', message: 'Description and example rows are not editable.  Please use the "Add row" button for editable rows.'})
        return false
      }
      return this.editable
    },
    onCellFocused (params) {
      console.log('focused', params, this.errors)
      if (this.dismiss) {
        this.dismiss()
      }
      if (this.errors[params.rowIndex] && this.errors[params.rowIndex][params.column.colDef.field]) {
        this.dismiss = this.$q.notify({position: 'top', message: `Error at Row ${params.rowIndex + 1}, Column "${params.column.colDef.headerName}": ` + this.errors[params.rowIndex][params.column.colDef.field].join(', ')})
      }
    },
    sizeToFit () {
      this.gridOptions.api.sizeColumnsToFit()
    },
    autoSizeAll () {
      var allColIds = this.gridOptions.columnApi.getAllColumns().map(column => column.colId)
      this.gridOptions.columnApi.autoSizeColumns(allColIds)
    },
    schema2Columns (schema) {
      var columnDefs = [{field: '_row_type', hide: true}]
      if (schema.order) {
        for (var i in schema.order) {
          if (this.$store.getters.isLoggedIn || !schema.properties[schema.order[i]].internal) {
            columnDefs.push(this.getColDef(schema.order[i], schema.properties[schema.order[i]], schema))
          }
        }
      } else {
        for (var prop in schema.properties) {
          if (schema.properties.hasOwnProperty(prop) && (this.$store.getters.isLoggedIn || !schema.properties[prop].internal)) {
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
      // console.log('getColDescriptions', schema)
      var descriptions = {}
      for (var prop in schema.properties) {
        if (schema.properties.hasOwnProperty(prop)) {
          descriptions[prop] = schema.properties[prop].description
        }
      }
      // console.log('descriptions', descriptions)
      return descriptions
    },
    getColDef (id, definition, schema) {
      var self = this
      function cellClass (params) {
        console.log('cellClass', params, self.errors)
        if (params.node.rowPinned) {
          if (params.data._row_type === 'description') {
            return ['description']
          } else {
            return ['example']
          }
        } else if (self.errors[params.rowIndex] && self.errors[params.rowIndex][params.colDef.field]) {
          return ['error']
        }
        return []
      }
      function cellTooltip (params) {
        // console.log('cellTooltip', params)
        if (params.data._row_type === 'description' || params.data._row_type === 'example') {
          return params.value
        }
        if (self.errors[params.rowIndex] && self.errors[params.rowIndex][params.colDef.field]) {
          return self.errors[params.rowIndex][params.colDef.field].join(', ')
        }
        return params.value
      }
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
        this.$axios.post('/api/validate/', {sample_schema: this.sample_schema, data: this.getRowData(true)})
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
      this.$refs.modal.hide()
    },
    modalOpened () {
      alert('hello?')
      console.log('modal opened')
    },
    expandDescriptionRow (params) {
      console.log('expandDescriptionRow', params, params.api, params.api.getPinnedTopRow(0)) //
      params.api.getPinnedTopRow(0).isDescription = true
      params.api.onRowHeightChanged()
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
    hasDescriptions () {
      for (var prop in this.sample_schema.properties) {
        if (this.sample_schema.properties.hasOwnProperty(prop)) {
          if (this.sample_schema.properties[prop].description) {
            return true
          }
        }
      }
      return false
    },
    getExampleRows () {
      var examples = []
      if (this.showDescriptions && this.hasDescriptions) {
        var descriptions = this.getColDescriptions(this.sample_schema)
        descriptions._row_type = 'description'
        examples.push(descriptions)
      }
      if (this.showExamples) {
        for (var i in this.sample_schema.examples) {
          var example = this.sample_schema.examples[i]
          example['_row_type'] = 'example'
          examples.push(example)
        }
        // examples = examples.concat(this.sample_schema.examples)
      }
      console.log('examples', examples)
      return examples
    }
  },
  components: {
    // QSelect,
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
  .ag-row .example, .show_examples span {
    background-color: lightgreen !important;
  }
  .ag-row .description, .show_descriptions span {
    background-color: lightgrey !important;
    white-space: normal;
  }
  .ag-theme-balham .ag-row-odd:not(.ag-row-selected) {
    background-color: #fafafa;
  }
  .ag-theme-balham .ag-cell {
    border-right: 1px solid #BDC3C7;
  }
</style>

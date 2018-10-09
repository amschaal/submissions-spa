<template>
  <div>
    <!-- <HotTable :settings="settings"></HotTable> -->
    <!-- <q-select :value="value" :options="options" @change="handleChange" filter filter-placeholder="select"/> -->
    <q-modal v-model="opened" :content-css="{minWidth: '90vw', minHeight: '90vh'}" ref="modal" no-backdrop-dismiss no-esc-dismiss>
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Samplesheet ({{type.name}})
          </q-toolbar-title>
        </q-toolbar>

        <!-- <q-toolbar slot="header">
        </q-toolbar> -->

        <div class="layout-padding">
          <q-btn
            color="primary"
            @click="show_help = true"
            label="Help"
            icon="fas fa-question-circle"
            v-if="type.help"
          />
          <ag-grid-vue style="width: 100%; height: 350px;" class="ag-theme-balham"
            rowHeight='22'
            rowSelection='multiple'
            :enableColResize='true'
            :enableSorting='true'
            :gridOptions='gridOptions'
            :rowData='rowData'
            :columnDefs='columnDefs'
            :ref="'grid'">
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
    <q-btn :label="'Samplesheet ('+rowData.length+')'"  @click="openSamplesheet"/>
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
  props: ['value', 'type', 'editable'],
  data () {
    return {
      opened: false,
      show_help: false,
      columnDefs: [
        {headerName: 'Make', field: 'make'},
        {headerName: 'Model', field: 'model'},
        {headerName: 'Price', field: 'price'}
      ],
      rowData: this.value,
      gridOptions: {
        enableRangeSelection: true,
        defaultColDef: {
          editable: this.editable
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
      errors: {}
    }
  },
  methods: {
    openSamplesheet () {
      var self = this
      this.errors = {}
      this.rowData = _.cloneDeep(this.value)
      if (!this.type || !this.type.schema) {
        this.$q.dialog({
          title: 'Alert',
          message: 'Please select a submission type first.'
        })
        return
      }
      this.columnDefs = this.schema2Columns(this.type.schema)
      console.log('openSamplesheet', this.rowData, this.value, this.columnDefs)
      this.$refs.modal.show().then(() => {
        if (self.value.length === 0) {
          self.addRow()
        }
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
    getColDef (id, definition, schema) {
      var self = this
      function cellClass (params) {
        console.log('cellClass', params, self.errors)
        if (self.errors[params.rowIndex] && self.errors[params.rowIndex][params.colDef.field]) {
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
            return {headerName: header, headerTooltip: tooltip, field: id, cellEditor: 'agRichSelectCellEditor', cellEditorParams: {values: definition.enum}, cellClass: cellClass, tooltip: cellTooltip} // cellEditor: 'agRichSelectCellEditor', cellEditorParams: {values: definition.enum} // cellEditorFramework: AutocompleteComponent
          } else {
            return {headerName: header, headerTooltip: tooltip, field: id, type: 'text', cellClass: cellClass, tooltip: cellTooltip}
          }
        case 'number':
          return {headerName: header, headerTooltip: tooltip, field: id, cellEditorFramework: NumericComponent, cellClass: cellClass, tooltip: cellTooltip, dataType: 'numeric'}
        case 'boolean':
          return {headerName: header, headerTooltip: tooltip, field: id, type: 'checkbox', cellEditorFramework: BooleanComponent, cellClass: cellClass, tooltip: cellTooltip, dataType: 'boolean'}
        case 'array':
          var def = {headerName: header, field: id, type: 'dropdown', cellClass: cellClass, tooltip: cellTooltip}
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
        this.$axios.post('/api/submission_types/' + this.type.id + '/validate_data/', {data: this.getRowData(true)})
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
      console.log('rows', rows)
      this.gridOptions.api.updateRowData({add: rows})
      console.log('addRow', this.getRowData())
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
</style>

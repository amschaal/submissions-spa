<template>
  <div>
    <!-- <HotTable :settings="settings"></HotTable> -->
    <!-- <q-select :value="value" :options="options" @change="handleChange" filter filter-placeholder="select"/> -->
    <q-modal v-model="opened" :content-css="{minWidth: '90vw', minHeight: '90vh'}" ref="modal" no-backdrop-dismiss>
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Samplesheet
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
          <q-toolbar-title>
            <q-btn
              color="positive"
              label="Add Row"
              @click="addRow"
            />
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
    <q-btn label="Samplesheet"  @click="openSamplesheet"/>
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
import AutocompleteComponent from './aggrid/editors/AutocompleteComponent.vue'
import BooleanComponent from './aggrid/editors/BooleanComponent.vue'
import _ from 'lodash'

// import { ClipboardService } from '../../node_modules/ag-grid-enterprise/dist/lib/clipboardService.js'
// import axios from 'axios'
// var clipboardService = null

export default {
  props: ['value', 'type'],
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
          editable: true
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
        // alert('do stuff')
      })
    },
    schema2Columns (schema) {
      var columnDefs = []
      for (var prop in schema.properties) {
        if (schema.properties.hasOwnProperty(prop)) {
          columnDefs.push(this.getColDef(prop, schema.properties[prop], schema))
        }
      }
      columnDefs[0].headerCheckboxSelection = true
      columnDefs[0].headerCheckboxSelectionFilteredOnly = true
      columnDefs[0].checkboxSelection = true
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
            return {headerName: header, headerTooltip: tooltip, field: id, cellEditorFramework: AutocompleteComponent, editable: true, cellClass: cellClass, tooltip: cellTooltip} // cellEditor: 'agRichSelectCellEditor', cellEditorParams: {values: definition.enum}
          } else {
            return {headerName: header, headerTooltip: tooltip, field: id, type: 'text', editable: true, cellClass: cellClass, tooltip: cellTooltip}
          }
        case 'number':
          return {headerName: header, headerTooltip: tooltip, field: id, editable: true, cellEditorFramework: NumericComponent, cellClass: cellClass, tooltip: cellTooltip, dataType: 'numeric'}
        case 'boolean':
          return {headerName: header, headerTooltip: tooltip, field: id, type: 'checkbox', editable: true, cellEditorFramework: BooleanComponent, cellClass: cellClass, tooltip: cellTooltip, dataType: 'boolean'}
        case 'array':
          var def = {headerName: header, field: id, type: 'dropdown', editable: true, cellClass: cellClass, tooltip: cellTooltip}
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
      this.$emit('input', this.getRowData())
      this.close()
    },
    validate (save) {
      // this.hst.validateTable(true)
      console.log('validate', save)
      var self = this
      if (this.type) {
        this.$axios.post('/api/submission_types/' + this.type.id + '/validate_data/', {data: this.getRowData()})
          .then(function (response) {
            console.log(response)
            self.errors = {}
            self.gridOptions.api.redrawRows() // redrawCells({force: true})
            self.$q.notify({message: 'Submission successfully validated.', type: 'positive'})
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
    getRowData () {
      var data = []
      this.gridOptions.api.forEachNode(function (node) {
        data.push(node.data)
      })
      return data
    },
    addRow () {
      this.gridOptions.api.updateRowData({add: [{}]})
      console.log('addRow', this.getRowData())
    },
    removeRows () {
      console.log('grid', this.gridOptions)
      var selectedData = this.gridOptions.api.getSelectedRows()
      this.gridOptions.api.updateRowData({remove: selectedData})
      this.errors = {}
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

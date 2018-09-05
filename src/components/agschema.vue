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
            :columnDefs='columnDefs'>
          </ag-grid-vue>
        </div>
        <q-toolbar slot="footer">
          <q-toolbar-title>
            <!-- <q-btn
              color="positive"
              label="Add Row"
              v-if="hst.addRow"
              @click="hst.addRow"
            />
            <q-btn
              color="negative"
              label="Remove selected rows"
              v-if="hst.removeRows"
              @click="hst.removeRows"
            />
            <q-btn
              label="Validate"
              v-if="hst.removeRows"
              @click="validate(false)"
            />
            <q-btn
              color="negative"
              label="Discard"
              @click="close"
              class="float-right"
            /> -->
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
        suppressRowClickSelection: true
      }
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
      return columnDefs
    },
    getColDef (id, definition, schema) {
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
            return {headerName: header, headerTooltip: tooltip, field: id, cellEditor: 'agRichSelectCellEditor', cellEditorParams: {values: definition.enum}, editable: true}
          } else {
            return {headerName: header, headerTooltip: tooltip, field: id, type: 'text', editable: true}
          }
        case 'number':
          return {headerName: header, headerTooltip: tooltip, field: id, type: 'numericColumn', editable: true}
        case 'boolean':
          return {headerName: header, headerTooltip: tooltip, field: id, type: 'checkbox', editable: true}
        case 'array':
          var def = {headerName: header, field: id, type: 'dropdown', editable: true}
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
      this.$emit('input', this.rowData)
      this.close()
    },
    validate (save) {
      // this.hst.validateTable(true)
      console.log('validate', save)
      var self = this
      if (this.type) {
        this.$axios.post('/api/submission_types/' + this.type.id + '/validate_data/', {data: this.rowData})
          .then(function (response) {
            console.log(response)
            self.$q.notify({message: 'Submission successfully validated.', type: 'positive'})
            if (save) {
              self.save()
            }
          })
          .catch(function (error, stuff) {
            console.log('ERROR', error.response)
            // self.hst.setErrors(error.response.data.errors)
            self.$q.notify({message: 'There were errors in your data.', type: 'negative'})
            // if (error.response) {
            //   self.errors = error.response.data.errors
            // }
          })
      }
    },
    close () {
      // this.data = this.value.slice()
      this.$refs.modal.hide()
    },
    modalOpened () {
      alert('hello?')
      console.log('modal opened')
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

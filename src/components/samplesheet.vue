<template>
  <div>
    <HotTable :settings="settings"></HotTable>
    <!-- <q-select :value="value" :options="options" @change="handleChange" filter filter-placeholder="select"/> -->
    <q-modal v-model="opened" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="keyboard_arrow_left"
          />
          <q-toolbar-title>
            Header
          </q-toolbar-title>
        </q-toolbar>

        <q-toolbar slot="header">
        </q-toolbar>

        <div class="layout-padding">
          <h1>Modal</h1>
          <!-- <HotTable :settings="settings"></HotTable> -->
          <div id="example1" class="hot handsontable htRowHeaders htColumnHeaders"></div>

          <q-btn
            color="primary"
            v-close-overlay
            label="Close"
          />
          <q-btn
            color="primary"
            label="Create table"
            @click="createTable"
          />
          <p>This is a Modal presenting a Layout.</p>
        </div>
        <q-toolbar slot="footer">
          <q-toolbar-title>
            Footer
          </q-toolbar-title>
        </q-toolbar>
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
import HotTable from '@handsontable/vue'
import Handsontable from 'handsontable'
import HotSchemaTable from '../assets/hot-schema/hotschema'
import {example_schemas as ExampleSchemas} from '../assets/hot-schema/example_schema'
// require('../statics/hot-schema/hotschema.js')
// import Handsontable from 'handsontable'
// import example_schemas from '../statics/hot-schema/example_schema'
// import HotSchemaTable from '../statics/hot-schema/hotschema'

// function loadScript (src) {
//   var script = document.createElement('script')
//   script.setAttribute('src', src)
//   document.head.appendChild(script)
// }
console.log('Hands on table', Handsontable)
console.log('HST', HotSchemaTable)

export default {
  props: ['value', 'options'],
  data () {
    return {
      opened: false,
      settings: {
        data: [
          ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
          ['2016', 10, 11, 12, 13],
          ['2017', 20, 11, 14, 13],
          ['2018', 30, 15, 12, 13]
        ],
        colHeaders: true,
        rowHeaders: true
      }
    }
  },
  methods: {
    handleChange (newVal) {
      this.$emit('input', newVal)
    },
    openSamplesheet () {
      // console.log('hst', HotSchemaTable)
      this.opened = true
      this.hst = new HotSchemaTable(document.getElementById('example1'), ExampleSchemas.veggie)
    },
    createTable () {
      this.hst = new HotSchemaTable(document.getElementById('example1'), ExampleSchemas.veggie)
    }
  },
  components: {
    QSelect,
    HotTable
  },
  created () {
    // loadScript('//docs.handsontable.com/4.0.0/components/handsontable/dist/handsontable.full.js')
    // loadScript('//cdnjs.cloudflare.com/ajax/libs/ajv/4.1.7/ajv.bundle.js')
    // loadScript('/statics/hot-schema/hotschema.js')
    // loadScript('/statics/hot-schema/example_schema.js')
  }
}
</script>

<style src="../../node_modules/handsontable/dist/handsontable.full.css"></style>

<template>
  <div>
    <!-- <HotTable :settings="settings"></HotTable> -->
    <!-- <q-select :value="value" :options="options" @change="handleChange" filter filter-placeholder="select"/> -->
    <q-modal v-model="opened" :content-css="{minWidth: '80vw', minHeight: '80vh'}" ref="modal">
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
            Samplesheet
          </q-toolbar-title>
        </q-toolbar>

        <!-- <q-toolbar slot="header">
        </q-toolbar> -->

        <div class="layout-padding">
          <!-- <HotTable :settings="settings"></HotTable> -->
          {{schema}}
          {{value}}
          <q-btn
            color="primary"
            label="Add Row"
            v-if="hst.addRow"
            @click="hst.addRow"
          />
          <div id="example1" class="hot handsontable htRowHeaders htColumnHeaders"></div>
        </div>
        <q-toolbar slot="footer">
          <q-toolbar-title>
            <q-btn
              color="primary"
              label="Discard"
              @click="discard"
            />
            <q-btn
              color="primary"
              label="Save"
              @click="save"
            />
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
// import HotTable from '@handsontable/vue'
// import Handsontable from 'handsontable'
import HotSchemaTable from '../assets/hot-schema/hotschema'
import _ from 'lodash'

export default {
  props: ['value', 'schema'],
  data () {
    return {
      opened: false,
      hst: {},
      // data: this.value ? this.value : [{}],
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
    openSamplesheet () {
      console.log('data', this.value)
      // console.log('hst', HotSchemaTable)
      // if (!this.opened)
      // this.opened = true
      var self = this
      console.log('openSamplesheet')
      this.$refs.modal.show().then(() => {
        self.createTable(self.schema, _.cloneDeep(this.value))
      })
      console.log('endOpenSamplesheet')
      // this.hst = new HotSchemaTable(document.getElementById('example1'), ExampleSchemas.veggie)
    },
    // closeSamplesheet () {
    //   var self = this
    //   this.$refs.modal.hide().then(() => {
    //     self.hst.table.destroy()
    //     self.hst = {}
    //   })
    //   // this.hst = new HotSchemaTable(document.getElementById('example1'), ExampleSchemas.veggie)
    // },
    createTable (schema, data) {
      // var useschema = schema ? schema : ExampleSchemas.veggie
      console.log('create table', schema, data)
      if (this.hst.table) {
        console.log('Destroy!')
        this.hst.table.destroy()
      }
      this.hst = new HotSchemaTable(document.getElementById('example1'), schema, data)
      console.log('end create table', schema, data)
    },
    save () {
      // this.local_data = this.hst.table.getSourceData()
      // this.data = this.hst.table.getSourceData() // this.local_data
      this.$emit('input', this.hst.table.getSourceData())
      // this.data
    },
    discard () {
      // this.data = this.value.slice()
      this.hst.table.destroy()
      this.hst = {}
      this.$refs.modal.hide()
      console.log('data', this.value)
    },
    modalOpened () {
      alert('hello?')
      console.log('modal opened')
    }

  },
  components: {
    QSelect
    // HotTable
  }
}

</script>

<style src="../../node_modules/handsontable/dist/handsontable.full.css"></style>

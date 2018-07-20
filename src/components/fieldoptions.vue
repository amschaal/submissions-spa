<template>
  <div>
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
            Field options
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          {{value}}
          <q-chips-input v-model="options" placeholder="Enter options" />
          <!-- <td v-if="p.type == 'string'"><q-btn v-if="p.enum" @click="removeOptions(p)">Remove options</q-btn><q-btn v-if="!p.enum" @click="useOptions(p)">Use Options</q-btn><q-chips-input v-if="p.enum" v-model="p.enum" placeholder="Enter options" /></td>
          <td v-if="p.type == 'number'">Number stuff</td> -->
        </div>
        <q-toolbar slot="footer">
          <q-toolbar-title>
            <q-btn
              color="negative"
              label="Discard"
              @click="discard"
              class="float-right"
            />
            <q-btn
              color="positive"
              label="Save"
              @click="save"
              class="float-right"
            />
          </q-toolbar-title>
        </q-toolbar>
      </q-modal-layout>
    </q-modal>
    <q-btn label="Options"  @click="openModal"/>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  props: ['value'],
  data () {
    return {
      opened: false,
      options: this.value && this.value.enum ? this.value.enum : []
    }
  },
  methods: {
    openModal () {
      // var self = this
      this.$refs.modal.show().then(() => {
      })
    },
    save () {
      // this.local_data = this.hst.table.getSourceData()
      // this.data = this.hst.table.getSourceData() // this.local_data
      this.$emit('input', this.hst.table.getSourceData())
      // this.data
    },
    discard () {
      this.$refs.modal.hide()
    }
  }
}

</script>

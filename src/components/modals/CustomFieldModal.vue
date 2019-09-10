<template>
  <q-modal v-model="opened" :content-css="{minWidth: '30vw', minHeight: '30vh'}" ref="modal">
    <q-modal-layout>
      <q-toolbar slot="header">
        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>
      </q-toolbar>
    <div class="layout-padding">
      Testing {{schema}} {{value}}
      <CustomFields :schema="schema" ng-model="data" :modify="true"/>
    </div>
    <q-toolbar slot="footer">
      <q-toolbar-title>
        <q-btn
          color="positive"
          @click="save()"
          label="Save"
        />
        <q-btn
          @click="opened = false"
          label="Cancel"
          color="negative"
        />
      </q-toolbar-title>
    </q-toolbar>
  </q-modal-layout>
  </q-modal>
</template>

<script>
// import Vue from 'vue'
import CustomFields from '../forms/customFields.vue'

export default {
  props: ['schema', 'value', 'title'],
  data () {
    return {
      data: this.value,
      opened: false
    }
  },
  mounted: function () {
  },
  methods: {
    save () {
      console.log('save', this.data)
    },
    open () {
      this.opened = true
    }
  },
  components: {
    CustomFields
  }
}
</script>

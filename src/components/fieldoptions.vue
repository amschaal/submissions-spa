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
            Field options for: {{variable}}
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          {{data}}
          {{validators}}
          <q-field
            label="Title"
            helper="This will be displayed as the column header"
          >
            <q-input v-model="data.title" />
          </q-field>
          <q-field
            label="Description"
          >
            <q-input v-model="data.description" type="textarea" placeholder="Enter description here."/>
          </q-field>
          <q-field
            label="Unique"
          >
            <!-- <q-checkbox v-model="data.unique" :false-value="true" :true-value="false" indeterminate-icon="check_box_outline_blank" unchecked-icon="check_box" checked-icon="check_box_outline_blank" keep-color /> -->
            <q-checkbox v-model="data.unique" indeterminate-icon="check_box_outline_blank"/>
            <!-- :false-value="undefined" toggle-indeterminate="false" indeterminate-value="none"/> -->
          </q-field>
          <q-field v-if="data.type === 'string'"
            label="Regular Expression"
            helper="Enter a valid regular expression to validate against. Example for matching values such as '20.3 ul': ^\d+(\.{1}\d+)? ul$"
          >
            <q-input v-model="data.pattern" />
          </q-field>
          <q-field v-if="data.type === 'string'"
            label="Choices"
            helper="If the variable should be constrained to specific choices, enter here."
          >
            <q-chips-input v-model="data.enum" placeholder="Enter options" />
          </q-field>
          <q-field v-if="data.type === 'number'"
            label="Minimum"
            helper="Optionally, enter a minimum valid number."
          >
            <q-input v-model="data.minimum" type="number"/>
          </q-field>
          <q-field v-if="data.type === 'number'"
            label="Maximum"
            helper="Optionally, enter a maximum valid number."
          >
            <q-input v-model="data.maximum" type="number"/>
          </q-field>
          <q-field v-if="data.validators"
            label="Custom validators"
          >
            <q-btn-dropdown label="Add validator">
              <q-list link>
                <q-item v-for="(v, id) in validators" :key="id" v-close-overlay @click.native="addValidator(id)">
                  <q-item-main>
                    <q-item-tile label>{{v.name}}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <div v-for="(v, index) in data.validators" :key="index"><q-btn flat dense round icon="delete_outline" @click="removeValidator(index)"/> {{validators[v.id].name}} <q-btn size="sm" v-if="validators[v.id].uses_options" label="Options"/></div>
          </q-field>
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
              label="Keep"
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
import _ from 'lodash'

export default {
  props: ['value', 'variable'],
  data () {
    return {
      opened: false,
      data: {enum: []},
      validators: this.$store.getters.validatorDict, // t{unique: {id: 'unique', name: 'Unique'}, foo: {id: 'foo', name: 'Foo'}},
      add_validator: null
      // options: this.value && this.value.enum ? this.value.enum : []
    }
  },
  methods: {
    openModal () {
      console.log('root', this.$root.validators)
      this.data = _.cloneDeep(this.value)

      if (!this.data.enum) {
        this.$set(this.data, 'enum', [])
      }
      if (!this.data.validators) {
        this.$set(this.data, 'validators', [])
      }
      console.log('openModal', this.value, this.data)
      this.$refs.modal.show().then(() => {

      })
    },
    save () {
      // this.local_data = this.hst.table.getSourceData()
      // this.data = this.hst.table.getSourceData() // this.local_data
      // this.value = this.options
      var val = _.cloneDeep(this.data)
      if (val.enum.length < 1) {
        val.enum = undefined
      }
      console.log('emit', val)
      this.$emit('input', val)
      this.$refs.modal.hide()
      // this.data
    },
    discard () {
      this.$refs.modal.hide()
    },
    addValidator (id) {
      this.data.validators.push({id: id, options: {}})
      console.log(id, this.data.validators)
    },
    removeValidator (index) {
      this.data.validators.splice(index, 1)
    }
  }
}

</script>

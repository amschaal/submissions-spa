<template>
  <div>
  <q-select
    v-if="$store.getters.isStaff"
    v-model="status"
    float-label="Set status"
   :options="$store.getters.statusOptions"
   @input="statusChanged()"
  />
</div>
</template>

<script>
export default {
  props: ['value', 'submission'],
  data () {
    return {
      status: this.value ? this.value.id : null,
      options: this.$store.getters.statusOptions
    }
  },
  methods: {
    statusChanged () {
      var self = this
      console.log('status', this.status)
      this.$axios.post(`/api/submissions/${this.submission.id}/update_status/`, {status: this.status})
        .then(function (response) {
          self.$q.notify({message: response.data.message, type: 'positive'})
          self.$emit('input', self.$store.getters.statusesDict[self.status])
        })
        .catch(function (response) {
          self.$q.notify({message: 'Status update failed!', type: 'negative'})
          self.status = self.value ? self.value.id : null
        })
    }
  }
}
</script>

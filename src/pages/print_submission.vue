<template>
  <div>
    <h5 class="centered">Submission Details</h5>
    <table class="full bordered">
    <tr><th>ID</th><td>{{submission.id}}</td><th>Internal ID</th><td>{{submission.internal_id}}</td><th>Type</th><td>{{submission.type.name}}</td></tr>
    <tr><th>Status</th><td>{{submission.status.name}}</td><th>Submitted</th><td>{{submission.submitted}}</td><th>Updated</th><td>{{submission.updated}}</td></tr>
    <tr><th>Name</th><td>{{submission.name}}</td><th>Email</th><td>{{submission.email}}</td><th>Phone</th><td>{{submission.phone}}</td></tr>
    <tr><th>PI</th><td>{{submission.pi_name}}</td><th>PI email</th><td>{{submission.pi_email}}</td><th>Institute</th><td>{{submission.institute}}</td></tr>
    <tr v-if="submission.notes"><th>Notes</th><td colspan="5">{{submission.notes}}</td></tr>
    </table>
    <div v-if="submission.submission_data">
      <h5 class="centered">Submission specific details</h5>
      <table class="full bordered">
        <tr><th :key="variable" v-for="(value, variable) in submission.submission_data">{{getTitle(submission.submission_schema,variable)}}</th></tr>
        <tr><td :key="variable" v-for="(value, variable) in submission.submission_data">{{value}}</td></tr>
      </table>
    </div>
    <h5 class="centered page-break-before">Total Number of Samples: {{submission.sample_data.length}}</h5>
<table class="horizontal full bordered compact page-break-after">
  <tr>
    <th :key="variable" v-for="variable in submission.sample_schema.order">{{getTitle(submission.sample_schema,variable)}}</th>
  </tr>

  <tr :key="index" v-for="(row,index) in submission.sample_data">
    <td :key="index" v-for="(variable, index) in submission.sample_schema.order">{{row[variable]}}</td>
  </tr>
</table>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'print_submission',
  props: ['id'],
  data () {
    return {
      submission: {'sample_data': []}
    }
  },
  mounted: function () {
    console.log('mounted')
    var self = this

    this.$axios
      .get(`/api/submissions/${self.id}/`)
      .then(function (response) {
        console.log('response', response)
        if (!response.data.sample_data) {
          response.data.sample_data = []
        }
        // self.submission = response.data
        Vue.set(self, 'submission', response.data)
      })
  },
  methods: {
    getTitle (schema, variable) {
      return schema.properties[variable].title ? schema.properties[variable].title : variable
    }
  },
  components: {
  }
}
</script>

<style scoped>
/* media="print" */
.full {
  width:100%;
}
td,th{
  text-align: center;
}
.bordered td, .bordered th{
  border: thin solid grey;
  margin: 0px;
  padding: 1px;
}
.bordered{
  border-spacing: 0;
  border-collapse: collapse;
}
.compact th td{
  word-wrap:break-word;
}
.compact td{
  font-size:10pt;
}
.centered{
  text-align:center;
}
.page-break-before{
  page-break-before:  always;
}
.page-break-after{
  page-break-after:  always;
}
/*
.horizontal.compact th{
  word-break: break-word;
}
*/

</style>
<style scoped type="text/css" media="print">
  @page {
    size: landscape;
  }
  body {
    width: 10in;
    font-size: 11pt;
  }
  .full {
    width:100%;
  }
</style>

<template>
  <div v-if="submission.type">
    <p class="heading">{{submission.lab.name}} - Submission Details</p>
    <table class="full bordered compact">
    <tr><th>ID</th><td>{{submission.id}}</td><th>Internal ID</th><td>{{submission.internal_id}}</td><th>Type</th><td>{{submission.type.name}}</td><th>Submitted</th><td>{{getDate(submission.submitted)}}</td></tr>
    <!--<tr><th>Status</th><td><span v-if="submission.status">{{submission.status.name}}</span></td><th>Submitted</th><td>{{submission.submitted}}</td><th>Updated</th><td>{{submission.updated}}</td></tr>-->
    <tr><th>PI</th><td>{{submission.pi_first_name}} {{submission.pi_last_name}}</td><th>PI email</th><td>{{submission.pi_email}}</td><th>PI Phone</th><td>{{submission.pi_phone}}</td><th>Institute</th><td colspan="5">{{submission.institute}}</td></tr>
    <tr><th>Name</th><td>{{submission.first_name}} {{submission.last_name}}</td><th>Email</th><td>{{submission.email}}</td><th>Phone</th><td>{{submission.phone}}</td></tr>
    <!--<tr><th>Institute</th><td colspan="5">{{submission.institute}}</td></tr>-->
    <tr v-if="submission.notes"><th>Notes</th><td colspan="7">{{submission.notes}}</td></tr>
    <tr v-if="submission.comments"><th td colspan="8">Special Instructions / Comments</th></tr>
    <tr v-if="submission.comments"><td colspan="8">{{submission.comments}}</td></tr>
    </table>

    <div v-if="submission.submission_data && Object.keys(submission.submission_data).length">
      <table class="full bordered compact">
        <tr><th :key="variable" v-for="(value, variable) in submission.submission_data" v-show="!hidden(submission.submission_schema, variable)">{{getTitle(submission.submission_schema,variable)}}</th></tr>
        <tr><td :key="variable" v-for="(value, variable) in submission.submission_data" v-show="!hidden(submission.submission_schema, variable)">{{truncate(submission.submission_schema, variable, value)}}</td></tr>
      </table>
    </div>
    <table class="full bordered compact">
      <tr>
        <th v-for="(value, label) in submission.payment.display" :key="label">{{label}}</th>
      </tr>
      <tr>
        <td v-for="(value, label) in submission.payment.display" :key="label">{{value}}</td>
      </tr>
  </table>
    <p class="heading">Total Number of Samples: {{submission.sample_data.length}}</p> <!--  page-break-before -->
<table class="horizontal full bordered compact page-break-after">
  <tr>
    <th></th><th :key="variable" v-for="variable in submission.sample_schema.order" v-show="!hidden(submission.sample_schema, variable)">{{getTitle(submission.sample_schema,variable)}}</th>
  </tr>

  <tr :key="index" v-for="(row,index) in submission.sample_data">
    <td>{{index + 1}}</td><td :key="index" v-for="(variable, index) in submission.sample_schema.order" v-show="!hidden(submission.sample_schema, variable)">{{truncate(submission.sample_schema, variable, row[variable])}}</td>
  </tr>
</table>
  </div>
</template>

<script>
import Vue from 'vue'
import { date } from 'quasar'
const { formatDate } = date
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
      if (schema.properties[variable].printing && schema.properties[variable].printing.label) {
        return schema.properties[variable].printing.label
      }
      return schema.properties[variable] && schema.properties[variable].title ? schema.properties[variable].title : variable
    },
    truncate (schema, variable, value) {
      if (schema.properties[variable].printing && schema.properties[variable].printing.truncate_at) {
        return value.substr(0, schema.properties[variable].printing.truncate_at) + ' ..'
      }
      return value
    },
    hidden (schema, variable) {
      // return true
      return schema.properties[variable].printing && schema.properties[variable].printing.hidden
    },
    getDate (timeStamp) {
      return formatDate(timeStamp, 'MM/DD/YYYY')
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
.compact td, .compact th{
  font-size:9pt;
}
.heading{
  text-align:center;
  margin: 10px;
  font-size: 10pt;
  font-weight: bold;
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
    font-size: 10pt;
  }
  .full {
    width:100%;
  }
</style>

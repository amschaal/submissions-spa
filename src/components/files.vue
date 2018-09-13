<template>
  <div>
    <q-uploader url="/api/submission_files/" :upload-factory="uploadFile" :multiple="true" stack-label="Upload files"/>
    <q-table
      ref="table"
      :data="serverData"
      :columns="columns"
      :filter="filter"
      row-key="id"
      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
    >
      <!-- <template slot="top-right" slot-scope="props">
        <q-search hide-underline v-model="filter" />
      </template> -->
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td key="file" :props="props"><a :href="props.row.file" target="_blank">{{ props.row.filename }}</a></q-td>
          <q-td key="uploaded_at" :props="props">{{ formatDate(props.row.uploaded_at) }}</q-td>
        </q-tr>
      </template>
    </q-table>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['submission'],
  data () {
    return {
      filter: '',
      loading: false,
      serverPagination: {
        page: 1,
        rowsNumber: 0, // specifying this determines pagination is server-side
        rowsPerPage: 10
      },
      serverData: [],
      columns: [
        { name: 'file', label: 'Filename', field: 'file', sortable: true },
        { name: 'uploaded_at', label: 'Uploaded', field: 'uploaded_at', sortable: true }
      ]
    }
  },
  mounted: function () {
    console.log('mounted')
    // var self = this
    // this.$axios
    //   .get('/api/submission_files/', {params: {submission: this.submission.id, page_size: 100}})
    //   .then(function (response) {
    //     self.files = response.data.results
    //   })
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  },
  methods: {
    request ({ pagination, filter }) {
      // we set QTable to "loading" state
      this.loading = true

      // we do the server data fetch, based on pagination and filter received
      // (using Axios here, but can be anything; parameters vary based on backend implementation)
      var sortBy = pagination.sortBy
      if (pagination.descending) {
        sortBy = '-' + sortBy
      }
      this.$axios
        .get(`/api/submission_files/?submission=${this.submission.id}&ordering=${sortBy}&page=${pagination.page}&page_size=${pagination.rowsPerPage}`)// ${pagination.descending}&filter=${filter}
        .then(({ data }) => {
          this.serverPagination = pagination
          this.serverPagination.rowsNumber = data.count
          this.serverData = data.results
          this.loading = false
        })
        .catch(error => {
          // there's an error... do SOMETHING
          console.log(error)
          // we tell QTable to exit the "loading" state
          this.loading = false
        })
    },
    uploadFile (file, uploadProgress) {
      var formData = new FormData()
      formData.append('file', file)
      formData.append('submission', this.submission.id)

      return this.$axios.post('/api/submission_files/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function (progressEvent) {
            var percentCompleted = progressEvent.loaded / progressEvent.total
            // execute the callback
            uploadProgress(percentCompleted)
            return percentCompleted * 100.0
          }
        }
      )
    },
    formatDate (value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    }
  }
}
</script>

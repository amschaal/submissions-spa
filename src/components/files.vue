<template>
  <div>
    <q-uploader url="/api/submission_files/" :upload-factory="uploadFile" multiple="true"/>
    <q-list striped-odd>
      <q-list-header inset>Files</q-list-header>
      <q-item v-bind:key="file.id" v-for="file in files">
        <q-item-main>
            <q-item-tile label><a :href="file.file" target="_blank">{{ file.filename }}</a></q-item-tile>
            <q-item-tile sublabel>{{ file.uploaded_at }}</q-item-tile>
          </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script>

export default {
  props: ['submission'],
  data () {
    return {
      files: []
    }
  },
  mounted: function () {
    console.log('mounted')
    var self = this
    this.$axios
      .get('/api/submission_files/', {params: {submission: this.submission.id, page_size: 100}})
      .then(function (response) {
        self.files = response.data.results
      })
  },
  methods: {
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
    }
  }
}
</script>

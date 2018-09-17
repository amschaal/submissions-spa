<template>
  <div>
    {{getResponses()}}
    <q-btn :click="newNote">Add note</q-btn>
    <div v-for="note in getResponses(note)" :key="note.id">
      <q-card inline class="q-ma-sm">
        <q-card-title>
           {{getTypeText(note)}} {{getEmailsText(note)}} ...
          <span slot="subtitle"><b>{{ note.user }}</b> wrote: <span class="float-right">{{formatDate(note.created)}}</span></span>
        </q-card-title>
        <q-card-main>
          {{note.text}}
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['submission'],
  data () {
    return {
      note: {},
      noteHash: {}
      // notes: [{created: new Date(), user: 'Anonymous'}]
    }
  },
  mounted: function () {
    console.log('mounted')
    this.addNote({id: 1, created: new Date(), user: 'Anonymous', text: 'This is the content of the note.'})
    this.note = null
    // var self = this
    // this.$axios
    //   .get('/api/notes/', {params: {submission: this.submission.id, page_size: 100}})
    //   .then(function (response) {
    //     self.notes = response.data.results
    //   })
  },
  methods: {
    formatDate (value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    },
    getResponses (note) {
      if (note) {
        return this.noteHash[note.id]
      } else {
        return this.noteHash[null]
      }
    },
    save (note) {
      console.log('save', note.submission, note)
      // var method = note.id ? '$save' : '$create'
      if (!note.id && !note.public) {
        note.send_email = false
      }
      // @todo: implement following in axios
      // note[method](function() { Materialize.toast('Note saved',5000)}, function(){ Materialize.toast('Error saving note',5000)})
    },
    newNote () {
      var note = {
        type: 'NOTE',
        submission: this.submission.id,
        // created_by:{{request.user.id}},
        send_email: true,
        public: true,
        editing: true,
        parent: null
      }
      this.addNote(note)
    },
    deleteNote (note) {
      if (note.id && !confirm('Are you sure you want to delete this note and all responses?')) {
        return
      }
      var parent = note.parent
      var id = note.id
      var removeFunc = function () {
        for (var i in this.noteHash[parent]) {
          if (this.noteHash[parent][i].id === id) {
            this.noteHash[parent].splice(i, 1)
          }
        }
        this.$q.notify('Note deleted')
      }
      if (!id) {
        removeFunc()
        return
      }
      // @todo: implement this in axios
      note.remove()
      // note.$remove(removeFunc,function(){Materialize.toast('Error deleting note',5000);});
    },
    reply (parent) {
      var note = {
        type: 'NOTE',
        submission: this.submission.id,
        send_email: true,
        public: true,
        editing: true,
        parent: parent.id
      }
      this.addNote(note)
    },
    addNote (note) {
      console.log('addNote', note)
      if (!this.noteHash[note.parent]) {
        this.noteHash[note.parent] = []
      }
      this.noteHash[note.parent].push(note)
    },
    getClasses (note) {
      if (!note.public) {
        return 'red lighten-4'
      }
      if (note.type === 'NOTE') {
        return 'green lighten-4'
      }
      if (note.type === 'LOG') {
        return 'orange lighten-5'
      }
    },
    getTypeText (note) {
      if (!note.public) {
        return 'Note (private)'
      }
      if (note.type === 'NOTE') {
        return 'Note'
      }
      if (note.type === 'LOG') {
        return 'Log'
      }
    },
    getEmailsText (note) {
      if (note.emails) {
        return '- Emailed to: ' + note.emails.join(', ')
      }
    }
  }
}
</script>

<style scoped>
  .q-card {
    min-width: 600px;
    max-width: 800px;
  }
</style>

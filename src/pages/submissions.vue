<template>
  <q-page class="flex flex-center">
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
      <template slot="top-right" slot-scope="props">
        <q-search hide-underline v-model="filter" />
      </template>
    </q-table>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'submissions',
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
        { name: 'id', label: 'Id', field: 'id', sortable: true },
        { name: 'internal_id', label: 'Internal Id', field: 'internal_id', sortable: true },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'submitted', label: 'Submitted', field: 'submitted' },
        { name: 'name', label: 'Name', field: 'name' },
        { name: 'email', label: 'Email', field: 'email', sortable: true },
        { name: 'pi_name', label: 'PI', field: 'pi_name', sortable: true }
      ]
    }
  },
  methods: {
    request ({ pagination, filter }) {
      // we set QTable to "loading" state
      this.loading = true

      // we do the server data fetch, based on pagination and filter received
      // (using Axios here, but can be anything; parameters vary based on backend implementation)
      console.log(pagination, filter)
      axios
        .get(`http://127.0.0.1:8002/api/submissions/?ordering=${pagination.sortBy}&page=${pagination.page}&page_size=${pagination.rowsPerPage}`)// ${pagination.descending}&filter=${filter}
        .then(({ data }) => {
        /*
          // updating pagination to reflect in the UI
          this.serverPagination = pagination

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.rowsNumber

          // then we update the rows with the fetched ones
          */
          this.serverData = data.results

          // finally we tell QTable to exit the "loading" state
          this.loading = false
        })
        .catch(error => {
          // there's an error... do SOMETHING
          console.log(error)
          // we tell QTable to exit the "loading" state
          this.loading = false
        })
    }
  },
  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>

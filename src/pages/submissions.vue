<template>
  <q-page padding class="docs-input row justify-center">
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
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td key="id" :props="props"><router-link :to="{ name: 'submission', params: { id: props.row.id }}">{{ props.row.id }}</router-link></q-td>
          <q-td key="internal_id" :props="props">{{ props.row.internal_id }}</q-td>
          <q-td key="status" :props="props">{{ props.row.status }}</q-td>
          <q-td key="submitted" :props="props">{{ props.row.submitted }}</q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="email" :props="props">{{ props.row.email }}</q-td>
          <q-td key="pi_email" :props="props">{{ props.row.pi_email }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'submissions',
  data () {
    return {
      filter: '',
      loading: false,
      serverPagination: {
        page: 1,
        rowsNumber: 0, // specifying this determines pagination is server-side
        rowsPerPage: 10,
        descending: true,
        sortBy: 'submitted'
      },
      serverData: [],
      columns: [
        { name: 'id', label: 'Id', field: 'id', sortable: true },
        { name: 'internal_id', label: 'Internal Id', field: 'internal_id', sortable: true },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'submitted', label: 'Submitted', field: 'submitted', sortable: true },
        { name: 'name', label: 'Name', field: 'name' },
        { name: 'email', label: 'Email', field: 'email', sortable: true },
        { name: 'pi_email', label: 'PI', field: 'pi_email', sortable: true }
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
      var sortBy = pagination.sortBy
      if (pagination.descending) {
        sortBy = '-' + sortBy
      }
      var search = this.filter !== '' ? `&search=${this.filter}` : ''
      this.$axios
        .get(`/api/submissions/?ordering=${sortBy}&page=${pagination.page}&page_size=${pagination.rowsPerPage}${search}`)// ${pagination.descending}&filter=${filter}
        .then(({ data }) => {
          console.log('data', data)
          // updating pagination to reflect in the UI
          this.serverPagination = pagination

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.count

          // then we update the rows with the fetched ones
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

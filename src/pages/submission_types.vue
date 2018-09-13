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
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td key="name" :props="props"><router-link :to="{ name: 'submission_type', params: { id: props.row.id }}">{{ props.row.name }}</router-link></q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'submission_types',
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
        { name: 'name', label: 'Name', field: 'name', sortable: true },
        { name: 'description', label: 'Description', field: 'description' }
      ]
    }
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
        .get(`/api/submission_types/?ordering=${sortBy}&page=${pagination.page}&page_size=${pagination.rowsPerPage}`)// ${pagination.descending}&filter=${filter}
        .then(({ data }) => {
        /*
          // updating pagination to reflect in the UI
          this.serverPagination = pagination

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.rowsNumber

          // then we update the rows with the fetched ones
          */
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

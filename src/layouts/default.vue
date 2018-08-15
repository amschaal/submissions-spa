<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Quasar App
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Essential Links</q-list-header>
        <q-item :to="{ name: 'submissions' }">
          <q-item-side icon="list" />
          <q-item-main label="Submissions"/>
          <!-- <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" /> -->
        </q-item>
        <q-item :to="{ name: 'create_submission' }">
          <q-item-side icon="fas fa-plus-square" />
          <q-item-main label="Create Submission"/>
          <!-- <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" /> -->
        </q-item>
        <q-item :to="{ name: 'submission_types' }">
          <q-item-main label="Submission Types"/>
        </q-item>
        <q-item v-if="$keycloak.authenticated">
          <q-item-main label="Logout" />
          <a @click="$keycloak.logout()">{{ $keycloak.user.username }}: Logout</a>
          <!-- <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" /> -->
        </q-item>
        <q-item v-if="!$keycloak.authenticated">
          <q-item-main label="Login" />
          <a @click="$keycloak.login()">Click</a>
          <!-- <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" /> -->
        </q-item>

        <!-- <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item> -->
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import Auth from '../components/auth.vue'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      show_login: false
    }
  },
  methods: {
    openURL
  },
  components: {
    Auth
  }
}
</script>

<style>
</style>

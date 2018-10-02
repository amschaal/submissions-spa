<template>
  <q-page padding class="docs-input row justify-center">

    <q-card>
      <q-card-title>
        DNA Technologies Core Sample Submissions
      </q-card-title>
      <q-card-separator />
      <q-card-main>
      <h5>Getting Started</h5>
        <p>Put something here.  Also, link to <router-link :to="{ name: 'create_submission' }">sample submission</router-link>.</p>
        <p>
          These three steps will assure the trouble-free processing of your projects:
           Make sure that your lab has an account with the Genome Center.  We require a Genome Center account for each PI/lab/company before receiving samples.  Setting up the account is a simple process of entering contact information for the PI and a financial administrator.  Please see details below on this page. This page has also all other information of administrative relevance.
           Please check the sample requirements page:  http://dnatech.genomecenter.ucdavis.edu/sample-requirements/ to plan your project accordingly.
          Find the sample submission forms (Excel spreadsheets)  and the sample shipping instructions on this page:    http://dnatech.genomecenter.ucdavis.edu/sample-submission-scheduling/
          Please consult our extensive FAQs first in case of questions. We do offer free consultations.  Please contact us at dnatech@ucdavis.edu .
        </p>
    </q-card-main>
  </q-card>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex'
}
</script>

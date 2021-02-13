<template>
  <b-row class="my-4">
    <b-col>
      <b-card v-if="uploads.length">
        <b-table striped hover :items="uploads"></b-table>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "AdminLister",
  props: {
    uploads: {
      type: Array,
      default() {
        return []
      }
    }
  },
  event: [
      'showItem'
  ]
}
</script>

<style scoped>

</style>
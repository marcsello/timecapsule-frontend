<template>
  <b-row class="my-4">
    <b-col>
      <b-card v-if="uploads.length">
        <b-table
            striped
            hover
            :items="uploads"
            :fields="fields"
            sort-icon-left
            primary-key="id"
            @row-clicked="onRowClick"
        ></b-table>
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
  data() {
    return {
      fields: [
        {key: 'id', sortable: true},
        {key: 'name', sortable: true},
        {key: 'address', sortable: true},
        {key: 'text_length', sortable: false},
        {key: 'have_attachment', sortable: false}
      ]
    }
  },
  methods: {
    onRowClick({id}) {
      this.$emit("showItem", id);
    }
  }
}
</script>

<style scoped>

</style>
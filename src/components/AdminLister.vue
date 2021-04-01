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
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
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
      sortBy: 'id',
      sortDesc: false,
      fields: [
        {key: 'id', sortable: true},
        {key: 'name', sortable: true},
        {key: 'address', sortable: true},
        {key: 'text_length', sortable: false},
        {key: 'attachment_count', sortable: false}
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
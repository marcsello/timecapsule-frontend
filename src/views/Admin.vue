<template>
  <div id="admin">
    <b-container>
      <admin-requester @submit="performRequest"/>
      <admin-lister/>
    </b-container>
  </div>
</template>

<script>
import AdminLister from "@/components/AdminLister";
import AdminRequester from "@/components/AdminRequester";

export default {
  name: "Admin",
  components: {
    AdminRequester, AdminLister
  },
  methods: {
    performRequest() {

    }
  }
}
</script>

<style scoped>

</style>
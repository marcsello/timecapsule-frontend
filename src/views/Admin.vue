<template>
  <div id="admin">
    <b-container>
      <admin-keyfield @submit="onSubmit"/>
      <admin-lister :uploads="uploads" @showItem="onShowItem"/>
    </b-container>
  </div>
</template>

<script>
import AdminLister from "@/components/AdminLister";
import AdminKeyfield from "@/components/AdminKeyfield";
import axios from "axios";

export default {
  name: "Admin",
  components: {
    AdminKeyfield, AdminLister
  },
  data() {
    return {
      key: null,
      uploads: []
    }
  },
  methods: {
    onSubmit(key) {
      this.key = key;
      this.getList()
    },
    adminGet(path) {
      return new Promise((resolve, reject) => {
        if (!this.key) {
          return reject();
        }

        const config = {
          baseURL: process.env.VUE_APP_API_LOCATION,
          headers: {
            'Authorization': this.key
          }
        }

        return axios.get(
            path, config
        ).then((response) => {

          return resolve(response.data);

        }).catch((error) => {

          if (error.response.status === 401) {
            alert("Rossz kulcs!");
          } else {
            alert("Error");
          }
          return reject();
        });
      })
    },
    getList() {
      this.adminGet('/upload').then((data) => {
        this.uploads = data;
      }).catch(() => this.uploads = []);
    },
    onShowItem(id) {
      this.adminGet(`/upload/${id}`).then(() => {
        // TODO
      }).catch(() => this.uploads = []);
    },
  }
}
</script>

<style scoped>

</style>
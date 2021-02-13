<template>
  <div id="admin">

    <b-modal id="modal-upload-content" size="lg" scrollable centered ok-only :title="modalTitle">
      <div id="modal-upload-content-content">
        <p><b>Azonosító:</b></p>
        <p>{{ displayed_upload.id }}</p>

        <p><b>Feltöltés időpontja:</b></p>
        <p>{{ displayed_upload.upload_date }}</p>

        <p><b>Feltöltő neve:</b></p>
        <p>{{ displayed_upload.name }}</p>

        <p><b>Feltöltő címe:</b></p>
        <p>{{ displayed_upload.address }}</p>

        <p><b>Az üzenet szövege:</b></p>
        <p id="displayed-upload-text">{{ displayed_upload.text }}</p>
        <div v-if="displayed_upload.have_attachment">
          <p><b>Csatolmány:</b></p>
          <p>Hash: {{ displayed_upload.attachment_hash }}</p>
          <p>Fájlnév: {{ displayed_upload.attachment_original_filename }}</p>
          <div class="d-flex justify-content-center">
            <!-- TODO: Solve download -->
            <b-button variant="primary">Letöltés</b-button>
          </div>
        </div>
      </div>
    </b-modal>

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
      uploads: [],
      displayed_upload: {
        id: null,
        name: null,
        address: null,
        attachment_hash: null,
        attachment_original_filename: null,
        attachment_url: null,
        have_attachment: false,
        text: null,
        text_length: 0,
        upload_date: null
      }

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
      this.adminGet(`/upload/${id}`).then((data) => {
        this.displayed_upload = data;
        this.$bvModal.show('modal-upload-content');
      }).catch(() => this.uploads = []);
    },
  },
  computed: {
    modalTitle() {
      return `${this.displayed_upload.id}. számú feltöltés ${this.displayed_upload.name} által`
    }
  }
}
</script>

<style scoped>
#modal-upload-content-content {
  overflow-wrap: break-word;
}

#displayed-upload-text {
  white-space: pre-wrap;
}
</style>
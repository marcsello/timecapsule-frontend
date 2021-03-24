<template>
  <div id="admin">

    <navbar/>

    <div id="content">

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
        <div v-if="displayed_upload.attachment_count > 0">
          <p><b>Csatolmány(ok):</b></p>
          <ol>
            <li class="py-2" v-for="(file,idx) in displayed_upload.files" :key="idx">
              <ul>
                <li><b>Fájlnév:</b> {{ file.original_filename }}</li>
                <li><b>Hash:</b> {{ file.md5_hash }}</li>
                <li><b>Méret:</b> {{ file.size }} Byte</li>
                <li><b>MIME Típus:</b> {{ file.mime }}</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </b-modal>

    <b-container>
      <admin-keyfield @submit="onSubmit"/>
      <admin-lister :uploads="uploads" @showItem="onShowItem"/>
    </b-container>


    </div>

    <div id="footer">
      <b-container>
        <footer-content/>
      </b-container>
    </div>

  </div>
</template>

<script>
import AdminLister from "@/components/AdminLister";
import AdminKeyfield from "@/components/AdminKeyfield";
import Navbar from "@/components/Navbar";
import FooterContent from "@/components/FooterContent"
import axios from "axios";

export default {
  name: "Admin",
  components: {
    AdminKeyfield, AdminLister, Navbar, FooterContent
  },
  data() {
    return {
      key: null,
      uploads: [],
      displayed_upload: {
        id: 0,
        name: "",
        address: "",
        email: null,
        phone: null,
        text_length: 0,
        text: "",
        attachment_count: 1,
        files: [
          {
            id: 0,
            md5_hash: "",
            mime: "",
            original_filename: "",
            size: 0
          }
        ],
        upload_date: ""
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

#admin {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#content {
  margin-top: 70px;
  margin-bottom: 20px;
}

#footer {
  padding: 1em;
  margin-top: auto;
  background: #E9ECEF;
}
</style>
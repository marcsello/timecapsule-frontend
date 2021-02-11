<template>
  <b-row class="my-3">
    <b-col>

      <b-card id="uploader">
        <h1>
          Feltöltés
        </h1>
        <b-form @submit.prevent="onSubmit">

          <b-form-group
              id="input-group-name"
              label="Név:"
              label-for="input-name"
          >
            <b-form-input
                id="input-name"
                v-model="form.name"
                type="text"
                placeholder=""
                required
            />
          </b-form-group>


          <b-form-group
              id="input-group-address"
              label="Nagyatádi cím:"
              label-for="input-address"
          >
            <b-form-input
                id="input-address"
                v-model="form.address"
                type="text"
                placeholder=""
                required
            />
          </b-form-group>


          <b-form-group
              id="input-group-text"
              label="Üzenet:"
              label-for="input-text"
          >
            <b-form-textarea
                id="input-text"
                v-model="form.text"
                placeholder="Írjon valamit..."
                rows="5"
                max-rows="8"
            />
          </b-form-group>

          <b-form-group
              id="input-group-attachment"
              label="Csatolmány:"
              label-for="attachment"
              description="(Max.: 512Mb)"
          >
            <b-form-file
                id="attachment"
                v-model="form.attachment"
                placeholder="Válasszon vagy ejtsen ide egy fájlt..."
                drop-placeholder="Ejtse ide a fájlt..."
                browse-text="Tallózás"
                size="lg"
                ref="attachment"
            />
          </b-form-group>

          <div class="d-flex justify-content-center">
            <b-button ref="submit" type="submit" variant="primary">Beküldés!</b-button>
          </div>
        </b-form>

      </b-card>


      <b-overlay :show="showOverlay" no-wrap @shown="onOverlayShown" @hidden="onOverlayHidden">
        <template #overlay>
          <div v-if="confirmed" class="text-center rounded">
            <div class="mb-3">Feltöltés folyamatban...</div>
            <b-progress
                min="0"
                max="99"
                :value="uploadProgress"
                variant="success"
                v-if="uploadProgress !== null"
            />
            <b-spinner v-else/>
          </div>
          <div
              v-else
              ref="overlay_confirm_dialog"
              tabindex="-1"
              role="dialog"
              aria-modal="false"
              aria-labelledby="form-confirm-label"
              class="text-center p-3"
          >
            <p><strong id="form-confirm-label">Biztos vagy benne?</strong></p>
            <p>Miután a feltöltés gombra kattintottál, már nincs lehetőséged visszavonni vagy módosítani a beadást!</p>
            <div class="d-flex justify-content-center">
              <b-button variant="outline-danger" class="mr-3" @click="onOverlayCancel">
                Mégse
              </b-button>
              <b-button variant="outline-success" @click="onOverlayConfirm">Feltöltés</b-button>
            </div>
          </div>
        </template>
      </b-overlay>


    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';

export default {
  name: "Uploader",
  data() {
    return {
      form: {
        name: null,
        address: null,
        text: null,
        attachment: null
      },
      uploadInProgress: false,
      uploadProgress: null,
      confirmed: false,
      showOverlay: false
    }
  },
  methods: {
    onOverlayShown() {
      this.$refs.overlay_confirm_dialog.focus()
    },
    onOverlayHidden() {
      this.$refs.submit.focus()
    },
    onSubmit() {
      this.uploadProgress = null;
      this.uploadInProgress = false;
      this.confirmed = false;
      // Show the overlay
      this.showOverlay = true;
    },
    onOverlayCancel() {
      this.confirmed = false;
      this.showOverlay = false;
    },
    onOverlayConfirm() {
      this.uploadInProgress = true;
      this.confirmed = true;
      this.performUpload();
    },
    performUpload() {


      let formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('address', this.form.address);
      formData.append('text', this.form.text);

      if (this.form.attachment) {
        formData.append('attachment', this.form.attachment);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (progressEvent) {
          let uploadedPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (uploadedPercent === 100) {
            this.uploadProgress = null; // show the spinner instead
          } else {
            this.uploadProgress = uploadedPercent;
          }
        },
        baseURL: process.env.VUE_APP_API_LOCATION
      }

      axios.post('/upload',
          formData,
          config
      ).then(function () {
        console.log('SUCCESS!!');
      }).catch(function () {
        console.log('FAILURE!!');
      });

    }
  }
}
</script>

<style scoped>

</style>
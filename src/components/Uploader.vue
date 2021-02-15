<template>
  <b-row class="my-3">
    <b-col>

      <b-card id="uploader">
        <h1>
          Feltöltés
        </h1>

        <uploader-form :active="uploaderState === UploaderStates.EDITING" @submit="onSubmit"/>

      </b-card>


      <b-overlay :show="uploaderState !== UploaderStates.EDITING" no-wrap @shown="onOverlayShown">
        <template #overlay>
          <!-- Uploader progress -->
          <div v-if="uploaderState === UploaderStates.UPLOADING" class="text-center rounded">
            <div class="mb-3">Feltöltés folyamatban...</div>
            <b-progress
                v-if="uploadProgress !== null || uploadProgress === 100"
                min="0"
                max="100"
                :value="uploadProgress"
                variant="success"
            />
            <b-spinner v-else/>
          </div>
          <!-- Confirmation -->
          <div
              v-else-if="uploaderState === UploaderStates.CONFIRMING"
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
          <!-- Upload completed -->
          <div v-else-if="uploaderState === UploaderStates.SUCCESS" class="text-center">
            <p>
              <b-icon variant="success" icon="check-circle" font-scale="4"/>
            </p>
            <p><strong>Sikeres feltöltés!</strong></p>
          </div>
          <!-- Upload failed -->
          <div v-else class="text-center">
            <p>
              <b-icon variant="danger" icon="x-circle" font-scale="4"/>
            </p>
            <p><strong>Sikertelen feltöltés!</strong></p>
            <p>Úgy tűnik, valami hiba történt, próbáld újra később.</p>
            <div class="d-flex justify-content-center">
              <b-button variant="outline-warning" @click="onOverlayCancel">Vissza</b-button>
            </div>
          </div>
        </template>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';
import UploaderForm from "@/components/UploaderForm";

const UploaderStates = {
  EDITING: 1,
  CONFIRMING: 2,
  UPLOADING: 3,
  SUCCESS: 4,
  FAIL: 5
}

export default {
  name: "Uploader",
  components: {
    UploaderForm
  },
  data() {
    return {
      UploaderStates,
      uploadProgress: null,
      uploaderState: UploaderStates.EDITING,
      form: null,
      reChaptchaResponse: null
    }
  },
  methods: {
    onOverlayShown() {
      if (this.$refs.overlay_confirm_dialog) {
        this.$refs.overlay_confirm_dialog.focus()
      }
    },
    onSubmit(form, reChaptchaResponse) {
      this.form = form;
      this.reChaptchaResponse = reChaptchaResponse;
      this.uploaderState = UploaderStates.CONFIRMING;
    },
    onOverlayCancel() {
      this.uploaderState = UploaderStates.EDITING;
    },
    onOverlayConfirm() {
      this.performUpload();
    },
    performUpload() {
      this.uploadProgress = null;
      this.uploaderState = UploaderStates.UPLOADING;

      let formData = new FormData();
      formData.append('name', this.form.textual.name);
      formData.append('address', this.form.textual.address);
      formData.append('text', this.form.textual.text);

      if (this.form.attachment) {
        formData.append('attachment', this.form.attachment);
      }

      const config = {
        baseURL: process.env.VUE_APP_API_LOCATION,
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-G-Recaptcha-Response': this.reChaptchaResponse
        },
        onUploadProgress: (progressEvent) => {
          // 100 will probably mean that the server side processing is ongoing, so we will show a spinner during that
          this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        },
        validateStatus: (status) => {
          return status === 201; // Created
        }
      }

      axios.post(
          '/upload', formData, config
      ).then(() => {
        // TODO: check response
        this.uploaderState = UploaderStates.SUCCESS;
        localStorage.removeItem('form'); // TODO: Ez nagyon nem lesz itt jó
      }).catch(() => {
        this.uploaderState = UploaderStates.FAIL;
      });

    }
  }
}
</script>

<style scoped>

</style>
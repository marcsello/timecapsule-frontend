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


      <b-overlay :show="uploaderStatus !== UploaderStates.EDITING" no-wrap @shown="onOverlayShown"
                 @hidden="onOverlayHidden">
        <template #overlay>
          <!-- Uploader progress -->
          <div v-if="uploaderStatus === UploaderStates.UPLOADING" class="text-center rounded">
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
              v-else-if="uploaderStatus === UploaderStates.CONFIRMING"
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
          <div v-else-if="uploaderStatus === UploaderStates.SUCCESS">
            kész
          </div>
          <!-- Upload failed -->
          <div v-else>
            nemjo
          </div>
        </template>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';

const UploaderStates = {
  EDITING: 1,
  CONFIRMING: 2,
  UPLOADING: 3,
  SUCCESS: 4,
  FAIL: 5
}

export default {
  name: "Uploader",
  data() {
    return {
      UploaderStates,
      form: {
        name: null,
        address: null,
        text: null,
        attachment: null
      },
      uploadProgress: null,
      uploaderStatus: UploaderStates.EDITING
    }
  },
  methods: {
    onOverlayShown() {
      if (this.$refs.overlay_confirm_dialog) {
        this.$refs.overlay_confirm_dialog.focus()
      }
    },
    onOverlayHidden() {
      this.$refs.submit.focus()
    },
    onSubmit() {
      this.uploaderStatus = UploaderStates.CONFIRMING;
    },
    onOverlayCancel() {
      this.uploaderStatus = UploaderStates.EDITING;
    },
    onOverlayConfirm() {
      this.performUpload();
    },
    performUpload() {
      this.uploadProgress = null;
      this.uploaderStatus = UploaderStates.UPLOADING;

      let formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('address', this.form.address);
      formData.append('text', this.form.text);

      if (this.form.attachment) {
        formData.append('attachment', this.form.attachment);
      }

      const config = {
        baseURL: process.env.VUE_APP_API_LOCATION,
        headers: {
          'Content-Type': 'multipart/form-data'
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
        this.uploaderStatus = UploaderStates.SUCCESS;
      }).catch(() => {
        this.uploaderStatus = UploaderStates.FAIL;
      });

    }
  }
}
</script>

<style scoped>

</style>
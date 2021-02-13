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
              label-for="input-attachment"
              description="(Max.: 512Mb)"
          >
            <b-form-file
                id="input-attachment"
                v-model="form.attachment"
                placeholder="Válasszon vagy ejtsen ide egy fájlt..."
                drop-placeholder="Ejtse ide a fájlt..."
                browse-text="Tallózás"
                size="lg"
            />
          </b-form-group>

          <b-form-group
              id="input-group-rechaptcha"
              label="Ellenőrzés:"
              label-for="input-captcha"
          >
            <vue-recaptcha
                v-if="uploaderState === UploaderStates.EDITING"
                id="input-captcha"
                :sitekey="reChaptcha.siteKey"
                :loadRecaptchaScript="true"
                @verify="reChaptchaVerified"
                @expired="reChaptcha.response = null"
            />
          </b-form-group>


          <div class="d-flex justify-content-center">
            <b-button ref="submit" type="submit" variant="primary" :disabled="!formValid">Beküldés!</b-button>
          </div>
        </b-form>

      </b-card>


      <b-overlay :show="uploaderState !== UploaderStates.EDITING" no-wrap @shown="onOverlayShown"
                 @hidden="onOverlayHidden">
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
import VueRecaptcha from 'vue-recaptcha';
import _ from 'lodash';

const UploaderStates = {
  EDITING: 1,
  CONFIRMING: 2,
  UPLOADING: 3,
  SUCCESS: 4,
  FAIL: 5
}

const LOCAL_STORAGE_KEY = "form";

export default {
  name: "Uploader",
  components: {
    VueRecaptcha
  },
  data() {
    return {
      UploaderStates,
      form: {
        name: null,
        address: null,
        text: null,
        attachment: null
      },
      reChaptcha: {
        siteKey: process.env.VUE_APP_RECHAPTCHA_SITEKEY,
        response: null
      },
      uploadProgress: null,
      uploaderState: UploaderStates.EDITING,

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
      this.uploaderState = UploaderStates.CONFIRMING;
    },
    onOverlayCancel() {
      this.reChaptcha.response = null;
      this.uploaderState = UploaderStates.EDITING;
    },
    onOverlayConfirm() {
      this.performUpload();
    },
    reChaptchaVerified(response) {
      this.reChaptcha.response = response;
    },
    performUpload() {
      this.uploadProgress = null;
      this.uploaderState = UploaderStates.UPLOADING;

      let formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('address', this.form.address);
      formData.append('text', this.form.text);
      formData.append('g-recaptcha-response', this.reChaptcha.response);

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
        this.uploaderState = UploaderStates.SUCCESS;
      }).catch(() => {
        this.uploaderState = UploaderStates.FAIL;
      });

    },
    saveForm() {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.form));
    }
  },
  computed: {
    formValid() {
      return this.reChaptcha.response &&
          this.form.name &&
          this.form.text &&
          this.form.address;
    }
  },
  watch: {
    form: {
      handler() {
        this.debouncedSave();
      },
      deep: true
    }
  },
  created() {
    // Used to schedule save operations
    this.debouncedSave = _.debounce(this.saveForm, 2000);

    // Load the last saved state
    const saved_form = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved_form) {
      let parsed_saved_form = JSON.parse(saved_form);
      delete parsed_saved_form.attachment;
      this.form = parsed_saved_form;
    }
  }
}
</script>

<style scoped>

</style>
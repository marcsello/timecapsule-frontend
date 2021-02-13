<template>
  <b-form @submit.prevent="onSubmit">

    <b-form-group
        id="input-group-name"
        label="Név:"
        label-for="input-name"
    >
      <b-form-input
          id="input-name"
          v-model="form.textual.name"
          type="text"
          placeholder=""
          required
          :disabled="!active"
      />
    </b-form-group>


    <b-form-group
        id="input-group-address"
        label="Nagyatádi cím:"
        label-for="input-address"
    >
      <b-form-input
          id="input-address"
          v-model="form.textual.address"
          type="text"
          placeholder=""
          required
          :disabled="!active"
      />
    </b-form-group>


    <b-form-group
        id="input-group-text"
        label="Üzenet:"
        label-for="input-text"
    >
      <b-form-textarea
          id="input-text"
          v-model="form.textual.text"
          placeholder="Írjon valamit..."
          rows="5"
          max-rows="8"
          :disabled="!active"
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
          :disabled="!active"
      />
    </b-form-group>

    <b-form-group
        id="input-group-rechaptcha"
        label="Ellenőrzés:"
        label-for="input-captcha"
    >
      <vue-recaptcha
          v-if="active"
          id="input-captcha"
          :sitekey="reChaptcha.siteKey"
          :loadRecaptchaScript="true"
          @verify="reChaptchaVerified"
          @expired="reChaptcha.response = null"
      />
    </b-form-group>


    <div class="d-flex justify-content-center">
      <b-button type="submit" variant="primary" :disabled="!(active && formValid)">Beküldés!</b-button>
    </div>
  </b-form>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import _ from 'lodash';

const LOCAL_STORAGE_KEY = "form";

export default {
  name: "UploaderForm",
  components: {
    VueRecaptcha
  },
  props: {
    active: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      form: {
        textual: {
          name: null,
          address: null,
          text: null
        },
        attachment: null
      },
      reChaptcha: {
        siteKey: process.env.VUE_APP_RECHAPTCHA_SITEKEY,
        response: null
      }
    }
  },
  methods: {
    reChaptchaVerified(response) {
      this.reChaptcha.response = response;
    },
    onSubmit() {
      this.$emit('submit', this.form, this.reChaptcha.response);
    },
    saveForm() {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.form.textual));
    }
  },
  computed: {
    formValid() {
      return this.reChaptcha.response &&
          this.form.textual.name &&
          this.form.textual.text &&
          this.form.textual.address;
    }
  },
  created() {
    // Used to schedule save operations
    this.debouncedSave = _.debounce(this.saveForm, 1000);

    // Load the last saved state
    const saved_form_data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved_form_data) {
      this.form.textual = JSON.parse(saved_form_data);
    }
  },
  watch: {
    'form.textual': {
      handler() {
        this.debouncedSave();
      },
      deep: true
    },
    active(newValue) {
      if (newValue) {
        // Clear value on activation
        this.reChaptcha.response = null;
      }
    }
  }
}
</script>

<style scoped>

</style>
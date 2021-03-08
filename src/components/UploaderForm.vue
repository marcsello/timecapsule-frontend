<template>
  <validation-observer ref="observer" v-slot="{ handleSubmit }">
    <b-form novalidate @submit.prevent="handleSubmit(onSubmit)">
      <validation-provider
          name="name"
          rules="required"
          v-slot="validationContext"
      >
        <b-form-group
            id="input-group-name"
            label="Név:"
            label-for="input-name"
        >
          <template slot="label">Név: <span class="red-star">*</span></template>
          <b-form-input
              id="input-name"
              v-model="form.textual.name"
              type="text"
              placeholder=""
              :disabled="!active"
              :state="getValidationState(validationContext)"
          />
          <b-form-invalid-feedback id="input-name-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
          name="address"
          rules="required"
          v-slot="validationContext"
      >
        <b-form-group
            id="input-group-address"
            label="Lakcím:"
            label-for="input-address"
        >
          <template slot="label">Lakcím: <span class="red-star">*</span></template>
          <b-form-input
              id="input-address"
              v-model="form.textual.address"
              type="text"
              placeholder=""
              :state="getValidationState(validationContext)"
              :disabled="!active"
          />
          <b-form-invalid-feedback id="input-address-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
          name="email"
          rules="email"
          v-slot="validationContext"
      >
        <b-form-group
            id="input-group-email"
            label="e-mail cím:"
            label-for="input-email"
        >
          <b-form-input
              id="input-email"
              v-model="form.textual.email"
              type="email"
              placeholder=""
              :state="getValidationState(validationContext)"
              :disabled="!active"
          />
          <b-form-invalid-feedback id="input-email-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
          name="phone"
          rules="phone"
          v-slot="validationContext"
      >
        <b-form-group
            id="input-group-phone"
            label="Telefon:"
            label-for="input-phone"
        >
          <b-form-input
              id="input-phone"
              v-model="form.textual.phone"
              type="text"
              placeholder=""
              :state="getValidationState(validationContext)"
              :disabled="!active"
          />
          <b-form-invalid-feedback id="input-phone-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>


      <validation-provider
          name="text"
          rules="required|max:2097152"
          v-slot="validationContext"
      >
        <b-form-group
            id="input-group-text"
            label="Üzenet:"
            label-for="input-text"
        >
          <template slot="label">Üzenet: <span class="red-star">*</span></template>
          <b-form-textarea
              id="input-text"
              v-model="form.textual.text"
              placeholder="Írjon valamit..."
              rows="5"
              max-rows="8"
              :disabled="!active"
              :state="getValidationState(validationContext)"
          />
          <b-form-invalid-feedback id="input-text-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
          name="attachement"
          rules="size:524288"
          v-slot="validationContext"
      >
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
              :state="getValidationState(validationContext)"
              @change="validationContext.validate($event)"
          />
          <b-form-invalid-feedback id="input-attachement-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
          name="attachement"
          rules="must_accept"
          v-slot="validationContext"
      >
        <b-form-group
            id="input-group-privacy"
            label-for="input-privacy"
        >
          <b-form-checkbox
              id="input-privacy"
              v-model="form.privacy_policy_accepted"
              :disabled="!active"
              :state="getValidationState(validationContext)"
          >
            Az <b-link v-b-modal.privacy-policy-popup>adatkezelési tájékoztatatóban</b-link> foglaltakat tudomásul vettem és elfogadom. <span
              class="red-star">*</span>
          </b-form-checkbox>
          <b-form-invalid-feedback :state="getValidationState(validationContext)" id="input-privacy-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
          name="captcha"
          rules="must_accept"
          v-slot="validationContext"
      >
        <b-form-group
            id="input-group-rechaptcha"
            label="Ellenőrzés:"
            label-for="input-captcha"
        >
          <template slot="label">Ellenőrzés: <span class="red-star">*</span></template>
          <div id="input-captcha-placeholder">
            <!-- vue-rechaptcha does not use the v-model property, it's here only for vee-validate -->
            <vue-recaptcha
                v-if="active"
                id="input-captcha"
                :sitekey="reChaptcha.siteKey"
                :loadRecaptchaScript="true"
                @verify="reChaptchaVerified"
                @expired="reChaptcha.response = null"
                v-model="reChaptchaValid"
            />
          </div>
          <b-form-invalid-feedback :state="getValidationState(validationContext)" id="input-privacy-live-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <div class="d-flex justify-content-center">
        <b-button type="submit" variant="primary" :disabled="!active">Beküldés!</b-button>
      </div>

    </b-form>
  </validation-observer>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import {ValidationProvider, ValidationObserver, extend, setInteractionMode} from 'vee-validate';
import {required, email, size, max} from 'vee-validate/dist/rules';
import _ from 'lodash';

const LOCAL_STORAGE_KEY = "form";

// --- setup vee-validate
setInteractionMode('eager');
extend('required', {
  ...required,
  message: "A mező kitöltése kötelező!"
});

extend('email', {
  ...email,
  message: "Érvénytelen e-mail cím!"
});
extend('size', {
  ...size,
  message: "A fájl mérete túl nagy!"
});
const phone_regex = new RegExp("^\\+?[0-9]{6,13}$");
extend('phone', {
  validate(value) {
    return phone_regex.test(value);
  },
  message: "Érvénytelen telefonszám!"
});
extend('max', {
  ...max,
  message: "A szöveg túl hosszú!"
});
extend('must_accept', {
  validate(value) {
    return value;
  },
  message: "Kötelező elfogadni!"
})
// --- end of vee-validate stuff

export default {
  name: "UploaderForm",
  components: {
    VueRecaptcha,
    ValidationProvider,
    ValidationObserver
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
          email: null,
          phone: null,
          text: null
        },
        privacy_policy_accepted: false,
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
    },
    getValidationState({validated, valid = null}) {
      return validated ? (valid ? null : false) : null;
    },
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
  },
  computed: {
    reChaptchaValid() {
      // This is only used to let rechaptcha have v-model property, so that vee-validate can find it
      // For some reason vee-validate does not support reading values from the data object, so we need this dirty fix
      return !!this.reChaptcha.response;
    }
  }
}
</script>

<style scoped>
#input-captcha-placeholder {
  height: 78px;
  width: 304px;
}

span.red-star {
  color: red;
  font-weight: bold;
}
</style>
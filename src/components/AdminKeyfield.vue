<template>
  <b-row>
    <b-col>
      <b-card>
        <b-form @submit.prevent="onSubmit">
          <b-form-group
              id="input-group-key"
              label="Kulcs:"
              label-for="input-key"
          >
            <b-form-input
                id="input-key"
                v-model="form.key"
                type="password"
                placeholder=""
                required
            />
          </b-form-group>

          <div class="d-flex justify-content-center">
            <b-button ref="submit" type="submit" variant="primary">Mehet</b-button>
          </div>

        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "AdminKeyfield",
  data() {
    return {
      form: {
        key: null
      }
    }
  },
  event: [
    'submit'
  ],
  methods: {
    onSubmit() {
      this.$emit('submit',this.form.key);
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <uploader v-resize @resize="onResize"/>
</template>

<script>
import Uploader from "@/components/Uploader";

export default {
  name: 'Home',
  components: {
    Uploader
  },
  mounted() {
    this.$notifyHeightChange();
  },
  created() {
    window.addEventListener("resize", () => this.$notifyHeightChange());
  },
  destroyed() {
    window.removeEventListener("resize", () => this.$notifyHeightChange());
  },
  methods: {
    onResize(e) {
      this.$notifyHeightChange(e.detail.height);
    }
  }
}
</script>

<template>
  <uploader/>
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
  }
}
</script>

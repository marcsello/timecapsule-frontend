<template>
  <div id="app">
    <privacy-policy-popup/>
    <router-view/>
  </div>
</template>


<script>
import PrivacyPolicyPopup from "@/components/PrivacyPolicyPopup";

export default {
  name: "App",
  components: {
    PrivacyPolicyPopup
  }
}

</script>

<style>

</style>

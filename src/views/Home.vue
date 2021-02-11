<template>
  <div class="home">
    <b-container>
      <briefing/>
      <uploader/>
    </b-container>
  </div>
</template>

<script>
import Briefing from "@/components/Briefing";
import Uploader from "@/components/Uploader";


export default {
  name: 'Home',
  components: {
    Briefing, Uploader
  }
}
</script>

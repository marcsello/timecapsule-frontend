<template>
  <div id="home">
    <b-container>
      <briefing/>
      <uploader/>
      <afterword/>
    </b-container>
  </div>
</template>

<script>
import Briefing from "@/components/Briefing";
import Uploader from "@/components/Uploader";
import Afterword from "@/components/Afterword";


export default {
  name: 'Home',
  components: {
    Briefing, Uploader, Afterword
  }
}
</script>

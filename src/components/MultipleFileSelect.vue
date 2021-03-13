<template>
  <div class="uploadBox">

    <div>

      <div
          class="dropArea"
          @ondragover="onChange"
          v-bind:class="{dropAreaDragging: dragging, dropAreaJumbo: items.length === 0}"
          @dragenter="dragging=true"
          @dragend="dragging=false"
          @dragleave="dragging=false"
      >
        <input ref="fileInputField" type="file" id="items" multiple @change="onChange">
        <h3>{{ uploaderHelpText }}</h3>
        <h4>Vagy kattintson a tallózáshoz</h4>
      </div>

    </div>

  </div>
</template>

<script>

/*
function bytesToSize(bytes) {
  // http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i === 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}
*/

export default {
  props: {
    minItems: {
      type: Number,
      default: 0
    },
    maxItems: {
      type: Number,
      default: 30
    },
    accept: {
      type: String,
      default: "image/*"
    }
  },
  data() {
    return {
      dragging: false,
      items: []
    }
  },

  methods: {
    onChange(e) {
      this.dragging = false;
      let files = e.target.files || e.dataTransfer.files;
      files.forEach((file) => {
        this.items.push(file);
      });
      this.$refs.fileInputField.value = ""; // reset
    }
  },
  computed: {
    itemsTotalSize() {
      return '';
    },
    uploaderHelpText() {
      if (this.items.length === 0) {
        return "Húzza ide a feltölteni kívánt fájlokat";
      } else {
        return "Húzza ide a további fájlokat";
      }
    }
  }
}
</script>

<style scoped>
.uploadBox .dropArea {
  /* Needed for the full sized input */
  position: relative;
  width: 100%;

  border: 1px solid #CED4DA;
  border-radius: 5px;
  text-align: center;
  padding: 2em 0;
}

.uploadBox .dropAreaJumbo {
  padding: 4em 0;
}

.uploadBox .dropAreaDragging {
  box-shadow: #CED4DA 0 0 10px;
  border-color: #0069D9;
}

.uploadBox .dropArea input {
  /* so that file input will cover the entire area */
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

</style>

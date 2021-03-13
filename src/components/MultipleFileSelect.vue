<template>
  <div>
    <b-list-group>
      <b-list-group-item
          v-for="(item,idx) in items"
          :key="idx"
          class="d-flex justify-content-between align-items-center"
          :variant="getListItemVariant(idx)"
      >
        <div class>{{ item.name }}
          <b-badge
              :variant="item.size > maxSizePerFile ? 'danger' : 'secondary'"
          >{{ bytesToSize(item.size) }}</b-badge>
        </div>
        <b-button size="sm" variant="outline-danger" @click="removeItem(idx)">
          <b-icon icon="trash"/>
        </b-button>
      </b-list-group-item>

      <b-list-group-item
          class="dropArea"
          @ondragover="onChange"
          v-bind:class="{dropAreaDragging: dragging, dropAreaJumbo: items.length === 0}"
          @dragenter="dragging=true"
          @dragend="dragging=false"
          @dragleave="dragging=false"
          v-if="items.length < maxItems"
      >


        <input :accept="accept" ref="fileInputField" type="file" id="items" multiple @change="onChange">
        <h3>{{ uploaderHelpText }}</h3>
        <h4>Vagy kattintson a tallózáshoz</h4>


      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>

export default {
  props: {
    maxSizePerFile: {
      type: Number,
      default: 10485760 // 10MB
    },
    maxItems: {
      type: Number,
      default: 50
    },
    accept: {
      type: String,
      default: ""
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
    },
    bytesToSize(bytes) {
      // http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      if (i === 0) return bytes + ' ' + sizes[i];
      return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    },
    removeItem(idx) {
      this.items.splice(idx, 1);
    },
    getListItemVariant(idx) {
      return (idx + 1) > this.maxItems ? 'warning' : ''
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
.dropArea {
  /* Needed for the full sized input */
  position: relative;
  width: 100%;

  text-align: center;
  padding: 2em 0;
}

.dropArea:hover {
  background-color: #fafafa;
}

.dropAreaJumbo {
  padding: 4em 0;
}

.dropAreaDragging {
  box-shadow: #CED4DA 0 0 10px;
}

.dropArea > input {
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

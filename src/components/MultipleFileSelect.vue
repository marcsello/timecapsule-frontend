<template>
  <div>
    <b-list-group :class="{listGroupInvalid: state === false, listGroupValid: state === true}">
      <b-list-group-item
          v-for="(item,idx) in items"
          :key="idx"
          class="d-flex justify-content-between align-items-center"
          :variant="getListItemVariant(idx)"
      >
        <div>
          <div class="d-inline-block mr-2 file-name">{{ item.name }}</div>
          <b-badge
              :variant="getSizeBadgeVariant(idx)"
          >{{ bytesToSize(item.size) }}
          </b-badge>
        </div>
        <b-button size="sm" variant="outline-danger" @click="removeItem(idx)" :disabled="disabled">
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


        <input :accept="accept" :disabled="disabled" ref="fileInputField" type="file" id="items" multiple
               @change="onChange">
        <h3>{{ uploaderHelpText }}</h3>
        <h4>Vagy kattintson a tallózáshoz</h4>


      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  model: {
    prop: 'items',
    event: 'change'
  },
  props: {
    maxSizePerItem: {
      type: Number,
      default: 10485760 // 10MB
    },
    minSizePerItem: {
      type: Number,
      default: 0
    },
    maxItems: {
      type: Number,
      default: 50
    },
    accept: {
      type: String,
      default: ""
    },
    state: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dragging: false,
      validator: {
        tokens: {
          ext: [],
          mime: []
        }
      }
    }
  },
  methods: {
    validateFileAccept(file) {
      if (!this.accept) {
        return true;
      }
      const extension_extractor = /(?:\.([^.]+))?$/;
      const extension = extension_extractor.exec(file.name)[0];

      return this.validator.tokens.ext.some((token) => {
        return extension === token;
      }) || this.validator.tokens.mime.some((token) => {
        return token.test(file.type);
      })
    },
    onChange(e) {
      this.dragging = false;
      let files = e.target.files || e.dataTransfer.files;
      let mutableItems = _.clone(this.items);
      files.forEach((file) => {
        if (this.validateFileAccept(file)) {
          mutableItems.push(file);
        }
      });
      this.$emit('change', mutableItems);
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
      let mutableItems = _.clone(this.items);
      mutableItems.splice(idx, 1);
      this.$emit('change', mutableItems);
    },
    getListItemVariant(idx) {
      return (idx + 1) > this.maxItems ? 'warning' : ''
    },
    getSizeBadgeVariant(idx) {
      const item = this.items[idx];
      if (item.size > this.maxSizePerItem || item.size < this.minSizePerItem) {
        return 'danger';
      } else {
        return 'secondary';
      }
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
  },
  watch: {
    accept: {
      immediate: true,
      handler(value) {

        if(!value) {
          // do nothing on empty value
          return;
        }

        // Setup file validator
        const tokens = this.accept.split(',').map(x => x.trim());
        this.validator.tokens.ext = [];
        this.validator.tokens.mime = [];
        tokens.forEach((token) => {
          if (token[0] === '.') {
            // Extension check
            this.validator.tokens.ext.push(token);
          } else {
            // Mime check
            const mime_test = new RegExp(token.replace('*', '[^\\/,]+'));
            this.validator.tokens.mime.push(mime_test);
          }
        });

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

.listGroupInvalid > div {
  border-color: #dc3545;
}

.listGroupValid > div {
  border-color: green;
}

div.file-name {
  word-break: break-all;
}

</style>

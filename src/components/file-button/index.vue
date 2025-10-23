<template>
  <div
    class="page-button file-button"
  >
    <page-button class="file-button-btn"
      :type="type"
      :disabled="disabled"
      :icon="icon"
      :color="color"
      @click="onBtnClick"
    >
    <span v-if="content">{{content}}</span>
    <slot name="content"></slot>
  </page-button>
    <input type="file"
      class="file-button--input"
      :multiple="multiple"
      :accept="accepts"
      @change="onFileChange"
      ref="input"
    />
  </div>
</template>

<script>
  export default {
    name: 'fileButton',
    props: {
      content: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'button'
      },
      icon: {
        type: String,
        default: null
      },
      color: {
        type: String,
        default: null
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      accept: {
        type: [String, Array],
        default: '*'
      }
    },
    computed: {
      accepts() {
        if (this.accept instanceof Array) {
          return this.accept.join(',')
        }
        return this.accept
      },
    },
    methods: {
      onBtnClick() {
        this.$refs.input.click()
      },
      onFileChange(e) {
        const files = e.target.files
        this.$emit('change', files)        
        this.$refs.input.value = null
      }
    }
  }
</script>

<style lang="less">
.file-button {
  display: inline-block;
  padding: 0 !important;
  height: auto !important;
  background: none !important;
  border: none !important;
}
.file-button--input {
  display: none;
}
</style>

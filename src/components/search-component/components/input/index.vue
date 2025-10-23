<template>
  <el-input class="search-component__input"
      :value="item.value"
      :disabled="disabled"
      :placeholder="`请输入${item.label}`"
      clearable
      v-bind="$attrs"
      @input="onInput"
      @keyup.enter.native="onEnter"
    >
  </el-input>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    onInput(value) {
      this.item.value = value
      this.$emit('update:value', {
        item: this.item,
        value
      })
    },
    onEnter() {
      this.$emit('enter')
    }
  }
}
</script>

<style>
</style>

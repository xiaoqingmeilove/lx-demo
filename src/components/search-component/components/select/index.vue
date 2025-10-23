<template>
  <el-select class="search-component__select"
    :value="item.value"
    :placeholder="`请选择${item.label}`"
    clearable
    v-bind="item.props"
    @change="onSelectChange"
  >
    <el-option v-for="(opt, optIndex) in selectOptions" :key="optIndex"
      :label="opt.label"
      :value="opt.value"
    >
      {{opt.label}}
    </el-option>
  </el-select>
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
    },
    sourceList: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    selectOptions() {
      return this.sourceList[this.item.source] ?? []
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    onSelectChange(value) {
      this.item.value = value
      this.$emit('update:value', {
        item: this.item,
        value
      })
    }
  }
}
</script>

<style>
</style>

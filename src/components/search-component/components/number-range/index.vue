<template>
  <div class="search-component__numberrange">
    <el-input class="search-component__numberrange-input"
      type="number"
      v-model="item.value[0]"
      placeholder="最小值"
      @input="onInput($event, 0)"
      @keyup.enter.native="onEnter"
    ></el-input>
    <span>~</span>
    <el-input class="search-component__numberrange-input"
      v-model="item.value[1]"
      type="number"
      placeholder="最大值"
      @input="onInput($event, 1)"
      @keyup.enter.native="onEnter"
    ></el-input>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    created() {

    },
    methods: {
      onInput(value, index) {
        this.$emit('update:value', {
          item: this.item,
        })
      },
      onEnter() {
        this.$emit('enter')
      }
    }
  }
</script>

<style lang="scss">
.search-component__numberrange {
  display: flex;
  align-items: center;
  border: 1px solid #DCDFE6;
}
.search-component__numberrange-input {
  .el-input__inner {
    text-align: center;
    border: none;
    -moz-appearance: textfield;
    appearance: textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
  }
}
</style>

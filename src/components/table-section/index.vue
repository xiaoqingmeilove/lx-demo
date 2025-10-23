<template>
  <div class="view-section" :class="[!loaded ? 'flex-table-section' : '']" :style="viewSectionStyle">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'tableSection',
    props: {
      loaded: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      viewSectionStyle() {
        return this.loaded ? {
          flex: 'none',
          height: 'auto'
        } : {}
      }
    }
  }
</script>

<style lang="less">
.flex-table-section {
  flex: 1;
  height: 0;
  .app-table-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .app-table-body {
      flex: 1;
      height: 0;
    }
  }
}
</style>

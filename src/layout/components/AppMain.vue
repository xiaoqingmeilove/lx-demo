<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="inclueds">
        <router-view :key="key" class="app-page" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  import { mapState } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    ...mapState({
      cachedViews: (state) => state.tagsView.cachedViews,
    }),
    keepAlive() {
      const keepAlive = this.$route.meta?.keepAlive
      return keepAlive !== false
    },
    inclueds() {
      console.log('this.cachedViews', this.cachedViews)
      return this.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  position: relative;
  overflow: hidden;
  flex: 1;
  height: 0;
}
.app-main-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>

<template>
  <app-page>
    <!-- <div class="view-section micro-container"> -->
      <!-- <div id="subapp-viewport" v-qiankun-anchor></div> -->
      <!-- <portal-target name="microapp-outlet" multiple /> -->
    <!-- </div>router.beforeEach -->
     <MicroAnchor :minHeight="600" />
  </app-page>
</template>

<script>
import MicroAnchor from './MicroAnchor.vue'
export default {
  name: 'MicroAppContainer',
  components: { MicroAnchor }
}
</script>

<style scoped lang="less">

</style>


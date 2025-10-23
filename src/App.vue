<template>
  <div id="app">
    <router-view />

    <!-- <portal to="microapp-outlet"> -->
    <!-- <div id="subapp-viewport"></div> -->
    <!-- </portal> -->
    <!-- 永久存在的宿主（qiankun 指向它）-->
    <div id="react-micro-host" style="display: none"></div>

    <!-- 可选：停车位（路由离开时把宿主停回这里并隐藏） -->
    <div id="micro-host-park" style="display: none"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "App",
  created() {
    this.initTheme();
  },
  methods: {
    ...mapActions("Theme", ["getTheme"]),
    ...mapActions("Common", ["getPCAData", "getDicts"]),
    initTheme() {
      this.getTheme();
      this.getPCAData();
      this.getDicts();
    },
  },
};
</script>

<style></style>

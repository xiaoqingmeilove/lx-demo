<!-- src/components/MicroAnchor.vue -->
<template>
  <!-- 这里是你想放子应用的位置 -->
  <div class="micro-slot" :style="slotStyle"></div>
</template>

<script>

export default {
  name: "MicroAnchor",
  props: {
    minHeight: { type: [String, Number], default: 300 },
  },
  computed: {
    slotStyle() {
      return {
        minHeight:
          typeof this.minHeight === "number"
            ? this.minHeight + "px"
            : this.minHeight,
        width: "100%",
      };
    },
  },
  mounted() {
    // 延迟到下一个渲染帧再移动，避免与周边组件 mounted 冲突
    this.$nextTick(() => {
      requestAnimationFrame(() => {
        const host = document.getElementById("react-micro-host");
        if (!host) {
          console.error("[qiankun] host not found: #react-micro-host");
          return;
        }
        this.$el.appendChild(host);
        host.style.display = "";
        host.style.width = "100%";
        host.style.height = "100%";
        // 通知外部“宿主就位”
        window.__MICRO_HOST_READY__ = true;
      });
    });
  },
  beforeDestroy() {
    const host = document.getElementById("react-micro-host");
    const park = document.getElementById("micro-host-park");
    if (host && park && host.parentNode !== park) {
      park.appendChild(host);
      host.style.display = "none";
      host.style.width = host.style.height = "";
    }
    window.__MICRO_HOST_READY__ = false;
  },
};
</script>

<style scoped>
.micro-slot {
  display: block;
}
</style>

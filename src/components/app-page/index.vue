<template>
  <div class="app-page" flex>
    <div class="app-page-view">
      <div class="app-page-main" :class="[flex ? 'app-page-main-flex' : '']">
        <slot></slot>
      </div>
      <div class="app-page-footer" v-if="showFooter">
        <template v-if="$scopedSlots.footer">
          <div class="app-page-footer-content">
            <slot name="footer"></slot>
          </div>
        </template>
        <!-- <div class="app-page-footer-right">
          <span>版本号: {{config.Version}}</span>
          <span>{{config.Name}}</span>
        </div> -->
      </div>
    </div>
    <slot name="custom"></slot>
  </div>
</template>

<script>
import WEB_CONFIG from "@/config/web.config.js";

export default {
  name: "appPage",
  props: {
    flex: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      config: { ...WEB_CONFIG },
    };
  },
};
</script>

<style lang="less">
.app-page-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 0;
  .app-page-main {
    flex: 1;
    height: 0;
    padding: 16px 16px 0;
    overflow: auto;
    width: 100%;
    .view-section:last-child {
      margin-bottom: 6px;
    }
  }
  .app-page-main-flex {
    display: flex;
    flex-direction: column;
  }
  .app-page-footer {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 16px;
    margin-bottom: 6px;
    background: none;
    font-size: 14px;
    color: #a3a3a3;
    .app-page-footer-content {
      display: flex;
      align-items: center;
      height: 100%;
      flex: 1;
      width: 0;
      white-space: nowrap;
      overflow: hidden;
      & + .app-page-footer-right {
        margin-left: 10px;
      }
    }
    .app-page-footer-right {
      margin-left: auto;
      display: flex;
      align-items: center;
      height: 100%;
      span {
        + span {
          margin-left: 100px;
        }
      }
    }
  }
}
</style>

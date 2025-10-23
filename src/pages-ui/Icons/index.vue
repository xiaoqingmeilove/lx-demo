<template>
  <app-page :flex="false">
    <h3>图标</h3>
    <ul class="icon-list clear">
      <li v-for="item in iconList" :key="item">
        <div class="icon-wrapper">
          <svg-icon :icon-class="item" :font-size="32" />
          <span>{{item}}</span>
        </div>
      </li>
    </ul>
    <h3>图标颜色</h3>
    <div>
      <svg-icon icon-class="guide" />
      <svg-icon icon-class="guide" fill="red" />
      <svg-icon icon-class="guide" style="fill: #00f;" />
    </div>
    <h3>图标大小</h3>
    <div>
      <svg-icon icon-class="guide" />
      <svg-icon icon-class="guide" :size="24" />
      <svg-icon icon-class="guide" size="24px" />
      <svg-icon icon-class="guide" :font-size="36" />
      <svg-icon icon-class="guide" font-size="36px" />
      <svg-icon icon-class="guide" style="width: 48px; height: 48px;" />
      <svg-icon icon-class="guide" style="font-size: 48px;" />
    </div>
  </app-page>
</template>

<script>
  import { SVG_ICONS } from '@/icons'

  export default {
    data() {
      return {
        iconList: [...SVG_ICONS]
      }
    }
  }
</script>

<style lang="less" scoped>
h3 {
  margin: 20px 0;
}
ul.icon-list {
  width: 900px;
  margin: 0 auto;
  border: solid 1px #ddd;
  border-radius: 4px;
  overflow: none;
  > li {
    float: left;
    text-align: center;
    width: 16.66%;
    height: 120px;
    color: #595959;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin-right: -1px;
    margin-bottom: -1px;
    box-sizing: content-box;
    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      svg {
        margin-bottom: 16px;
      }
    }
  }
}
</style>

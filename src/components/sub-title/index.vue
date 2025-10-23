<template>
  <div class="sub-title">
    <div class="sub-title-beforeIcon" v-if="$scopedSlots.beforeIcon">
      <slot name="beforeIcon"></slot>
    </div>
    <h4 v-if="$scopedSlots.title" :class="{highlight: high}">
      <slot name="title"></slot>
    </h4>
    <template v-else>
      <h4 :class="{highlight: high}">{{title}}</h4>
    </template>    
    <div class="sub-title-description" v-if="$scopedSlots.description">
      <slot name="description"></slot>
    </div>
    <div class="sub-title-buttons" v-if="$scopedSlots.buttons">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'subTitle',
    props: {
      title: {
        type: String,
        default: ''
      },
      high: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="less">
.sub-title {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  height: 32px;
  white-space: nowrap;
  color: #595959;
  margin: 5px 0;
  > h4 {
    display: inline-block;
    position: relative;
    margin: 0;
    padding: 0 0 0 9px;
    font-size: 15px;
    color: #333;
    line-height: 20px;
    font-weight: 600;
    
    &.highlight::before {
      content: "";
      display: block;
      position: absolute;
      left: 3px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 2px;
      height: 70%;
      background: var(--base-color);
      border-radius: 50px;
      pointer-events: none;
    }
  }
  .sub-title-description{
    margin: 0 10px;
    font-size: 14px;
  }
  .sub-title-buttons {
    display: flex;
    align-items: center;
    margin-left: auto;
    height: 100%;
  }
}
</style>

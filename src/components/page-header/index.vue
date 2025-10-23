<template>
  <div class="page-header">
    <div class="page-header-title" v-if="!!name || !!sysName">
      <div class="page-header--name" v-if="name">
        <span>{{name}}</span>
      </div>
      <div v-if="sysName">
        <span>{{sysName}}</span>
      </div>
    </div>
    <div class="page-header-content" v-if="$slots.content">
      <slot name="content"></slot>
    </div>
    <div class="page-header-buttons" v-if="$slots.buttons">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pageHeader',
    props: {
      name: {
        type: String,
        default: ''
      },
      sysName: {
        type: String,
        default: ''
      }
    },
  }
</script>

<style lang="less">
.page-header {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 6px;
  height: 40px;
  .page-header-title {
    display: flex;
    font-size: 18px;
    height: 100%;
    color: #A9B6CB;
    white-space: nowrap;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0 18px;
    }
    > div + div {
      margin-left: 18px;
    }
    > div::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 1px;
      height: 60%;
      background: #A9B6CB;
    }
    > div:first-child::before {
      display: none;
    }
  }
  .page-header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 0;
    height: 100%;
  }
  .page-header-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    margin-left: auto;
  }
  .page-header-right {
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 100%;
  }
}
.page-header--name {
  color: var(--base-color);
  background: #e3f1fd;
  border-radius: 5px;
}
</style>

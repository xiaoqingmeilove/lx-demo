<template>
  <!-- 定时刷新 -->
  <div class="auto-refresh-page">
    <div>
      <span>开启：</span>
      <vxe-checkbox v-model="open" @change="openChange"></vxe-checkbox>
    </div>
    <div>
      <span>自动刷新：</span>
      <vxe-select v-model="refreshTime" @change="refreshTimeChange" style="width:100px;" size="small">
        <vxe-option
          v-for="(item, index) in timeList"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></vxe-option>
      </vxe-select>
    </div>
    <page-button @click="$emit('init')" style="margin-left:12px;">手动刷新</page-button>
  </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

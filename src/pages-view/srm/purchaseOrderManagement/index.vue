<template>
  <app-page>
    <div class="view-section">
      <sub-title :title="$route.meta.title || '采购订单管理'" />
      <div class="placeholder">
        暂无内容（占位页面）。
      </div>
    </div>
  </app-page>
</template>

<script>
export default {
  name: 'SRM_purchaseOrderManagement',
}
</script>

<style scoped lang="less">
.placeholder {
  color: #909399;
  padding: 16px 0;
}
</style>


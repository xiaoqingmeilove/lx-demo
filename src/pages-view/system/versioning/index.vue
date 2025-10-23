<template>
  <app-page>
    <table-section  ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high title="版本维护"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
               <page-button content="新增" @click="$router.push({ path: `/system/versioning-detail/detail` })" type="text" style="margin-left: 36px;">
                <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
               </page-button>
            </template>
            <template #tools>
              <table-tools :default-columns="defaultColumns" @ok="onToolOk"></table-tools>
            </template>
          </vxe-toolbar>
        </div>
        <div class="app-table-body" style="margin-bottom: 10px">
          <vxe-grid
            :id="`tb_bbgl_${userInfo.userId}`"
            class="table"
            resizable
            show-overflow
            row-key
            :columns="columns"
            :tree-config="{
              transform: true,
              rowField: 'id',
              parentField: 'parentId',
              expandAll: true,
            }"
            :data="tableData"
            :scroll-y="{ enabled: true }"
            :custom-config="{ storage: true }"
            @cell-dblclick="onCellDbClick"
            height="auto"
            ref="table"
          >
          
        </vxe-grid>
        </div>
      </div>
    </table-section>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_purchaseOrder_takeDelivery_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? '收货单'"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <!-- <page-button @click="exprot" type="text" style="margin-left: 36px;">
                <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
                导出
              </page-button> -->
            </template>
            <template #tools>
              <table-tools :default-columns="defaultColumns" @ok="onToolOk" ref="tools"></table-tools>
            </template>
          </vxe-toolbar> 
        </div>
        <div class="app-table-body">
          <vxe-grid
            :id="`tb_purchaseOrder_takeDelivery_${userInfo.userId}`"
            :data="tableData"
            :columns="tableColumns"
            height="auto"
            :custom-config="{ storage: true }"
            @cell-dblclick="onCellDbClick"
            ref="table"
          >
            <template #rowNum="{row, rowIndex}">
              {{rowIndex + 1}}
            </template>
            <template #orderBillNo="{row}">
              <span style="color: var(--base-color);cursor: pointer;" @click="toOrderDetail(row)">{{row.orderBillNo}}</span>
            </template>
            <template #billNo="{row}">
              <span style="color: var(--base-color)">{{row.billNo}}</span>
            </template>
            <template #orderBizFlowStatus="{ row ,column}">
              <biz-flow-status :state="row.bizFlowStatus"></biz-flow-status>
            </template>
            <template #syncAps="{ row }">
              <span v-if="row.syncAps == '1'" style="color: var(--special-button-bg);">{{row.syncApsName}}</span>
              <span v-else style="color: red;">{{row.syncApsName}}</span>
            </template>
            <!-- <template #billState="{ row }">
              <bill-state :state="row.billState"></bill-state>
            </template> -->
            <template #pager>
              <vxe-pager
                :current-page.sync="tablePage.currentPage"
                :page-size.sync="tablePage.pageSize"
                :total="tablePage.total"
                @page-change="handlePageChange"
              ></vxe-pager>
            </template>
            </vxe-grid>
        </div> 
      </div>
    </table-section>
  </app-page>
</template>

<script src="./index.js" />
<style scoped lang="less">

</style>

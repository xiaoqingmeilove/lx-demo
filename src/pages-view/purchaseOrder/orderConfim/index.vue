<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_purchaseOrder_orderConfim_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? '采购订单确认'"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button type="text" style="margin-left: 36px;" @click="confirm">确认</page-button>
              <page-button type="text" style="margin-left: 36px;color:red" @click="reject">拒绝</page-button>
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
            :id="`tb_purchaseOrder_orderConfim_${userInfo.userId}`"
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
            <template #billNo="{row}">
              <span style="color: var(--base-color)">{{row.billNo}}</span>
            </template>
            <template #billState="{ row ,column}">
              <span class="status" :style="{color: getColorAndName(row, column, sourceList.billStateList).color}">
                <span class="dot" :style="{background: getColorAndName(row, column, sourceList.billStateList).color}"></span>
                <span>{{getColorAndName(row, column, sourceList.billStateList).label}}</span>
              </span>
              <!-- <bill-state :state="row.billState"></bill-state> -->
            </template>
            <template #agreeFlag="{ row ,column}">
              <span> 
                <span class="row-bg" :style="{background: `${row.agreeFlag == '1' ? '#49b714' : '#a2a2a2'}`}">
                  {{row.agreeFlag == '1' ? '已确认' : '未确认'}}
                </span>
              </span>
            </template>
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

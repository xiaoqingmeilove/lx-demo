<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_bidding_winBidPricing_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      ></search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? ''"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button content="导出" @click="exportExec" type="text" style="margin-left: 36px;" >
                <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
              </page-button>
            </template>
            <template #tools>
              <table-tools
                :default-columns="defaultColumns"
                @ok="onToolOk"
              ></table-tools>
            </template>
          </vxe-toolbar>
        </div>
        <div class="app-table-body">
          <vxe-grid
            :data="tableData"
            :id="`tb_bidding_winBidPricing_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            @cell-dblclick="onCellDbClick"
            ref="table"
            height="auto"
          >
            <template #billState="{ row, rowIndex }">
              <bill-state :state="row.billState"></bill-state>
            </template>
            <template #btnStateInfo="{ row, rowIndex,column }">
              <btn-state-info
                :state="row[column.field]"
                :dictName="column?.params?.dictName ?? ''"
              ></btn-state-info>
            </template>
            <template #slot_Flag="{row, column}">
              <page-button theme="success" v-if="parseFloat(row[column.field]) === 1">是</page-button>
              <page-button theme="danger" v-if="parseFloat(row[column.field])=== 0">否</page-button>
            </template>
            <template #involvedFlag="{row, column}">
              <span>{{getInvolved(row[column.field])}}</span>
            </template>
        </vxe-grid>
        </div>
        <div class="app-table-footer">
          <vxe-pager
            :current-page.sync="pagination.currentPage"
            :page-size.sync="pagination.pageSize"
            :total="pagination.total"
            @page-change="pageChange"
          ></vxe-pager>
        </div>
      </div>
    </table-section>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">

</style>
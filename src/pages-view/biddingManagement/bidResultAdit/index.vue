<template>
    <app-page>
      <div class="view-section">
        <search-component 
          :options="searchOptions"
          :source-list="sourceList"
          @search="onSearch"
          @reset="onReset"
          :cache="`search_bidding_tenderingApply_${userInfo.userId}`"
        >
        </search-component>
      </div>
      <table-section ref="tableSection">
        <div class="app-table-container" auto>
          <div class="app-table-header">
            <sub-title high :title="$route.meta.title ?? '定标审批'"></sub-title>
            <vxe-toolbar ref="toolbar" class="app-table-toolbar">
              <template #tools>
                <table-tools :default-columns="defaultColumns" @ok="onToolOk" ref="tools"></table-tools>
              </template>
            </vxe-toolbar> 
          </div>
          <div class="app-table-body">
            <vxe-grid
              :id="`tb_bidding_bidReview_${userInfo.userId}`"
              :data="tableData"
              :columns="tableColumns"
              height="auto"
              :custom-config="{ storage: true }"
              @cell-dblclick="onCellDbClick"
              ref="table"
            >
              <template #rowNum="{rowIndex}">
                {{rowIndex + 1}}
              </template>
              <template #bizFlowStatusList="{ row }">
                <state-pro :state="row.bizFlowStatus" source="tender_biz_flow_status"></state-pro>
              </template>
              <template #action="{ row }">
                <page-button type="text" v-if="row.scoreStatus == 2"  @click="onCellDbClick({row})">查看详情</page-button>
                <page-button type="text" v-if="row.scoreStatus == 0"  @click="onCellDbClick({row})">开始评标</page-button>
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
  
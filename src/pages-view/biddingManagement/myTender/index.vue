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
            <sub-title high :title="$route.meta.title ?? '招标项目申请'"></sub-title>
            <vxe-toolbar ref="toolbar" class="app-table-toolbar">
              <template #buttons>
                <page-button disabled>
                  标书下载
                </page-button>
                <page-button disabled>
                  投标
                </page-button>
                <page-button disabled>
                  答疑
                </page-button>
                <page-button disabled>
                  缴费
                </page-button>
              </template>
              <template #tools>
                <table-tools :default-columns="defaultColumns" @ok="onToolOk" ref="tools"></table-tools>
              </template>
            </vxe-toolbar> 
          </div>
          <div class="app-table-body">
            <vxe-grid
              :id="`tb_bidding_tenderingApply_${userInfo.userId}`"
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
                <business-status-pro :state="row.bizFlowStatus" source="tender_biz_flow_status"></business-status-pro>
                <!-- <state-pro :state="row.bizFlowStatus" source="tender_biz_flow_status"></state-pro> -->
              </template>
              <template #action="{ row }">
              <page-button type="text" @click="onCellDbClick({row})">查看</page-button>
              <page-button type="text" v-if="row.billState>1" @click="onCellDbClick({row})">编辑</page-button>
              <page-button type="text" v-else-if="row.billState>1" @click="onCellDbClick({row})">缴费</page-button>
              <page-button type="text" v-else-if="row.billState>1" @click="onCellDbClick({row})">答疑</page-button>
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
  
<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_bidding_supplierApply_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      ></search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? ''"> </sub-title>
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
            :id="`tb_bidding_supplierApply_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            @cell-dblclick="onCellDbClick"
            ref="table"
            height="auto"
          >
            <template #bizFlowStatusList="{ row }">
              <business-status-pro :state="row.bizFlowStatus" source="tender_biz_flow_status"></business-status-pro>
              <!-- <state-pro :state="row.bizFlowStatus" source="tender_biz_flow_status"></state-pro> -->
            </template>
            <template #projectName="{ row, rowIndex }">
              <div>{{ row.projectName }}
                 <span class="project-name-tag" v-if="row.registrationStatus" :class="row.registrationStatus=='0'?'':'Ac'">{{row.registrationStatusName}}</span>
              </div>
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
@import url("./index_scoped.less");
</style>

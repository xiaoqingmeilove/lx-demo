<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_cgsq_${userInfo.userId}`"
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
              <page-button
                content="新增"
                type="text"
                style="margin-left: 36px;"
                @click="
                  $router.push({ path: `/buyingLead/purchaseApply-detail` })
                "
              >
                <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
              </page-button>
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
            :id="`tb_cgsq_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            @cell-dblclick="onCellDbClick"
            ref="table"
            height="auto"
          >
            <template #billNo="{  row, column }">
              <span>
                <svg-icon icon-class="urgent" class="urgent" v-if="row.urgentFlag"></svg-icon>
                {{row[column.field]}}
              </span>
            </template>
            <template #billState="{ row, rowIndex }">
              <bill-state :state="row.billState"></bill-state>
            </template>
            <template #btnStateInfo="{ row, rowIndex,column }">
              <btn-state-info
                :state="row[column.field]"
                :dictName="column?.params?.dictName ?? ''"
              ></btn-state-info>
            </template>
            <template #urgentFlag="{ row, column }">
              <span v-if="row[column.field]" style="color:red">
                <!-- <svg-icon icon-class="urgent" class="urgent"></svg-icon> -->
                是
              </span>
              <span v-else>否</span>
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
<style lang="less" scoped>
.vxe-body--column{
  position: relative;
}
.urgent{
  position: absolute;
  top: 0;
  left: 0;
}
</style>

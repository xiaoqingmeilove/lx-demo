<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_supplier_supplierAccess_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? ''"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <!-- educe -->
              <page-button type="text" @click="exprot">
                <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
                导出
              </page-button>
            </template>
            <template #tools>
              <table-tools :default-columns="defaultColumns" @ok="onToolOk" ref="tools"></table-tools>
            </template>
          </vxe-toolbar> 
        </div>
        <div class="app-table-body">
          <vxe-grid
            :id="`tb_supplier_supplierAccess_${userInfo.userId}`"
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
            <template #slot_content="{row, column}">
              <span style="color: var(--base-color);cursor: pointer;" @click="onCellDbClick({row})">{{row[column.field]}}</span>
            </template>
            <template #authStatus="{row, column}">
              <span class="status" :style="{color: getColorAndName(row, column, sourceList.authStatusList).color}">
                <span class="dot" :style="{background: getColorAndName(row, column, sourceList.authStatusList).color}"></span>
                {{getColorAndName(row, column, sourceList.authStatusList).label}}
              </span>
            </template>
            <template #supplierClassification="{row, column}">
              <span>
                <span class="row-bg" :style="{background: getColorAndName(row, column, sourceList.supplierClassificationList).color}">{{getColorAndName(row, column, sourceList.supplierClassificationList).label}}</span>
              </span>
            </template>
            <template #slot_flag="{row, column}">
              <span v-if="row[column.field] === 1" style="color:red">是</span>
              <span v-if="row[column.field] === 0">否</span>
            </template>
            <template #validityEndDate="{row}">
              <span v-if="row.autoRenewalFlag">长期有效</span>
              <span v-else>{{moment(row.validityEndDate).format("YYYY-MM-DD")}}</span>
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
@import url("./index_scoped.less");
</style>

<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_supplier_supplierRegister_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? ''"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button type="text" @click="add" style="margin-left: 36px;"><template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>新增供应商</page-button>
              <page-button type="text" style="margin-left: 36px;" @click="importVisable=true">批量导入</page-button>
              <page-button @click="exprot" type="text" style="margin-left: 36px;">
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
            :id="`tb_supplier_supplierRegister_${userInfo.userId}`"
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
                <span>{{getColorAndName(row, column, sourceList.authStatusList).label}}</span>
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
    <import-modal :visible="importVisable" template-name="供应商信息维护" template-url="/minio/sims-resource/%E7%BE%8E%E6%B2%B3%E4%BE%9B%E5%BA%94%E5%95%86%E4%BF%A1%E6%81%AF%E7%BB%B4%E6%8A%A4.xlsx" @close="importVisable=false;getList()" @change="importOk"></import-modal>
  </app-page>
</template>

<script src="./index.js" />
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

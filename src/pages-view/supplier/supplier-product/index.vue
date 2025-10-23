<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_supplier_supplierProduct_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$tabs.activeTab.title || '供货产品清单'"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
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
            :id="`tb_supplier_supplierProduct_${userInfo.userId}`"
            :data="tableData"
            :columns="tableColumns"
            height="auto"
            :custom-config="{ storage: true }"
            ref="table"
          >
            <template #rowNum="{row, rowIndex}">
              {{rowIndex + 1}}
            </template>
            <template #billNo="{row}">
              <span style="color: var(--base-color)">{{row.billNo}}</span>
            </template>
            <template #status="{row, column}">
              <span class="vxe-cell--label">
                <page-button theme="success" v-if="parseFloat(row[column.field]) === 0">启用</page-button>
                <page-button theme="danger" v-if="parseFloat(row[column.field])=== 1">禁用</page-button>
              </span>
            </template>
            <template #slot_flag="{row, column}">
              <span class="vxe-cell--label">
                <page-button theme="success" v-if="parseFloat(row[column.field]) === 1">是</page-button>
                <page-button theme="danger" v-if="parseFloat(row[column.field])=== 0">否</page-button>
              </span>
            </template>
            <template #groundingFlag="{row, column}">
              <span class="vxe-cell--label">
                <page-button theme="success" v-if="parseFloat(row[column.field]) === 0">已上架</page-button>
                <page-button theme="danger" v-if="parseFloat(row[column.field])=== 1">未上架</page-button>
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
@import url("./index_scoped.less");
</style>

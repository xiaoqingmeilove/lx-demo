<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_material_sourceList_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? ''"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button type="text" @click="$router.push({ path: `/material/sourceList-detail/detail`})" style="margin-left: 36px;"><template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>新增</page-button>
              <page-button type="text" style="margin-left: 36px;" @click="exprot">
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
            :id="`tb_material_sourceList_${userInfo.userId}`"
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
            <template #billState="{row}">
              <bill-state :state="row.billState"></bill-state>
            </template>
            <template #remainDays="{row, column}">
              <span style="color:red">{{row[column.field]||remainDay(row)}}</span>
            </template>
            <template #slot_date="{row, column}">
              <span v-if="row[column.field]">{{formatDate(row, column)}}</span>
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
    <import-modal :visible="importVisable" template-name="价目表" template-url="/minio/sims-resource/%E7%BE%8E%E6%B2%B3%E4%BE%9B%E5%BA%94%E5%95%86%E4%BF%A1%E6%81%AF%E7%BB%B4%E6%8A%A4.xlsx" @close="importVisable=false;getList()" @change="importOk"></import-modal>
  </app-page>
</template>

<script src="./index.js" />
<style scoped lang="less">

</style>

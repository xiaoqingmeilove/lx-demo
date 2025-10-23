<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_zxbj_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      >
        <template #slot_tree="{item}">
          <el-select-tree
            v-model="condition[item.field]"
            style="width: 100%;"
            filterable
            clearable
            check-strictly
            :data="sourceList[item.source]"
            :props="{label:'label',value:'id',children:'children'}"
          ></el-select-tree>
        </template>
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title :title="$route.meta.title ?? '物料档案'" high>
            <template #buttons>
              <!-- <auto-refresh @init="getList()" /> -->
            </template>
          </sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button
                content="新增物料档案"
                type="text"
                style="margin-left: 36px;"
                @click="
                  $router.push({ path: `/material/material-content/detail` })
                "
              >
                <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
              </page-button>
              <page-button content="批量启用禁用" type="text" style="margin-left: 36px;" @click="batchStatus"></page-button>
              <!-- <page-button content="导入" @click="exportExec(1)" type="text" style="margin-left: 36px;" >
                <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
              </page-button>
              <page-button content="导出" @click="exportExec(2)" type="text" style="margin-left: 36px;" >
                <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
              </page-button> -->
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
            :id="`tb_wlda_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            @cell-dblclick="onCellDbClick"
            @checkbox-all="getRowSelection"
            @checkbox-change="getRowSelection"
            height="auto"
            ref="listtable"
          >
            <template #rowNum="{ row, rowIndex }">
              <span>{{ rowIndex + 1 }}</span>
            </template>
            <template #batchPaymentFlag="{ row, rowIndex }">
              <span v-if="row.batchPaymentFlag == 1">是</span>
              <span v-else>否</span>
            </template>
            <template #batchGoodsFlag="{row, rowIndex}">
              <span v-if="row.batchGoodsFlag == 1">是</span>
              <span v-else>否</span>
            </template>
            <template #status="{row, rowIndex}">
              <span v-if="row.status == 1">是</span>
              <span v-else>否</span>
            </template>
            <template #doing="{ row, rowIndex }">
              <page-button type="text" @click="DelmaterialInfo(row)">删除</page-button>
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
    <popup-form v-model="batchStatusVisible"
      title="批量启用禁用"
      :form-data="batchStatusForm"
      :data-gather="dataGather"
      :data-list="sourceList"
      :auto-scroll="true"
      :read-only="false"
      :title-colon="true"
      width="400"
      @ok="onSetPopupOk"
    >
    </popup-form>
  </app-page>
</template>
<script src="./index.js"></script>

<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_xqsy_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      ></search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? ''"> </sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
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
            :id="`tb_xqsy_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            ref="table"
            height="auto"
          >
            <template #deliveryAddress="{ row, rowIndex }">
              <splicin-address :form="row" color="var(--base-color)" style="display: inline-block;"></splicin-address>
            </template>
            <template #urgentFlag="{ row, rowIndex }">
              <span v-if="row.urgentFlag" style="color: red">是</span>
              <span v-else>否</span>
            </template>
            <template #matchPriceFlag="{ row, rowIndex }">
              <span v-if="row.matchPriceFlag" style="color: var(--base-color);">是</span>
              <span v-else >否</span>
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

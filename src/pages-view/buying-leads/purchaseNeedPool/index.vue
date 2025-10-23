<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_cgxqc_${userInfo.userId}`"
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
              <div class="radio-group app-table-toolbar-left" style="margin: 0;">
                <el-radio-group v-model="sourceState" @change="getList">
                  <el-radio-button label="WKS">未开始</el-radio-button>
                  <el-radio-button label="JXZ">进行中</el-radio-button>
                  <el-radio-button label="XYWC">寻源完成</el-radio-button>
                  <el-radio-button label="YXD">已下单</el-radio-button>
                  <el-radio-button label="ALL">全部</el-radio-button>
                </el-radio-group>
              </div>

              <div class="app-table-toolbar-right">
                <page-button content="导出" @click="exportExec" type="text" style="margin-left: 36px;" >
                  <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
                </page-button>
                <page-button content="直接采购" @click="toDirectPurchasing" type="text" style="margin-left: 36px;" >
                  <!-- <template #img><svg-icon icon-class="" style="margin-right: 5px" /></template> -->
                </page-button>
                <page-button content="询价" @click="toSeekClick" type="text" style="margin-left: 36px;" >
                  <template #img><svg-icon icon-class="" style="margin-right: 5px" /></template>
                </page-button>
                <page-button content="竞价" @click="toBidClick" type="text" style="margin-left: 36px;" >
                  <template #img><svg-icon icon-class="" style="margin-right: 5px" /></template>
                </page-button>                
                <page-button content="招标" @click="toBidManagementClick" type="text" style="margin-left: 36px;" >
                  <template #img><svg-icon icon-class="" style="margin-right: 5px" /></template>
                </page-button>                
              </div>
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
            :id="`tb_cgxqc_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            @cell-dblclick="onCellDbClick"
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
            <template #sourceState="{ row, rowIndex }">
              <source-state :state="row.sourceState"></source-state>
            </template>
            <!-- <template #btnStateInfo="{ row, rowIndex,column }">
              <btn-state-info
                :state="row[column.field]"
                :dictName="column?.params?.dictName ?? ''"
              ></btn-state-info>
            </template>
            <template #yesNo="{ row, column }">
              <span>{{ row[column.field] ? "是" : "否" }}</span>
            </template> -->
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
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
<script src="./index.js"></script>

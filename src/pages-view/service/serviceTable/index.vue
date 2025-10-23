<template>
  <app-page>
    <div class="view-section" >
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset" 
        :cache="`search_service_serviceTable_${userInfo.userId}`"
      ></search-component>
    </div>
    <table-section  :loaded="loaded">
      <div class="app-table-container" >
        <div class="app-table-header">
          <sub-title high title="售后服务"></sub-title>
          <vxe-toolbar class="app-table-toolbar">
            <template #buttons>
              <!-- <page-button content="导出" @click="exprot"></page-button> -->
              <page-button content="新增" @click="sform=true"></page-button>
            </template>
          </vxe-toolbar>
          <div class="app-table-tools">
            
          </div>
        </div>
        <div class="app-table-body">
          <vxe-grid
            :data="tableData"
            :columns="columns"
            @cell-dblclick="onCellDbClick"
            :height="tableHeight"
            ref="table"
          >
            <template #problemType="{ row }">
                <span>{{ getProblemTypeName(row.problemType) }}</span>
            </template>
            <template #priority="{ row }">
                <span>{{ getPriorityName(row.priority) }}</span>
            </template>
            <template #billState="{ row }">
                <span>{{ getBillStateName(row.billState) }}</span>
            </template> 
            <template #btnStateInfo="{ row, rowIndex,column }">
              <btn-state-info
                :state="row[column.field]"
                :dictName="column?.params?.dictName ?? ''"
              ></btn-state-info>
            </template>
            <template #processingMethod="{ row }">
                <span>{{ getProcessingMethodName(row.processingMethod) }}</span>
            </template>  
            <template #lossLevel="{ row }">
                <span>{{ getLossLevelName(row.lossLevel) }}</span>
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
    <el-dialog top="1vh" title="售后服务受理单据" :visible.sync="sform" width="1000px" :append-to-body="true" :modal-append-to-body="false">
      <ServiceForm v-if="sform" :create="create" @close="v=>{v?getList():'';sform=false}"/>
    </el-dialog>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

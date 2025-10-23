<!--
 * @Author: wmm
 * @Date: 2025-04-16 11:20:25
 * @LastEditors: wmm
 * @LastEditTime: 2025-09-24 10:34:23
-->
<template>
  <app-page>
    <div class="page-body">
      <div class="page-body-item" style="background-color: #fff;">
        <sub-title high title="竞价中的项目">
          <template #buttons>
            <vxe-toolbar ref="xmtoolbar" class="app-table-toolbar">
              <template #tools>
                <table-tools :default-columns="defaultColumns1" @ok="(e) => onToolOk(e, 'columns1')" ref="tools1"></table-tools>
              </template>
            </vxe-toolbar>
          </template>
        </sub-title>
        
        <vxe-grid
          :id="`tb_bidding_biddingHallBack_xm_${userInfo.userId}`"
          :data="tableData1"
          :columns="tableColumns1"
          :custom-config="{ storage: true }"
          height="280px"
          @cell-click="onCellDbClick"
          ref="xmtable"
        >
          <template #rowNum="{row, rowIndex}">
            {{rowIndex + 1}}
          </template>
          <template #action="{ row }">
            <page-button :disabled="row.projectStatus==5" @click="toPricing(row)">核价</page-button>
          </template>
          <template #projectStatus="{ row }">
            <business-status-pro :state="row.projectStatus" source="bidding_project_status"></business-status-pro>
          </template>
          <template #pager>
            <vxe-pager
              :current-page.sync="tablePage1.currentPage"
              :page-size.sync="tablePage1.pageSize"
              :total="tablePage1.total"
              @page-change="handlePageChange1"
            ></vxe-pager>
          </template>
        </vxe-grid>
      </div>
      <div class="page-body-content">
        <div class="body-content-item">
          <table-section ref="tableSection">
            <div class="app-table-container" auto>
              <div class="app-table-header">
                <sub-title high title="竞价明细"></sub-title>
                <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                  <template #tools>
                    <table-tools :default-columns="defaultColumns" @ok="(e) => onToolOk(e, 'columns')" ref="tools"></table-tools>
                  </template>
                </vxe-toolbar> 
              </div>
              <div class="app-table-body" ref="tabbar">
                <vxe-grid
                  :id="`tb_bidding_biddingHallBack_${userInfo.userId}`"
                  :data="tableData"
                  :columns="tableColumns"
                  height="auto"
                  :custom-config="{ storage: true }"
                  ref="table"
                >
                  <template #rowNum="{row, rowIndex}">
                    {{rowIndex + 1}}
                  </template>
                  <template #billState="{ row }">
                    <bill-state :state="row.billState"></bill-state>
                  </template>
                  <template #btnStateInfo="{ row, rowIndex,column }">
              <btn-state-info
                :state="row[column.field]"
                :dictName="column?.params?.dictName ?? ''"
              ></btn-state-info>
            </template>
                  <!-- <template #pager>
                    <vxe-pager
                      :current-page.sync="tablePage.currentPage"
                      :page-size.sync="tablePage.pageSize"
                      :total="tablePage.total"
                      @page-change="handlePageChange"
                    ></vxe-pager>
                  </template> -->
        </vxe-grid>
              </div> 
            </div>
          </table-section>
        </div>
        <div class="body-content-item charts" ref="charts"></div>
      </div>
    </div>
  </app-page>
</template>

<script src="./index.js" />
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

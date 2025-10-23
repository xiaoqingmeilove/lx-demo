<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_purchaseOrder_orderApply_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? '采购订单'"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button type="text" @click="createOrder"><template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>创建订单</page-button>
              <!-- <el-dropdown class="page-button-dropdown" style="margin-left: 36px;" @command="handleCommand">
                <page-button type="text"><template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>新建订单</page-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="contractVisable">从采购合同</el-dropdown-item>
                  <el-dropdown-item command="poolVisable">从需求池</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
             
              <!-- <page-button @click="exprot" type="text" style="margin-left: 36px;">
                <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
                导出
              </page-button> -->
            </template>
            <template #tools>
              <table-tools :default-columns="defaultColumns" @ok="onToolOk" ref="tools"></table-tools>
            </template>
          </vxe-toolbar> 
        </div>
        <div class="app-table-body">
          <vxe-grid
            :id="`tb_purchaseOrder_orderApply_${userInfo.userId}`"
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
            <template #billNo="{row}">
              <span style="color: var(--base-color)">{{row.billNo}}</span>
            </template>
            <template #billState="{ row ,column}">
              <span class="status" :style="{color: getColorAndName(row, column, sourceList.billStateList).color}">
                <span class="dot" :style="{background: getColorAndName(row, column, sourceList.billStateList).color}"></span>
                <span>{{getColorAndName(row, column, sourceList.billStateList).label}}</span>
              </span>
              <!-- <bill-state :state="row.billState"></bill-state> -->
            </template>
            <template #confirmAddress="{ row }">
              <span style="color: var(--base-color)">{{row.areaCodeListName}}　{{row.deliveryAddress}}　{{row.receiveLinkName}}　{{row.receiveLinkTel}}</span>
            </template>
            <template #businessSource="{ row }">
              <business-source :state="row.businessSource"></business-source>
            </template>
            <template #orderBizFlowStatus="{ row ,column}">
              <biz-flow-status :state="row.bizFlowStatus"></biz-flow-status>
            </template>
            <template #syncAps="{ row }">
              <span v-if="row.syncAps == '1'" style="color: var(--special-button-bg);">{{row.syncApsName}}</span>
              <span v-else style="color: red;">{{row.syncApsName}}</span>
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
    <vxe-modal
      width="80%"
      v-model="visible.poolVisable"
      resize
      title="从需求池生成订单"
      destroy-on-close
      height="90%"
      @close="visible.poolVisable = false"
      class-name="add-modal"
    >
      <purchasepool-list :menuCode="menuCode" @ok="addRequirements" v-if="visible.poolVisable"></purchasepool-list>
    </vxe-modal>
    <vxe-modal
      width="80%"
      v-model="visible.contractVisable"
      resize
      title="从采购合同生成订单"
      destroy-on-close
      height="90%"
      @close="visible.contractVisable = false"
      class-name="add-modal"
    >
      <contract-list :menuCode="menuCode" @ok="addContract" v-if="visible.contractVisable"></contract-list>
    </vxe-modal>
  </app-page>
</template>

<script src="./index.js" />
<style scoped lang="less">

</style>

<template>
  <app-page>
    <el-tabs v-model="activeService" @tab-click="activeClick" style="height:100%">
      <el-tab-pane name="0" style="height:100%">
        <span slot="label">服务评价</span>
        <div class="view-section">
          <search-component
            :options="searchOptions1"
            :source-list="sourceList1"
            @search="onSearch1"
            @reset="onReset1" 
            :cache="`search_service_serviceRateFW__${userInfo.userId}`"
          ></search-component>
        </div>
        <table-section :loaded="loaded" style="height:calc(100% - 70px)">
          <div class="app-table-container" >
            <div class="app-table-header">
              <sub-title high title="报价服务评价"></sub-title>
              <vxe-toolbar class="app-table-toolbar">
                <template #buttons>
                  <page-button content="导出" @click="exportTable"></page-button>
                </template>
              </vxe-toolbar>
              <div class="app-table-tools">
                
              </div>
            </div>
            <div class="app-table-body">
              <vxe-grid
                :data="tableData1"
                :columns="columns1"
                :height="tableHeight"
                ref="table"
              >
                <template #action="{ row }">
                  <page-button type="text" content="查看" @click="form=row;scoreview=true"/>
                </template>
        </vxe-grid>
            </div>
            <div class="app-table-footer">
              <vxe-pager
                :current-page.sync="pagination1.currentPage"
                :page-size.sync="pagination1.pageSize"
                :total="pagination1.total"
                @page-change="pageChange1"
              ></vxe-pager>
            </div>
          </div>
        </table-section>
      </el-tab-pane>
      <el-tab-pane name="1" style="width:100%;height:100%">
        <span slot="label">评价统计</span>
        <div class="view-section">
          <search-component
            :options="searchOptions2"
            :source-list="sourceList2"
            @search="onSearch2"
            @reset="onReset2" 
            :cache="`search_service_serviceRatePJ__${userInfo.userId}`"
          ></search-component>
        </div>
        <div style="height:calc(100% - 70px);width:100%;display:flex">
          <table-section :loaded="loaded" style="height:100%;width:50%">
            <div class="app-table-container" >
              <div class="app-table-header">
                <sub-title high title="服务评价统计"></sub-title>
                <vxe-toolbar class="app-table-toolbar">
                  <template #buttons>
                    <!-- <page-button content="导出" @click="exprot"></page-button> -->
                  </template>
                </vxe-toolbar>
                <div class="app-table-tools">
                  
                </div>
              </div>
              <div class="app-table-body">
                <vxe-grid
                  :data="tableData2"
                  :columns="columns2"
                  :height="tableHeight"
                  ref="table"
                >
        </vxe-grid>
              </div>
              <div class="app-table-footer">
                <vxe-pager
                  :current-page.sync="pagination2.currentPage"
                  :page-size.sync="pagination2.pageSize"
                  :total="pagination2.total"
                  @page-change="pageChange2"
                ></vxe-pager>
              </div>
            </div>
          </table-section>
          <div v-if="activeService=='1'" ref="charts" style="width:calc(50% - 10px);height:100%" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="报价服务评价" :visible.sync="scoreview" width="500px" :append-to-body="true" :modal-append-to-body="false">
      <ScoreForm v-if="scoreview" :row="form" @close="scoreview=false" />
    </el-dialog>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
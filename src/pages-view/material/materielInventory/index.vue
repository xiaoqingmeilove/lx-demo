<template>
  <app-page>
    <div class="view-section" v-if="searchOptions && searchOptions.length">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_material_materielInventory_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-content">
          <div class="app-table-content-left">
            <div class="app-table-header">
              <sub-title :title="$tabs.activeTab.title ?? '物料库存管理'" high>
                <template #description>
                  <div>最后更新时间：{{time}}</div>
                </template>
              </sub-title>
              <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button type="text" style="margin-right:36px" @click="refresh">刷新</page-button>
                  <page-button type="text" style="margin-right:36px" @click="batchSet">批量设置</page-button>
                  <page-button type="text" @click="batchPurchaseList">批量采购</page-button>
                </template>
                <template #tools>
                  <table-tools :default-columns="defaultColumns" @ok="onToolOk" ref="tools"></table-tools>
                </template>
              </vxe-toolbar>
            </div> 
            <div class="app-table-body">
              <vxe-grid
                :id="`tb_material_materielInventory_${userInfo.userId}`"
                :data="tableData"
                :columns="tableColumns"
                :custom-config="{ storage: true }"
                height="auto"
                ref="table"
              > 
                <template #rowNum="{rowIndex}">
                  <span>{{rowIndex+1}}</span>
                </template>
                <template #warningFlag="{row, column}">
                  <span>
                    <span v-if="row[column.field]" class="row-bage">库存不足</span>
                    <span v-else class="row-bage" style="background: #EBFBEE;color: #79D8A6">库存正常</span>
                  </span>
                </template>
                <template #action="{row}">
                  <page-button type="text" @click="setRow(row)">设置</page-button>
                  <page-button type="text" @click="batchPurchaseOne(row)">直接采购</page-button>
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
          <div class="app-table-content-right content">
            <div class="app-table-content-right-head">
              <sub-title title="库存预警通知" high />
              <div class="bage">{{warningList.length}}</div>
            </div>
            <div class="app-table-content-right-body">
              <div class="app-table-content-right-body-card" v-for="(item,index) of warningList" :key="index">
                <h4 style="color:#FF7070">{{item.title}}</h4>
                <div class="card-content">{{item.content}}</div>
                <div class="card-time">{{item.createTime}}</div>
                <!-- <div>当前库存: 120（在途量: 30， 安全库存: 150）</div>
                <div>库存不足，请及时补充</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </table-section>
    <template #custom>
      <popup-form v-model="visible"
        title="安全库存预警设置"
        :form-data="setFormData"
        :data-gather="dataGather"
        :rules="setRules"
        :data-list="sourceList"
        :auto-scroll="true"
        :read-only="false"
        :title-colon="true"
        width="560"
        title-width="110"
        ok-text="确认设置"
        @ok="onSetPopupOk"
      >
        <template #dateRange="{ item, index, data}">
          <el-date-picker
            v-model="endingDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="small"
          >
          </el-date-picker>
        </template>
      </popup-form>
    </template>
  </app-page>
</template>

<script src="./index.js" />

<style lang="less" scoped>
.app-table-content{
  display: flex;
  gap: 15px;
  flex: 1;
  height: 0;
  width: 100%;
  &-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 380px;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    &-head{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      color: var(--base-color);
      .bage{
        width: 36px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 50%;
        background-color: #FF6B6B;
        color: #fff;
      }
    }
    &-body{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: auto;
      // scrollbar-width: none;
      &-card{
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;
        width: 100%;
        padding: 15px;
        background: #FFF9F9;
        border-radius: 6px;
        font-size: 14px;
        color: #595959;
        &::before{
          position: absolute;
          top: 0;
          left: 0;
          content: '';
          display: inline-block;
          width: 4px;
          height: 100%;
          background: #FF7171;
          border-radius: 6px 0 0 6px; 
        }
      }
    }
    
  }
  &-left {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 0;
    height: 100%;
  }
  .content{
    // box-shadow: 0px 0px 10px 0px #3C3E4314;
    border-radius: 6px;
    // padding: 15px;
  }
}
.row-bage{
  display: inline-block;
  padding: 6px 10px;
  border-radius: 4px;
  background: #FFF3BF;
  color: #E98507;
}
.card-content{
  white-space: pre-line !important;
  line-height: 26px;
}
.card-time{
  font-size: 13px;
  color: #999;
}
.app-table-buttons{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.app-table-search{
  width: 600px;
  margin: 0 auto 10px;
  /deep/ .el-input--prefix .el-input__inner {
    padding-left: 22px;
  }
  /deep/ .el-input__prefix{
    line-height: 40px;
  }
  /deep/ .el-input-group__append{
    width: 59px;
    height: 100%;
    padding: 10px;
    height: 100%;
    text-align: center;
    line-height: 1;
    color: #fff;
    background-color: var(--base-color);
    cursor: pointer;
  }
  /deep/ .el-input__inner{
    background: #F7F8FA;
    border: none;
  }
  .search-bnt{
    width: 100%;
    height: 100%;
  }
}
</style>

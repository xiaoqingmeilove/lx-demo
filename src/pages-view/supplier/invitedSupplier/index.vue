<template>
  <app-page>
    <div class="view-section">
      <search-component 
        :options="searchOptions"
        :source-list="sourceList"
        @search="onSearch"
        @reset="onReset"
        :cache="`search_supplier_invitedSupplier_${userInfo.userId}`"
      >
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? '供应商邀请'"></sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <!-- educe -->
              <page-button type="text" @click="visible.addVisible=true;addForm=[{}]">
                <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                邀请供应商
              </page-button>
              <page-button type="text" style="margin-left: 36px;" @click="batchInvite">批量邀请</page-button>
              <!-- <page-button type="text" style="margin-left: 36px;" @click="exprot">
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
            :id="`tb_supplier_invitedSupplier_${userInfo.userId}`"
            :data="tableData"
            :columns="tableColumns"
            height="auto"
            :custom-config="{ storage: true }"
            ref="table"
          >
            <!-- @cell-dblclick="onCellDbClick" -->
            <template #rowNum="{row, rowIndex}">
              {{rowIndex + 1}}
            </template>
            <template #billNo="{row}">
              <span style="color: var(--base-color)">{{row.billNo}}</span>
            </template>
            <template #inviteStatus="{row, column}">
              <span class="status" :style="{color: getColorAndName(row, column, sourceList.inviteStatusList).color}">
                <span class="dot" :style="{background: getColorAndName(row, column, sourceList.inviteStatusList).color}"></span>
                <span>{{getColorAndName(row, column, sourceList.inviteStatusList).label}}</span>
              </span>
            </template>
            <template #authStatus="{row, column}">
              <span class="status" :style="{color: getColorAndName(row, column, sourceList.authStatusList).color}">
                <span class="dot" :style="{background: getColorAndName(row, column, sourceList.authStatusList).color}"></span>
                <span>{{getColorAndName(row, column, sourceList.authStatusList).label}}</span>
              </span>
            </template>
            <template #action="{row}">
              <page-button type="text" @click="invite([row.id])">邀请</page-button>
              <page-button type="text" @click="openSms(row)">查看短信记录</page-button>
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
      v-model="visible.addVisible"
      title="邀请供应商"
      :mask="false"
      resize
      destroy-on-close
      width="60vw"
      height="60vh"
      remember
      show-zoom
      show-close
      show-footer
      @close="visible.addVisible = false"
    >
      <template #default>
        <div class="info"><i class="el-icon-warning" style="margin-right: 10px"></i>备注信息不会发送给供应商，建议您填写供应商企业名称，便于企业标识</div>
        <div class="buttons"><page-button type="text" @click="addRow">新增一行</page-button></div>
        <el-form :ref="`addform${index+1}`" :model="addForm[index]" :rules="addRules" label-width="100px" size="small" inline class="form-inline" v-for="(item, index) in addForm" :key="index">
          <el-form-item label="手机号/邮箱" prop="contactInfo">
            <el-input v-model="addForm[index].contactInfo" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="addForm[index].supplierName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm[index].remark" type="textarea" :rows="1"></el-input>
          </el-form-item>
          <el-form-item>
            <page-button type="text" style="margin-left: 36px;" @click="delRow(index)">删除</page-button>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <page-button @click="visible.addVisible = false;addForm={};getList()">取消</page-button>
        <page-button @click="save">邀请</page-button>
      </template>
    </vxe-modal>
    <vxe-modal
      v-model="visible.smsVisible"
      title="短信记录"
      width="70vw"
      max-height="80vh"
      :mask-closable="false"
      destroy-on-close
      show-footer
      remember
      resize
      show-zoom
      @close="visible.smsVisible = false"
    >
      <template #default>
        <vxe-grid
          :data="smsTableList"
          :columns="smsColumns"
          max-height="600px"
          :custom-config="{ storage: true }"
        >
      </vxe-grid>
      </template>
      <template #footer>
        <page-button @click="visible.smsVisible = false">关闭</page-button>
      </template>
    </vxe-modal>
  </app-page>
</template>

<script src="./index.js" />
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

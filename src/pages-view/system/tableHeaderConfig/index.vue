<template>
  <app-page>
    <div class="app-body">
      <div class="app-left">
        <el-input placeholder="搜索" v-model="filterText" clearable />
        <el-tree
          :data="treeData"
          default-expand-all
          highlight-current
          :indent="12"
          ref="roleTree"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div class="app-right">
        <search-component
          :options="searchOptions"
          @search="onSearch"
          @reset="onReset"
          @expand="onExpand"
        ></search-component>
        <table-section ref="tableSection">
          <div class="app-table-container" auto>
            <div class="app-table-header">
              <sub-title  high :title="sysMenuObj?.name ? sysMenuObj?.name : '表头配置'"></sub-title>
              <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button
                    content="新增"
                    @click="addBtnClick"
                   type="text" style="margin-left: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
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
                :id="`tb_bgpz_list_${userInfo.userId}`"
                :custom-config="{ storage: true }"
                :columns="bindColumns"
                height="auto"
                ref="table"
                @cell-dblclick="onCellDbClick"
              >
                <!--  @cell-dblclick="onCellDbClick"  v-if="showEdit" -->
                <template #cz="{ row, rowIndex }">
                  <div class="tableRowEdit">
                    <page-button type="text" @click="copyBtnClick(row)">复制</page-button>
                    <el-divider direction="vertical"></el-divider>
                    <page-button type="text" @click="editBtnClick(row)">
                      修改</page-button
                    >
                    <el-divider direction="vertical"></el-divider>
                    <page-button
                      type="text"
                      theme="default"
                      @click="deleteClick(row)"
                    >
                      删除
                    </page-button>
                  </div>
                </template>
              
        </vxe-grid>
            </div>
          </div>
        </table-section>
      </div>
    </div>
    <popup-form
      v-model="addressFormVisible"
      title="新增"
      :form-data="addressObj"
      :data-gather="addressDataGather"
      :rules="addressRules"
      @ok="addOk"
      :data-list="descSourceList"
    >
    </popup-form>
    <popup-form
      v-model="editressFormVisible"
      title="修改"
      :form-data="editressObj"
      :data-gather="editressDataGather"
      :rules="editressRules"
      :data-list="descSourceList"
      @ok="editOk"
    >
    </popup-form>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

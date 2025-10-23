<template>
  <app-page>
    <div class="warp" auto>
      <div class="view-section tab-view-section" style="width: 420px">
        <div class="left-warp" auto>
          <div class="add-button">
            <page-button type="text" @click="addVisible=true">添加分类</page-button>
            <page-button type="text" @click="batchSetPrincipalUser">批量设置负责人</page-button>
            <page-button type="text" @click="batchStatus">批量启用</page-button>
            <!-- <page-button type="text" style="color: red" @click="batchDel">批量删除</page-button> -->
          </div>
          <el-input
            placeholder="请输入查询内容"
            v-model="filterText"
            size="small"
            clearable
            style="width:100%"
          />
          <div class="button">
            <page-button type="text" @click="expandClick(true)">展开</page-button>
            <el-divider direction="vertical"></el-divider>
            <page-button type="text" @click="expandClick(false)">收起</page-button>
          </div>
          <div>
            <!-- default-expand-all -->
            <!-- :draggable="draggable" -->
            <el-tree
              class="left-tree-cont"
              highlight-current
              node-key="id"
              show-checkbox
              :data="materialTree"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :default-expanded-keys="defaultExpandedKeys"
              draggable
              @node-click="nodeClick"
              @node-drag-enter="handleDragEnter"
              @node-drop="handleDrop"
              ref="tree"
            />
          </div>
        </div>
      </div>
      <div class="view-section tab-view-section" style="flex:1;padding: 10px;width:0">
        <el-tabs v-model="tabName" @tab-click="tabClick">
          <el-tab-pane name="wlfl">
            <span slot="label">物料分类</span>
            <sub-title :title="$route.meta.title ?? '物料分类'" high>
              <template #buttons>
                <template v-if="!editState">
                  <page-button theme="special" @click="editForm">修改</page-button>
                  <!-- <page-button style="background:red" @click="delmaterial">删除</page-button> -->
                </template>
                <template v-else>
                  <page-button @click="save">保存</page-button>
                  <page-button @click="cancel">取消</page-button>
                </template>
              </template>
            </sub-title>
            <data-form
              style="margin-top: 15px"
              :items="descItems"
              :form-data="form"
              :editable="editState"
              :source-list="sourceList"
              :rules="rules"
              @hidden:select="onInputBlurFormChange"
              @change:select="onInputBlurFormChange"
              @change:input="onInputBlurFormChange"
              ref="dataForm"
            >
              <template #fileList="{item}">
                <div class="upload_box">
                  <div class="uploadBox">
                    <div
                      class="imgBox"
                      v-for="(file, index) in (form[item.field]||[])"
                      :key="index"
                    >
                      <el-image
                        style="width:100%;height:100%;"
                        :src="'/'+ file.url"
                        :preview-src-list="previewSrcList(form[item.field]||[])"
                      ></el-image>
                      <div class="img-bnt">
                        <i
                          v-if="editState"
                          class="el-icon-close"
                          @click="delFile(item.field, index)"
                        ></i>
                      </div>
                    </div>
                    <upload-button
                      v-if="editState"
                      class="uploadBtn"
                      multiple
                      :accept="['.jpg','.jpeg','.png','.gif']"
                      content="+"
                      plain
                      @success="(e) => onUploadLogoSuccess(e, item.field)"
                    ></upload-button>
                  </div>
                  <div v-if="editState" class="upload_spec">只能上传.gif,.jpg,.jpeg,.png文件</div>
                </div>
              </template>
            </data-form>
          </el-tab-pane>
          <el-tab-pane name="wlmx">
            <span slot="label">物料明细</span>
            <div class="table-body">
              <search-component
                :options="searchOptions"
                :source-list="sourceList"
                :cache="`search_wlfl_${userInfo.userId}`"
                :columns="3"
                @search="onSearch"
                @reset="onReset"
              >
              </search-component>
              <table-section ref="tableSection">
                <div class="app-table-container" auto>
                  <div class="app-table-header">
                    <sub-title :title="$route.meta.title ?? '物料档案'" high>
                      <template #buttons>
                        <!-- <auto-refresh @init="getList()" /> -->
                      </template>
                    </sub-title>
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
                      :id="`tb_wlfl_list_${userInfo.userId}`"
                      :custom-config="{ storage: true }"
                      :columns="tableColumns"
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
                        <page-button type="text" @click="toMaterialDetail(row)">查看</page-button>
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
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <popup-form
      v-model="principalUserVisible"
      title="设置负责人"
      :form-data="principalUserForm"
      :data-gather="dataGather"
      :data-list="sourceList"
      :rules="principalUserRules"
      :auto-scroll="true"
      @ok="onPrincipalUserOk"
    ></popup-form>
    <popup-form
      v-model="statusVisible"
      title="启用状态"
      :form-data="statusForm"
      :data-gather="statusDataGather"
      :data-list="sourceList"
      :rules="statusRules"
      :auto-scroll="true"
      @ok="onStatusOk"
    ></popup-form>
    <popup-form
      v-model="addVisible"
      title="添加分类"
      :form-data="addForm"
      :data-gather="addDataGather"
      :data-list="sourceList"
      :rules="addRules"
      :auto-scroll="true"
      title-width="120px"
      @ok="onAddOk"
    ></popup-form>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

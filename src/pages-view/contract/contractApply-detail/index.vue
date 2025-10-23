<template>
  <app-page>
    <bill-btns :form="form" title="合同号" filed="billNo">
      <template #buttons>
        <template v-if="id">
          <template v-if="editState">
            <page-button v-if="showBtn('save')" @click="editSave">保存</page-button>
            <page-button v-if="showBtn('cancel')" @click="cancel">取消</page-button>
          </template>
          <template v-else>
            <page-button v-if="showBtn('submitWorkflow')" @click="onSubmitBtnClick">提交审批</page-button>
            <page-button theme="special" v-if="showBtn('edit')" @click="editClick">修改</page-button>
          </template>
        </template>
        <template v-else>
          <page-button v-if="showBtn('addSave')" @click="addSave">保存</page-button>
        </template>
        <page-button v-if="showBtn('close')" @click="$tabs.close()">关闭</page-button>
        <workflow-operation
          code="market_srm_contract"
          :bill-id="form.id"
          :bill-no="form.billNo"
          :bill-state="form.billState"
          :read-only="false"
          :before-submit="beforeSubmit"
          @ok="onWorkflowOk"
          ref="workflow"
        ></workflow-operation>
      </template>
    </bill-btns>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <data-form
            :items="descItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #supplierName="{item}">
              <div class="form-content">
                <span class="form-content-value" :title="form.supplierName">{{form.supplierName}}</span>
                <page-button v-if="editState" type="text" @click="visible.addSupplierVisible=true">选择</page-button>
              </div>
            </template>
          </data-form>
          <sub-title title="合同产品信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cpxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cpxx = !formDataShow.cpxx"
              ></i>
            </template>
            <template #buttons>
              <div class="table-action-layouts" v-if="editState && formDataShow.cpxx">
                <page-button
                  type="text"
                  v-if="showBtn('tableReverse')"
                  @click="onTableActionBtnClick('reverse')"
                  >反选</page-button
                >
                <page-button
                  type="text"
                  v-if="showBtn('tableMoveUp')"
                  @click="onTableActionBtnClick('moveUp')"
                  >上移</page-button
                >
                <page-button
                  v-if="showBtn('tableMoveDown')"
                  type="text"
                  @click="onTableActionBtnClick('moveDown')"
                  >下移</page-button
                >
                <page-button
                  type="text"
                  v-if="showBtn('tabletoTop')"
                  @click="onTableActionBtnClick('toTop')"
                  >移至顶部</page-button
                >
                <page-button
                  type="text"
                  v-if="showBtn('tabletoBottom')"
                  @click="onTableActionBtnClick('toBottom')"
                  >移至底部</page-button
                >
                <page-button
                  type="text"
                  v-if="showBtn('tabledelete')"
                  @click="onTableActionBtnClick('delete')"
                  >删除</page-button
                >
                <div class="app-table-moveto" v-if="showBtn('tabletoLine')" style="margin-right: 36px;">
                  <span>移至</span>
                  <vxe-input
                    v-model="toLine"
                    class="app-table-moveto--input"
                    type="integer"
                    min="1"
                    :controls="false"
                  ></vxe-input>
                  <span>行</span>
                  <page-button
                    size="mini"
                    class="app-table-moveto--ok"
                    @click="onTableActionBtnClick('toLine')"
                    >确定</page-button
                  >
                </div>
              </div>
              <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button v-if="editState"  @click="addProduct" content="新增" type="text" style="margin-right: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
                </template>
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultColumns"
                    @ok="(e) => onToolOk(e, 'columns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cpxx"
            :data="form.detailList"
            :id="`tb_ht_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            min-height="180px"
            max-height="600px"
            ref="table"
          >
          </vxe-grid>

        </el-tab-pane>
        <el-tab-pane name="httk">
          <span slot="label">合同条款</span>
          <div class="editor-content">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              class="editor-body"
              v-model="form.templateContent"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            bill-type="CT"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
     <vxe-modal
      width="80%"
      v-model="addListVisible"
      resize
      title="添加明细"
      destroy-on-close
      height="90%"
      @close="addListVisible = false"
      class-name="add-modal"
    >
      <product-list :menuCode="menuCode" :search-data="{supplierName: form.supplierName}" @ok="addProductData" v-if="addListVisible"></product-list>
    </vxe-modal>
    <vxe-modal
        width="80%"
        v-model="visible.addSupplierVisible"
        resize
        title="添加供应商"
        destroy-on-close
        height="90%"
        show-zoom
        @close="visible.addSupplierVisible = false"
        class-name="add-modal"
      >
        <supplier-list
          :menuCode="menuCode"
          @ok="addSupplierData"
          v-if="visible.addSupplierVisible"
        ></supplier-list>
      </vxe-modal>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>

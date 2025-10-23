<template>
  <app-page>
    <bill-btns :form="form" title="" filed="billNo">
      <template #buttons>
        <template v-if="id">
          <template v-if="editState">
            <page-button v-if="showBtn('save')" @click="editSave">保存</page-button>
            <page-button v-if="showBtn('cancel')" @click="cancel">取消</page-button>
          </template>
          <template v-else>
            <page-button theme="special" v-if="showBtn('submitWorkflow')" @click="onSubmitBtnClick">提交审批</page-button>
            <page-button theme="special" v-if="showBtn('edit')" @click="editClick">修改</page-button>
          </template>
        </template>
        <template v-else>
          <page-button v-if="showBtn('addSave')" @click="addSave">保存</page-button>
        </template>
        <page-button v-if="showBtn('close')" @click="$tabs.close()">关闭</page-button>
        <workflow-operation
          code="purchaseOrder_createOrder"
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
          <sub-title title="基本信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.jbxx
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.jbxx = !formDataShow.jbxx"
              ></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.jbxx"
            :items="descItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            label-width="125px"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #supplierName="{item}">
              <div class="form-content">
                <span class="form-content-value" :title="form.supplierName">{{form.supplierName}}</span>
                <page-button v-if="editState" type="text" @click="visible.addSupplierVisible=true">选择</page-button>
              </div>
            </template>
            <template #confirmAddress="{item}">
              <div class="form-content">
                <div class="form-content-value">
                  <span style="margin-right: 30px;">123</span>
                 <el-button type="primary" size="mini" plain @click="addAddressDrawer=true">添加</el-button>
                </div>
              </div>
            </template>
            <template #fileList>
              <div class="file-list">
                <upload-button v-if="editState" content="点击上传" style="width:90px" plain @success="(e) => onUploadSuccess(e, 'fileList', 1)"></upload-button>
                <div v-if="editState"  class="upload_spec">最多1个文件</div>
                <div v-for="(item, index) in form.fileList" :key="index" v-if="form.fileList && form.fileList.length">
                  <div class="file-list-item">
                    <div class="content" @click="viewFile(item, form.fileList)" style="color:var(--base-color);cursor: pointer;">{{item.originalFileName??''}}</div>
                    <div v-if="editState" class="bnt" @click.stop="form.fileList.splice(index, 1)"><i class="el-icon-close"></i></div>
                  </div>
                </div>
                <div style="color:red;">采购订单</div>
              </div>
            </template>
          </data-form>
          <sub-title title="物料信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cpxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cpxx = !formDataShow.cpxx"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="cpxxtoolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button v-if="editState" @click="addProduct" content="选择物料" type="text" style="margin-right: 36px;">
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
            :id="`tb_priceList_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            min-height="180px"
            max-height="600px"
            ref="cpxxtable"
          >
            <template #slot_required="{column}">
              <span><span style="color:red">*</span>{{column.title}}</span>
            </template>
            <template #number_edit="{row,rowIndex,column}">
              <template v-if="editState">
                <div class="row-qty">
                  <vue2-number-input
                    v-model="row.startQty"
                    :controls="false"
                    :digits="2"
                    focus-select
                    align="right"
                    disabled
                  ></vue2-number-input>
                  <span> ~ </span>
                  <vue2-number-input
                    v-model="row.endQty"
                    :controls="false"
                    :digits="2"
                    focus-select
                    align="right"
                    @input="(e)=>numberQtyChange(e, row, rowIndex)"
                  ></vue2-number-input>
                </div>
              </template>
              <template v-else>
                <span>{{row.startQty||0}} ~ {{row.endQty||0}}</span>
              </template>
            </template>
            <template
              #slot_edit_number="{
                row,
                rowIndex,
                column,
              }"
            >
              <template v-if="editState">
                <vue2-number-input
                  v-model="row[column.field]"
                  :controls="false"
                  focus-select
                  align="right"
                  :digits="getDigits(column)"
                  @input="(e)=>numberChange(e, row, column, rowIndex)"
                ></vue2-number-input>
              </template>
              <template v-else>
                <span class="vxe-cell--label">{{
                  column.formatter
                    ? column.formatter({
                        cellValue: row[column.field],
                        row,
                        rowIndex,
                        column,
                      })
                    : row[column.field]
                }}</span>
              </template>
            </template>
            <template #action="{row, rowIndex}">
              <page-button type="text" @click="addRow(row, rowIndex)">新增一行</page-button>
              <page-button type="text" @click="delRow(row, rowIndex)">删除</page-button>
            </template>
          </vxe-grid>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            bill-type="PL"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #custom>
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
      <vxe-modal
        width="80%"
        v-model="visible.addProductList"
        resize
        title="选择物料"
        destroy-on-close
        height="90%"
        show-zoom
        @close="visible.addProductList = false"
        class-name="add-modal"
      >
        <material-list
          :menuCode="menuCode"
          @ok="addMaterialData"
          v-if="visible.addProductList"
        ></material-list>
      </vxe-modal>
      <vue-easy-lightbox
        :visible="previewImg"
        :imgs="imgs"
        :index="previewIndex"
        @hide="previewImg = false"
        ref="lightbox"
      ></vue-easy-lightbox>
    </template>



    <!-- 添加地址联系人 -->
    <el-drawer
      title="确认收货地址"
      :visible.sync="addAddressDrawer"
      :modal-append-to-body="false"
      direction="rtl"
      custom-class="add-address-drawer"
      ref="drawer"
      >
      <div class="add-address-drawer__content">
        <el-form :model="addAddressForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="区域" prop="name">
            <el-input v-model="addAddressForm.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="name">
            <el-input v-model="addAddressForm.name1"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="name">
            <el-input v-model="addAddressForm.name2"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="name">
            <el-input v-model="addAddressForm.name3"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="addAddressDrawer = false">取 消</el-button>
          <el-button type="primary" @click="addAddress">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>

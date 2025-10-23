<template>
  <app-page>
    <bill-btns :form="form" title="发货单号" filed="billNo">
      <template #state>
        <biz-flow-status :state="form.bizFlowStatus"></biz-flow-status>
        <!-- <div style="color: var(--base-color);">{{form.billStateName}}</div> -->
      </template>
      <template #buttons>
        <template v-if="editState">
          <page-button v-if="showBtn('save')" @click="editSave">保存</page-button>
          <page-button v-if="showBtn('cancel')" @click="cancel">取消</page-button>
        </template>
        <template v-else>
          <page-button v-if="showBtn('submit')" @click="onSubmitBtnClick">确认发货</page-button>
          <page-button theme="special" v-if="showBtn('edit')" @click="editClick">修改</page-button>
        </template>
        <page-button v-if="showBtn('close')" @click="$tabs.close()">关闭</page-button>
        <!-- <workflow-operation
          code="market_srm_order"
          :bill-id="form.id"
          :bill-no="form.billNo"
          :bill-state="form.billState"
          :read-only="false"
          :before-submit="beforeSubmit"
          @ok="onWorkflowOk"
          ref="workflow"
        ></workflow-operation> -->
      </template>
    </bill-btns>  

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <sub-title title="基本信息">
            <template #beforeIcon>
              <i :class="  formDataShow.jbxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' "
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
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #fileUpload="{ value, item }">
              <upload-button
                v-if="showBtn('fileOperate')"
                @success="onFileSelect"
              ></upload-button>
              <span
                style="margin-left: 15px; cursor: pointer"
                @click="activeName='fjxx'"
                class="base-font-color filelist-update"
                >查看附件</span
              >
            </template>
          </data-form>
          <sub-title title="发货信息">
            <template #beforeIcon>
              <i :class="  formDataShow.fhxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' "
                @click="formDataShow.fhxx = !formDataShow.fhxx"
              ></i> 
            </template>            
          </sub-title>
          <data-form
              v-show="formDataShow.fhxx"
              :items="descItemsTransport"
              :form-data="form"
              :editable="editState"
              :source-list="descSourceList"
              :rules="bindRules"
              @hidden:select="onInputBlurFormChange"
              @change:select="onInputBlurFormChange"
              ref="dataFormTransport"
            >
              <!-- <template #fileUpload="{ value, item }">
                <upload-button
                  v-if="showBtn('fileOperate')"
                  @success="onFileSelect"
                ></upload-button>
                <span
                  style="margin-left: 15px; cursor: pointer"
                  @click="activeName='fjxx'"
                  class="base-font-color filelist-update"
                  >查看附件</span
                >
              </template> -->
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
              </div>
            </template>
          </data-form>

          <sub-title title="采购商品清单">
            <template #beforeIcon>
              <i :class="  formDataShow.cpxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' "
                @click="formDataShow.cpxx = !formDataShow.cpxx"
              ></i> 
            </template>
            <template #buttons>
              <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultColumns"
                    @ok="(e) => onToolOk(e, 'tableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cpxx"
            :data="form.detailList"
            :id="`tb_purchaseOrder_delivery_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            min-height="180px"
            max-height="600px"
            ref="table"
          >
            <template
              #slot_edit_number="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <vue2-number-input
                  v-model="row[column.field]"
                  :controls="false"
                  focus-select
                  :data-row="rowIndex"
                  :data-column="columnIndex"
                  :digits="getDigits(column)"
                  @blur="inputChage(row, rowIndex, column)"
                  @input="inputChage(row, rowIndex, column)"
                ></vue2-number-input>
              </template>
              <template v-else>
                <span>{{
                  column.formatter
                    ? column.formatter({
                        cellValue: row[column.field],
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                        $columnIndex,
                      })
                    : row[column.field]
                }}</span>
              </template>
            </template>
            </vxe-grid>
        </el-tab-pane>
        <el-tab-pane name="syxx">
          <span slot="label">溯源信息</span>
          <div  v-if="activeName === 'syxx'">
            <timeline :billId="id" nodeType="SHIPPING_ORDER"></timeline>
          </div>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            :bill-type="fileBillTpye"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
    <vue-easy-lightbox
      :visible="previewImg"
      :imgs="imgs"
      :index="previewIndex"
      @hide="previewImg = false"
      ref="lightbox"
    ></vue-easy-lightbox>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>

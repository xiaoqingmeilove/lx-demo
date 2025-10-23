<template>
  <app-page>
    <bill-btns :form="form" title="收货单号" filed="billNo">
      <template #state>
        <biz-flow-status :state="form.bizFlowStatus"></biz-flow-status>
        <!-- <div style="color: var(--base-color);">{{form.billStateName}}</div> -->
      </template>
      <template #buttons>
          <page-button v-if="showBtn('syncAps')" @click="syncApsSubmit">
            {{  showBtn('syncAps')?.btnName ?? "数据同步" }}
          </page-button>
        <page-button style="background: var(--special-button-bg);" v-if="showBtn('confirm')" @click="confirm">确认收货</page-button>
        <page-button v-if="showBtn('close')" @click="$tabs.close()">关闭</page-button>
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
              @hidden:select="onInputBlurFormChange"
              @change:select="onInputBlurFormChange"
              ref="dataFormTransport"
            >
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




          
          <!-- <data-form
            :items="descItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
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
          </data-form> -->
          <sub-title title="采购商品清单">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cpxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
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
            :id="`tb_purchaseOrder_orderApply_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            min-height="180px"
            max-height="600px"
            ref="table"
          >
            </vxe-grid>
        </el-tab-pane>
        <el-tab-pane name="syxx">
          <span slot="label">溯源信息</span>
          <div  v-if="activeName === 'syxx'">
            <timeline :billId="id" nodeType="RECEIVING_DOCUMENT"></timeline>
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
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>

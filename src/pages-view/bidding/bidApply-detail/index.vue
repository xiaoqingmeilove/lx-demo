<template>
  <app-page>
    <bill-btns :form="form" title="邀请单号" filed="businessBillNo">
      <template #buttons>
        <template v-if="id">
          <template v-if="editState">
            <page-button v-if="showBtn('save')" @click="editSave">保存</page-button>
            <page-button v-if="showBtn('cancel')" @click="cancel">取消</page-button>
          </template>
          <template v-else>
            <page-button
              v-if="showBtn('submitWorkflow')"
              @click="onSubmitBtnClick"
              >{{ showBtn("submitWorkflow")?.btnName ?? "提交审批" }}</page-button
            >
            <page-button theme="special" v-if="showBtn('edit')" @click="editClick">修改</page-button>
          </template>
        </template>
        <page-button v-if="showBtn('closePage')" @click="$tabs.close()">关闭</page-button>
        <workflow-operation
          v-show="!editState"
          code="market_bidding_bidInvite"
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
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
          >
          </data-form>
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
            :items="descItems1"
            :form-data="form"
            v-show="formDataShow.jbxx"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            ref="dataForm1"
          >
            <template #supplierListObj="{ value, item }">
              <div class="supplier-config">
                <div v-for="(items, index) in form.supplierList" :key="items.id">
                  <div class="supplier-item">
                    <span>{{ items.supplierName }}</span>
                    <span>{{ items.linkerName }}</span>
                    <span>{{ items.linkerTel }}</span>
                  </div>
                </div>
              </div>
            </template>
          </data-form>
          <sub-title title="采购明细">
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
            :id="`tb_bidApply_detail_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            :footer-method="footerMethod"
            :show-footer="showfooter('tableColumns')"
            min-height="180px"
            max-height="600px"
            ref="cpxxtable"
          >
        </vxe-grid>
          <sub-title title="招标计划">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.zbjh
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.zbjh = !formDataShow.zbjh"
              ></i>
            </template>
          </sub-title>
          <data-form
            :items="descItems2"
            :form-data="form"
            v-show="formDataShow.zbjh"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            ref="dataForm2"
          ></data-form>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            bill-type="BM"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #custom></template>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>

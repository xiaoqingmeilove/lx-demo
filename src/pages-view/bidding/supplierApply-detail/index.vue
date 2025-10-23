<!--
 * @Author: wmm
 * @Date: 2025-04-16 11:20:25
 * @LastEditors: wmm
 * @LastEditTime: 2025-09-24 14:44:51
-->
<template>
  <app-page>
    <bill-btns :form="form" title="报价单号" filed="billNo"></bill-btns>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <data-form
            :items="descItems"
            :form-data="form"
            :editable="false"
          >
          </data-form>
          <sub-title title="报价明细">
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
                    @ok="(e)=>onToolOk(e, 'tableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cpxx"
            :data="form.offerDetailList"
            :id="`tb_bidding_supplierApply_detail_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            :footer-method="footerMethod"
            :show-footer="showfooter('tableColumns')"
            min-height="180px"
            max-height="600px"
            ref="table"
          >
        </vxe-grid>
          <sub-title title="报价汇总">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.bjhz
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.bjhz = !formDataShow.bjhz"
              ></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.bjhz"
            :items="descItems1"
            :form-data="offerForm"
            :editable="false"
          ></data-form>
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

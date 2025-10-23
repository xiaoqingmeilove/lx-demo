<template>
  <app-page>
    <bill-btns :form="form" title="竞价核价单号">
      <template #buttons>
        <page-button @click="$tabs.close()">关闭</page-button>
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
            ref="dataForm"
          >
            <template #supplierListObj="{ value, item }">
              <div class="supplier-config">
                <div v-for="(items, index) in form.supplierList" :key="items.id">
                  <div class="supplier-item">
                    <span>{{ items.businessLicense }}</span>
                    <span>{{ items.linkerName }}</span>
                    <span>{{ items.linkerTel }}</span>
                  </div>
                </div>
              </div>
            </template>
          </data-form>

          <sub-title title="供应商报价清单">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.gysbjqd
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.gysbjqd = !formDataShow.gysbjqd"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="suppliertoolbar" class="app-table-toolbar">
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="supplierDefaultColumns"
                    @ok="(e) => onToolOk(e, 'supplierTableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.gysbjqd"
            :data="form.supplierList"
            :id="`tb_bidding_winBidPricing_gysbjqd_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="supplierTableColumns"
            :footer-method="footerMethod"
            :show-footer="showfooter('supplierTableColumns')"
            ref="supplierTable"
            min-height="180"
            max-height="600"
          >
            <template #slot_status="{row, column}">
              <span v-if="parseFloat(row[column.field]) === 0">待报价</span>
              <span v-if="parseFloat(row[column.field]) === 1">未参与</span>
              <span v-if="parseFloat(row[column.field]) === 2">已报价</span>
            </template>
            <template #slot_bidResult="{row, column}">
              <span>{{descSourceList.bidResultList.find(x=>x.value===row[column.field])?.label??''}}</span>
            </template>
            <template #action="{ row, rowIndex }">
              <page-button type="text">查看报价详情</page-button>
              <!-- @click="$router.push({path: `/seekContrast/supplierApply-detail/${form.quoteBillId}`})" -->
            </template>
        </vxe-grid>

          <sub-title title="中标结果明细">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.zbjg ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.zbjg = !formDataShow.zbjg"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="summarytoolbar" class="app-table-toolbar">
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="summaryDefaultColumns"
                    @ok="(e) => onToolOk(e, 'summaryTableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.zbjg"
            :data="form.detailsList"
            :id="`tb_bidding_winBidPricing_zbjg_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="summaryTableColumns"
            ref="summarytable"
            min-height="180"
            max-height="600"
            :merge-cells="mergeCells"
            :stripe="false"
            :cell-style="({ row, column }) =>
              column.field == 'businessLicense' && row.ranking == 1
                ? { color: '#08C05E' }
                : {}
            "
            :footer-method="footerMethod"
            :show-footer="showfooter('summaryTableColumns')"
          >
            <template #slot_edit_select="{ row, column, rowIndex }">
              <span>{{descSourceList.bidResultList.find(x=>x.value===row[column.field])?.label??''}}</span>
            </template>

            <template #rowNum="{ row, rowIndex }">
              <span>{{ rowIndex + 1 }}</span>
            </template>
        </vxe-grid>
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
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

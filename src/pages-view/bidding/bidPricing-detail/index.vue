<template>
  <app-page>
    <bill-btns :form="form" title="竞价核价单号">
      <template #buttons>
        <template v-if="id">
          <page-button
            v-if="showBtn('notice') && !editState"
            class="page-button-red"
            @click="editNotice"
          >{{ showBtn("notice")?.btnName ?? "发布公告" }}</page-button>
          <page-button
            v-if="!editState && showBtn('submitWorkflow')"
            @click="onSubmitBtnClick"
            >{{ showBtn("submitWorkflow")?.btnName ?? "提交审批" }}</page-button
          >
          <page-button
            theme="special"
            @click="editForm"
            v-if="!editState && showBtn('edit')"
            >修改</page-button
          >
          <page-button v-if="showBtn('save') && editState" @click="submit()"
            >保存</page-button
          >
          <page-button
            v-if="editState && showBtn('editClose')"
            theme="default"
            @click="cancel"
            >{{ showBtn("editClose")?.btnName ?? "取消" }}</page-button
          >
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('closePage')">{{
          showBtn("closePage")?.btnName ?? "关闭"
        }}</page-button>
        <workflow-operation
          code="market_bidding_pricing"
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
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #supplierListObj="{ value, item }">
              {{ supplierList }}
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
            :id="`tb_jjhj_gysbjqd_detail_${userInfo.userId}`"
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
            <template #slot_edit_textarea="{ row, column, rowIndex }">
              <template v-if="editState">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 1 }"
                  resize="none"
                  placeholder="请输入"
                  rows="1"
                  v-model="row[column.field]"
                  @focus="($event) => $event.target.select()"
                >
                </el-input>
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

            <template #action="{ row, rowIndex }">
              <page-button type="text" :disabled="!row.businessId" @click="$router.push({path: `/bidding/supplierApply-detail/detail/${row.businessId}`})">查看报价详情</page-button>
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
            :id="`tb_jjhj_zbjg_detail_${userInfo.userId}`"
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
              <template v-if="editState">
                <el-select v-model="row[column.field]" size="small"
                  @change="()=>row.bidResultName = descSourceList.bidResultList.find(x=>x.value===row[column.field])?.label??''"
                >
                  <el-option v-for="item in descSourceList.bidResultList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
              <template v-else>
                <span>{{descSourceList.bidResultList.find(x=>x.value===row[column.field])?.label??''}}</span>
              </template>
            </template>

            <template #rowNum="{ row, rowIndex }">
              <span>{{ rowIndex + 1 }}</span>
            </template>
            <template #slot_header="{ column }">
              <span>
                {{ column.title }}
                <svg-icon
                  icon-class="zhantie"
                  size="20"
                  class="image"
                  @click="lztOpen(column)"
                ></svg-icon>
              </span>
            </template>
            <!-- 文本 -->
            <template
              #slot_edit_textarea="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 1 }"
                  resize="none"
                  placeholder="请输入"
                  rows="1"
                  v-model="row[column.field]"
                  @focus="($event) => $event.target.select()"
                >
                </el-input>
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
            <!-- 日期 -->
            <template
              #slot_edit_date="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-date-picker
                  style="width: 100%"
                  v-model="row[column.field]"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
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
            <!-- 数字 -->
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
                  focus-select
                  :controls="false"
                  :data-row="rowIndex"
                  :data-column="columnIndex"
                  :digits="getDigits(column)"
                  @keydown="upDownMove($event, rowIndex, columnIndex, column)"
                  @input="(e)=>onNumberChange(e, row, column, rowIndex, 'summaryColumns')"
                  @blur="(e)=>onNumberChange(e, row, column, rowIndex, 'summaryColumns')"
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
            <!-- 整数数字 -->
            <template
              #slot_edit_integerNumber="{
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
                  :digits="getDigits(column)"
                  @blur="integerInputChage(row, rowIndex, column.field)"
                  :data-row="rowIndex"
                  :data-column="columnIndex"
                  @keydown="upDownMove($event, rowIndex, columnIndex, column)"
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
            <!-- 文字 -->
            <template
              #slot_edit_input="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <vxe-input
                  v-model="row[column.field]"
                  @focus="
                    ({ $event }) => {
                      $event.target.select();
                    }
                  "
                ></vxe-input>
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
    <column-pasting
      :visible="lztVisible"
      @ok="lztOk"
      @close="lztClose"
      :lztLoadText="lztLoadText"
    />
    <vxe-modal
      show-zoom
      resize
      v-model="noticeVisible"
      width="50%"
      height="80%"
      title="发布公告"
      :maskClosable="false"
      destroy-on-close
      @close="noticeClose"
    >
      <notice-modal v-if="noticeVisible" :editNoticeState="editNoticeState" :form="noticeForm" @close="noticeClose" @ok="issueOk"></notice-modal>
    </vxe-modal>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

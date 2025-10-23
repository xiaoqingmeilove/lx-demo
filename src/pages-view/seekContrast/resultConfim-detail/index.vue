<template>
  <app-page>
    <bill-btns :form="form">
      <template #buttons>
        <template v-if="id">
          <page-button
            v-if="showBtn('notice') && !editState"
            class="page-button-red"
            @click="editNotice"
            >{{ showBtn("notice")?.btnName ?? "发布公告" }}</page-button
          >
          <page-button
            v-if="showBtn('againEnquiry') && !editState"
            @click="againEnquiryClick"
            >{{ showBtn("againEnquiry")?.btnName ?? "二次询价" }}</page-button
          >

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
          code="market_seekContrast_resultConfim"
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
            ref="dataForm"
          ></data-form>
        

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
                <template #buttons> </template>
                <template #tools>
                  <table-tools
                    :default-columns="defaultSupplierColumns"
                    @ok="onSupplierToolOk"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.gysbjqd"
            :data="form.supplierList"
            :id="`tb_xjsq_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="supplierColumns"
            ref="suppliertable"
            min-height="180"
            max-height="600"
          >
            <template #quoteBillNo="{ row, rowIndex }">
              <page-button
                v-if="row.quoteBillNo"
                type="text"
                @click="
                  $router.push({
                    path: `/seekContrast/supplierApply-detail/${row.quoteBillId}`,
                  })
                "
                >{{ row.quoteBillNo }}</page-button
              >
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
          </sub-title>
          <vxe-grid
            v-show="formDataShow.zbjg"
            :data="form.summaryList"
            :id="`tb_xjsq_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="summaryColumns"
            ref="summaryTable"
            min-height="180"
            max-height="600"
            :merge-cells="mergeCells"
            :stripe="false"
            :cell-style="
              ({ row, column }) =>
                column.field == 'supplierName' && row.priceRank === 1
                  ? { color: '#08C05E' }
                  : {}
            "
          >
            <template
              #slot_edit_bidResult="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <span v-if="!editState">{{ row.bidResultName }}</span>
              <div @dblclick.stop v-else>
                <el-select
                  v-model="row.bidResult"
                  size="small"
                  :disabled="!editState"
                  @change="bidResultChange($event, row, rowIndex)"
                >
                  <el-option
                    v-for="item in descSourceList.bidResultList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </div>
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
                  :digits="getDigits(column.field)"
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
                  :digits="getDigits(column.field)"
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
                  :data-row="rowIndex"
                  :data-column="columnIndex"
                  @keydown="
                    ({ $event }) => {
                      upDownMove($event, rowIndex, columnIndex, column);
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
        <el-tab-pane name="xjqx">
          <span slot="label">询价详情</span>
          <sub-title title="询价内容">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.xjnr ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.xjnr = !formDataShow.xjnr"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                <template #buttons> </template>
                <template #tools>
                  <table-tools
                    :default-columns="defaultColumns"
                    @ok="onToolOk"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
              v-show="formDataShow.xjnr"
              :data="form.detailList"
              :id="`tb_xjjgqr_detail_${userInfo.userId}`"
              :custom-config="{ storage: true }"
              :columns="columns"
              ref="table"
              min-height="180"
              max-height="600"
            >
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
      <notice-modal
        v-if="noticeVisible"
        :editNoticeState="editNoticeState"
        :form="noticeForm"
        @close="noticeClose"
        @ok="issueOk"
      ></notice-modal>
    </vxe-modal>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

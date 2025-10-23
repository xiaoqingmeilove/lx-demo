<template>
  <app-page>
    <bill-btns :form="form">
      <template #buttons>
        <template v-if="id">
          <page-button
              v-if="!editState && showBtn('submitWorkflow')"
              @click="onSubmitBtnClick"
              >{{
                showBtn("submitWorkflow")?.btnName ?? "提交审批"
              }}</page-button
            >
          <page-button
            theme="special"
            @click="editForm"
            v-if="!editState && showBtn('edit')"
            >修改</page-button
          >
          <page-button v-if="showBtn('save') && editState" @click="submit(2)"
            >保存</page-button
          >
          <page-button
            v-if="editState && showBtn('editClose')"
            theme="default"
            @click="cancel"
            >{{ showBtn("editClose")?.btnName ?? "取消" }}</page-button
          >
        </template>
        <template v-else>
          <page-button v-if="showBtn('save') && editState" @click="submit(1)"
            >保存</page-button
          >
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('closePage')">{{
          showBtn("closePage")?.btnName ?? "关闭"
        }}</page-button>
        <workflow-operation
          code="market_buyingLead_purchaseProject"
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
                  @change:radio="onInputBlurFormChange"
            ref="dataForm"
          ></data-form>
          <sub-title title="采购明细">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cgmx = !formDataShow.cgmx"
              ></i>
            </template>
            <template #buttons>
              <div class="table-action-layouts" v-if="editState && formDataShow.cgmx">
                <page-button
                  v-if="showBtn('tableCopy')"
                  type="text"
                  @click="onTableActionBtnClick('copy')"
                  >复制</page-button
                >
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
                <div class="app-table-moveto" v-if="showBtn('tabletoLine')">
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
                
                  <page-button
                    v-if="editState && showBtn('addList') && form.isBidSegment"
                    @click="addListClick"
                    >添加明细</page-button
                  >
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cgmx"
            :data="form.detailList"
            :id="`tb_xmsq_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="bindColumn"
            ref="table"
            min-height="180"
            max-height="600"
          >
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
            <template #areaCodeList="{ row, rowIndex }">
            <template v-if="editState">
              <pca  
              v-model="row.areaCodeList" 
              data-type="string"
                placeholder="请选择区域"
                :check-strictly="false"
                ></pca>
            </template>
            <template v-else>
              <span>{{row.areaCodeListName}}</span>
            </template>
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
                                    upDownMove(
                                      $event,
                                      rowIndex,
                                      columnIndex,
                                      column
                                    );
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
      width="80%"
      v-model="addListVisible"
      resize
      title="添加明细"
      destroy-on-close
      height="90%"
      @close="addListVisible = false"
      class-name="add-modal"
    >
      <product-list :menuCode="menuCode" @ok="addProductData" v-if="addListVisible"></product-list>
    </vxe-modal>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

<template>
  <app-page>
    <bill-btns :form="form" title="采购需求单号">
      <template #buttons>
        <template v-if="id">
          <page-button v-if="!editState && showBtn('submitWorkflow')" @click="onSubmitBtnClick" >{{ showBtn("submitWorkflow")?.btnName ?? "提交审批"}}</page-button>
          <page-button theme="special" @click="editForm" v-if="!editState && showBtn('edit')" >修改</page-button>
          <page-button v-if="showBtn('save') && editState" @click="submit(2)">保存</page-button>
          <page-button v-if="editState && showBtn('editClose')" theme="default" @click="cancel" >{{ showBtn("editClose")?.btnName ?? "取消" }}</page-button>
        </template>
        <template v-else>
          <page-button v-if="showBtn('save') && editState" @click="submit(1)" >保存</page-button>
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('closePage')">{{ showBtn("closePage")?.btnName ?? "关闭" }}</page-button>
        <workflow-operation
          code="market_buyingLead_purchaseApply"
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
              <i :class="formDataShow.jbxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="formDataShow.jbxx = !formDataShow.jbxx"></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.jbxx"
            :items="bindDescItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
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
                <div style="color:red;">采购需求</div>
              </div>
            </template>
          </data-form>
          <sub-title title="采购明细">
            <template #beforeIcon>
              <i :class=" formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.cgmx = !formDataShow.cgmx"></i>
            </template>
            <template #buttons >
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
                <combine-operation
                  style="margin-left: 12px"
                  :options="combineOptions"
                  :source-list="descSourceList"
                  button-text="批量填充"
                  v-if="showBtn('onCombineOptions')"
                  :disabled="!editState"
                  @click="onCombineOptionsOk"
                ></combine-operation>
              </div>
              <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button
                    v-if="editState && showBtn('addList')"
                    @click="addListVisible = true"
                  >添加物料</page-button>
                  <page-button
                    theme="special"
                    style="margin-right:12px;"
                    v-if="editState && showBtn('addUnList')"
                    @click="addUnconVisible = true"
                  >添加临时物料</page-button>
                </template>
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
            v-show="formDataShow.cgmx"
            :data="form.detailList"
            :id="`tb_cgsq_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            ref="table"
            min-height="180"
            max-height="600"
          >
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
          <template #rowNum="{ row, rowIndex }">
            <div style="display: flex; justify-content: space-between">
              <span>
                <bill-item-state-icon
                  v-if="row.notGeneral"
                  icon="fei"
                ></bill-item-state-icon>
              </span>
              <span>{{ rowIndex + 1 }}</span>
            </div>
          </template>
          <template #slot_header="{ column }">
            <span>
              <span v-if="column.params && column.params.required" style="color: red;">*</span>
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
          <template #slot_edit_select="{
            row,
            rowIndex,
            $rowIndex,
            column,
            columnIndex,
            $columnIndex,
          }">
            <template v-if="editState && row.notGeneral">
              <el-select v-model="row[column.field]" placeholder="请选择" size="small">
                <el-option
                  v-for="item in descSourceList[column.params.source]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
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
                size="small"
                style="width: 100%"
                v-model="row[column.field]"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </template>
            <template v-else>
              <span v-if="row[column.field]">{{moment(row[column.field]).format("YYYY-MM-DD")}}</span>
            </template>
          </template>
          <template #slot_edit_qty="{
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
            <template v-if="editState && row.notGeneral">
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
            <template v-if="editState && row.notGeneral">
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
        <el-tab-pane name="syxx">
          <span slot="label">溯源信息</span>
          <div v-if="activeName == 'syxx'">
            <timeline :billId="id" nodeType="PURCHASE_ORDER"></timeline>
          </div>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            v-show="formDataShow.fjcz"
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
    <column-pasting :visible="lztVisible" @ok="lztOk" @close="lztClose" :lztLoadText="lztLoadText" />
    
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
      <!-- <product-list :menuCode="menuCode" @ok="addProductData" v-if="addListVisible"></product-list> -->
      <material-list :menuCode="menuCode" @ok="addProductData" v-if="addListVisible"></material-list>
    </vxe-modal>
    <vue-easy-lightbox
      :visible="previewImg"
      :imgs="imgs"
      :index="previewIndex"
      @hide="previewImg = false"
      ref="lightbox"
    ></vue-easy-lightbox>
    <template #custom>
      <page-drawer
        v-model="addUnconVisible"
        direction="ltr"
        width="95%"
        destroy-on-close
        :z-index="980"
        @closed="handleClose"
        :maskClosable="false"
      >
        <addUnconventional
          :detailList="form.detailList"
          @submit="addUnconOk"
          @close="addUnconVisible = false"
        />
      </page-drawer>
    </template>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

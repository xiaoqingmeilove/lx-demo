<template>
  <app-page>
    <bill-btns :form="form" title="单据号" filed="billNo">
      <template #buttons>
        <template v-if="id">
          <template v-if="editState">
            <page-button v-if="showBtn('save')" @click="editSave">保存</page-button>
            <page-button v-if="showBtn('cancel')" @click="cancel">取消</page-button>
          </template>
          <template v-else>
            <page-button v-if="showBtn('confirm')" @click="confirm">确认</page-button>
            <page-button v-if="showBtn('reject')" theme="red" @click="reject">拒绝</page-button>
            <page-button v-if="showBtn('submitWorkflow')" @click="onSubmitBtnClick">提交审批</page-button>
            <page-button theme="special" v-if="showBtn('edit')" @click="editClick">修改</page-button>
          </template>
        </template>
        <page-button v-if="showBtn('close')" @click="$tabs.close()">关闭</page-button>
        <workflow-operation
          code="market_srm_order_confirm"
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
         <!-- <el-tab-pane name="yhjh" >
          <span slot="label">要货计划</span>
          <data-form
            :items="planDescItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="planDataForm"
          >
          </data-form>
          <sub-title title="批次信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.pcxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.pcxx = !formDataShow.pcxx"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="plantoolbar" class="app-table-toolbar">
                <template #buttons>
                </template>
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultPlanColumns"
                    @ok="(e) => onToolOk(e, 'planTableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.pcxx"
            :data="form.purchPlanList"
            :id="`tb_purchaseOrder_orderConfim_pcxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="planTableColumns"
            min-height="180px"
            max-height="300px"
            ref="plantable"
            @cell-click="planCellClick"
          >
            </vxe-grid>
          <sub-title title="批次产品清单">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.pccpxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.pccpxx = !formDataShow.pccpxx"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="plancptoolbar" class="app-table-toolbar">
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultPlancpColumns"
                    @ok="(e) => onToolOk(e, 'planTableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.pccpxx"
            :data="planTableList"
            :id="`tb_purchaseOrder_orderConfim_pccpqd_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="plancpTableColumns"
            min-height="180px"
            max-height="600px"
            ref="plancptable"
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
                  @input="planInputChage(row, rowIndex, column)"
                  @blur="planInputChage(row, rowIndex, column)"
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
        </el-tab-pane>        -->

        <el-tab-pane name="yhjh" >
          <span slot="label">要货计划</span>
          <el-form :model="form" :rules="planRules"  ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="要货计划类型：" prop="planType">
              <el-radio-group v-model="form.planType" :disabled="true" size="mini" @change="onInputBlurFormChange">
                  <template v-for="item in descSourceList.planTypeList">
                    <el-radio-button :key="item.value" :label=" item.value" > {{ item.label }}</el-radio-button>
                  </template>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <sub-title title="批次信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.pcxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.pcxx = !formDataShow.pcxx"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="plantoolbar" class="app-table-toolbar">
                <!-- <template #buttons>
                  <page-button v-if="editState == 2" :disabled="!!(form.planType == 1 && form.purchPlanList && form.purchPlanList.length)"  @click="addPlan" content="添加批次" type="text" style="margin-right: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
                </template> -->
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultPlanColumns"
                    @ok="(e) => onToolOk(e, 'planTableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.pcxx"
            :data="form.purchPlanList"
            :id="`tb_purchaseOrder_orderApply_pcxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="planTableColumns"
            :rules="planTableRules"
            min-height="180px"
            max-height="300px"
            ref="plantable"
            @cell-click="planCellClick"
          >
          </vxe-grid>

          <div v-for="(item,index) in form.purchPlanList" :key="index" style="margin-top: 20px;">
            <sub-title :title=" item.batch?item.batch: item.batchNo + '批次产品清单'" >
                <template #buttons>
                  <vxe-toolbar ref="plancptoolbar" class="app-table-toolbar" v-if="index==0">
                    <template #tools>
                      <table-tools
                        :tools="['setting']"
                        :default-columns="defaultPlancpColumns"
                        @ok="(e) => onToolOk(e, 'plancpTableColumns')"
                      ></table-tools>
                    </template>
                  </vxe-toolbar>
                </template>
            </sub-title>
              <vxe-grid
                :data="item.detailList"
                :id="`tb_purchaseOrder_orderConfim_pccpqd_list_${index}`"
                :custom-config="{ storage: true }"
                :columns="plancpTableColumns"
                min-height="180px"
                max-height="600px"
                ref="plancptable"
              >
              <template #rowNum="{ row, rowIndex }">
                <div style="display: flex; justify-content: space-between">
                  <span>{{ rowIndex + 1 }}</span>
                </div>
              </template>
              <template  #slot_edit_date="{
                    row,
                    rowIndex,
                    $rowIndex,
                    column,
                    columnIndex,
                    $columnIndex,
                  }"
                >
                  <template v-if="editState === 2">
                    <el-date-picker
                      v-model="row[column.field]"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      size="small"
                      style="width: 100%"
                      :picker-options="pickerOptions"
                      @change="dateChange(row, rowIndex, column)"
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
                  <template v-if="editState == 2">
                    <vue2-number-input
                      v-model="row[column.field]"
                      :controls="false"
                      focus-select
                      :data-row="rowIndex"
                      :data-column="columnIndex"
                      :digits="getDigits(column)"
                      @blur="integerInputChage(row, rowIndex, column.field)"
                      @input="upDownMove($event, rowIndex, columnIndex, column, row)"
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
                  <template v-if="editState === 2">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 1, maxRows: 1 }"
                      resize="none"
                      placeholder="请输入"
                      rows="1"
                      v-model="row[column.field]"
                      @focus="($event) => $event.target.select()"
                      @change="textareaChange(row, rowIndex, column)"
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
        
              </vxe-grid>
          </div>

          <div class="contrast" v-if="form.differences">
            <div class="title">差异对比</div>
            <div class="state">
              <span class="del">删除</span>
              <span class="new">修改</span>
              <!-- <span class="edit">修改</span> -->
            </div>
            <div class="category">
              <div class="item">
                 <template v-for="(it,index) in form.differences">
                    <p :key="index">
                      {{it.batch}}({{ it.materialName }}):  
                      <span class="old">{{it.old}}</span> → 
                      <span class="new">{{it.new}}</span> 
                      <span class="remark" v-show="it.remark">({{ it.remark }})</span>
                    </p>
                 </template>
              </div>
            </div>
          </div>



        </el-tab-pane>



        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <data-form
            :items="descItems"
            :form-data="form"
            :source-list="descSourceList"
            :rules="rules"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #supplierName="{ row }">
              <span :title="form.supplierName">{{ form.supplierName }}</span>
            </template>
            <template #confirmAddress="{ row }">
              <splicin-address :form="form" style="display: inline-block;"></splicin-address>
              <!-- <span :title="form.confirmAddress">
                {{ form.confirmAddress }}
              </span> -->
            </template>
            <template #purchaseDeptName="{ row }">
              <span :title="form.purchaseDeptName">{{ form.purchaseDeptName }}</span>
            </template>
          </data-form>
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
                    @ok="(e) => onToolOk(e, 'columns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cpxx"
            :data="form.detailList"
            :id="`tb_purchaseOrder_orderConfim_cpxx_list_${userInfo.userId}`"
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
                  @input="inputChage(row, rowIndex, column)"
                  @blur="inputChage(row, rowIndex, column)"
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

        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.masterId"
            bill-type="O"
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

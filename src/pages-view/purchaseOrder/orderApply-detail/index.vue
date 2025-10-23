<template>
  <app-page>
    <bill-btns :form="form" title="采购订单">
      <template #buttons>
        <template v-if="id">
          <page-button v-if="showBtn('syncAps')" @click="syncApsSubmit">{{ showBtn('syncAps')?.btnName ?? "数据同步" }}</page-button>
          <page-button v-if=" showBtn('notice') && !editState" @click="orderNotice" class="page-button-red"  >{{ showBtn("notice")?.btnName ?? "订单发布" }}</page-button>
          <page-button v-if=" showBtn('submitWorkflow')  && !editState" @click="onSubmitBtnClick" >
            {{ showBtn("submitWorkflow")?.btnName ?? "提交审批" }}</page-button >
          <page-button theme="special"  @click="editForm"  v-if="showBtn('edit') && !editState" >修改</page-button>
          <page-button v-if="showBtn('save') && editState" @click="submit(2)" >保存</page-button>
          <page-button v-if=" showBtn('cancel') && editState" theme="default" @click="cancel" >{{ showBtn("cancel")?.btnName ?? "取消" }}</page-button>
        </template>
        <template v-else>
          <page-button v-if="showBtn('save') && editState" @click="submit(1)">保存</page-button>
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('close')">{{ showBtn("close")?.btnName ?? "关闭"}}</page-button>
        <workflow-operation
          code="market_srm_order"
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
              <i
                :class="
                  formDataShow.jbxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.jbxx = !formDataShow.jbxx"
              ></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.jbxx"
            :items="bindDescItems"
            :form-data="form"
            :editable="editState == 1"
            :source-list="descSourceList"
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #supplierName="{item}">
              <div class="form-content" >
                <el-input placeholder="请输入内容" v-if="editState == 1" v-model="form.supplierName" readonly class="input-with-select">
                  <el-button slot="append" type="primary" plain  icon="el-icon-search" @click="visible.addSupplierVisible=true">选择</el-button>
                </el-input>
                <span class="form-content-value" v-else :title="form.supplierName">{{form.supplierName}}</span>
                <!-- <page-button v-if="editState == 1" type="text" @click="visible.addSupplierVisible=true">选择</page-button> -->
                <!-- <el-button  v-if="editState == 1" size="mini" type="primary" plain icon="el-icon-search" @click="visible.addSupplierVisible=true">选择</el-button> -->
              </div>
            </template>
            <template #confirmAddress="{item}">
              <div class="form-content">
                <div class="form-content-value">
                  <splicin-address :form="form" style="display: inline-block;"></splicin-address>
                  <!-- <span style="margin-right: 30px;">{{form.confirmAddress}}</span> -->
                  <page-button  type="text" v-if="editState == 1" @click="visible.viewAddressVisible=true">更改收货地址</page-button>
                  <el-button type="primary" v-if="editState == 1" size="mini" plain @click="visible.addAddressDrawer=true" style="margin-left: 10px;">添加新地址</el-button>
                </div>
              </div>
            </template>

            <template #fileList>
              <div class="file-list">
                <upload-button v-if="editState == 1" content="点击上传" style="width:90px" plain @success="(e) => onUploadSuccess(e, 'fileList', 1)"></upload-button>
                <div v-if="editState == 1"  class="upload_spec">最多1个文件</div>
                <div v-for="(item, index) in form.fileList" :key="index" v-if="form.fileList && form.fileList.length">
                  <div class="file-list-item">
                    <div class="content" @click="viewFile(item, form.fileList)" style="color:var(--base-color);cursor: pointer;">{{item.originalFileName??''}}</div>
                    <div v-if="editState == 1" class="bnt" @click.stop="form.fileList.splice(index, 1)"><i class="el-icon-close"></i></div>
                  </div>
                </div>
                <!-- <div style="color:red;">采购需求</div> -->
              </div>
            </template>
          </data-form>
          <sub-title title="产品明细">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cgmx = !formDataShow.cgmx"
              ></i>
            </template>
            <template #buttons >
              <div class="table-action-layouts" v-if="editState == 1 && formDataShow.cgmx">
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
                  :disabled="!editState == 1"
                  @click="onCombineOptionsOk"
                ></combine-operation>
              </div>
              <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button v-if="editState == 1 && showBtn('addList')"  @click="addListVisibleFn()" >
                    {{ showBtn("addList")?.btnName ?? "选择价目" }}
                  </page-button>
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
              <template v-if="editState == 1">
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
            <template #action="{row, rowIndex}">
              <page-button type="text" @click="viewPrice(row)">查看阶梯价</page-button>
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
              <template v-if="editState == 1">
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
              <template v-if="editState == 1 && row.notGeneral">
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
              <template v-if="editState == 1">
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
              <template v-if="editState == 1">
                <vue2-number-input
                  v-model="row[column.field]"
                  focus-select
                  :controls="false"
                  :data-row="rowIndex"
                  :data-column="columnIndex"
                  :digits="getDigits(column.field)"
                  @input="upDownMove($event, rowIndex, columnIndex, column , row)"
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
              <template v-if="editState == 1">
                <vue2-number-input
                  v-model="row[column.field]"
                  :controls="false"
                  focus-select
                  :digits="getDigits(column.field)"
                  @blur="integerInputChage(row, rowIndex, column.field)"
                  :data-row="rowIndex"
                  :data-column="columnIndex"
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
              <template v-if="editState == 1 && row.notGeneral">
                <vxe-input
                  v-model="row[column.field]"
                  @focus=" ({ $event }) => { $event.target.select()} "
                  :data-row="rowIndex"
                  :data-column="columnIndex"
                  @input=" ({ $event }) => { upDownMove( $event, rowIndex, columnIndex, column, row )}"
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

          <sub-title title="采购合计">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cghj ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cghj = !formDataShow.cghj"
              ></i>
            </template>
          </sub-title>
          <div class="cghj-content" v-show="formDataShow.cghj">
            <p>不含税总额:￥<span>{{form.untaxAmount?(form.untaxAmount).toFixed(2):0}}</span></p>
            <p>税费:￥<span>{{form.taxAmount?(form.taxAmount).toFixed(2):0}}</span></p>
            <p>订单总额：￥<span>{{form.amount?(form.amount).toFixed(2):0}}</span></p>
          </div>

        </el-tab-pane>

        <el-tab-pane name="yhjh" v-if="form.billState == 2">
          <span slot="label">要货计划</span>
          <el-form :model="form" :rules="planRules"  ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="要货计划类型：" prop="planType">
              <el-radio-group v-model="form.planType" :disabled="editState != 2" size="small" @change="onInputBlurFormChange">
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
                <template #buttons>
                  <page-button v-if="editState == 2" :disabled="!!(form.planType == 1 && form.purchPlanList && form.purchPlanList.length)"  @click="addPlan" content="添加批次" type="text" style="margin-right: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
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
            :id="`tb_purchaseOrder_orderApply_pcxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="planTableColumns"
            :rules="planTableRules"
            min-height="180px"
            max-height="300px"
            ref="plantable"
            @cell-click="planCellClick"
          >
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
              <template v-if="editState === 2">
                <el-date-picker
                  v-model="row[column.field]"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  size="small"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                  @blur="onInputBlur(row, rowIndex, column, columnIndex, $columnIndex)"
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
              <template v-if="editState === 2">
                <vxe-input
                  v-model="row[column.field]"
                  @focus="
                    ({ $event }) => {
                      $event.target.select();
                    }
                  "
                  :data-row="rowIndex"
                  :data-column="columnIndex"
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
            <template #action="{row, rowIndex}">
              <page-button :disabled="editState != 2" style="color:red;background:#FEF2F2" @click="delPlan(row, rowIndex)">删 除</page-button>
            </template>
          </vxe-grid>

          <div v-for="(item,index) in form.purchPlanList" :key="index" style="margin-top: 20px;">
            <sub-title :title=" item.batchNo + '批次产品清单'" >
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
                :id="`tb_purchaseOrder_orderApply_pccpqd_list_${index}`"
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
                      :digits="getDigits2(column)"
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
    
              </vxe-grid>
          </div>
<!-- 
          <div class="contrast">
            <div class="title">差异对比</div>
            <div class="state">
              <span class="new">新增</span>
              <span class="del">删除</span>
              <span class="edit">修改</span>
            </div>
            <div class="category">
              <div class="item">
                <div class="itemTitle">数量调整</div>
                <p>aaa: <span class="old">200</span> → <span class="new">110</span> <span class="remark">(123)</span></p>
                <p>aaa: <span class="old">200</span> → <span class="new">110</span> <span class="remark">(123)</span></p>
                <p>aaa: <span class="old">200</span> → <span class="new">110</span> <span class="remark">(123)</span></p>
              </div>
              <div class="item">
                <div class="itemTitle">交期调整</div>
                <p>aaa: <span class="old">200</span> → <span class="new">110</span> <span class="remark">(123)</span></p>
                <p>aaa: <span class="old">200</span> → <span class="new">110</span> <span class="remark">(123)</span></p>
              </div>
            </div>
          </div> -->



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
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            bill-type="O"
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
    
    <!-- 添加价目表弹出组件 -->
    <vxe-modal
      width="80%"
      v-model="visible.addListVisible"
      resize
      title="添加明细"
      destroy-on-close
      height="90%"
      @close="visible.addListVisible = false" 
      class-name="add-modal"
    >
      <price-common-list :menuCode="menuCode" :searchData="{supplierName: form.supplierName}" @ok="addPriceData" v-if="visible.addListVisible"></price-common-list>
    </vxe-modal>

    <!-- 查看阶梯价弹出组件 -->
    <vxe-modal
      width="50%"
      v-model="visible.viewPriceVisible"
      resize
      title="查看阶梯价"
      destroy-on-close
      height="50%"
      @close="visible.viewPriceVisible = false"
      class-name="add-modal"
    >
      <price-common-detail :viewPriceRow="viewPriceRow" :menuCode="menuCode"></price-common-detail>
    </vxe-modal>

    <!-- 查看收货地址 -->
    <vxe-modal
      width="80%"
      v-model="visible.viewAddressVisible"
      resize
      title="选择收货地址"
      destroy-on-close
      height="50%"
      @close="visible.viewAddressVisible = false"
      class-name="add-modal"
    >
      <view-address :menuCode="menuCode" @ok="addAddressData" v-if="visible.viewAddressVisible"></view-address>
    </vxe-modal>

    <vue-easy-lightbox
      :visible="previewImg"
      :imgs="imgs"
      :index="previewIndex"
      @hide="previewImg = false"
      ref="lightbox"
    ></vue-easy-lightbox>

    <template #custom>
      <vxe-modal
        width="80%"
        v-model="visible.addSupplierVisible"
        resize
        title="添加供应商"
        destroy-on-close
        height="90%"
        show-zoom
        @close="visible.addSupplierVisible = false"
        class-name="add-modal"
      >
        <supplier-list
          :menuCode="menuCode"
          @ok="addSupplierData"
          v-if="visible.addSupplierVisible"
        ></supplier-list>
      </vxe-modal>
<!--       
      <vxe-modal
        width="80%"
        v-model="visible.addProductList"
        resize
        title="选择物料"
        destroy-on-close
        height="90%"
        show-zoom
        @close="visible.addProductList = false"
        class-name="add-modal"
      >
        <material-list
          :menuCode="menuCode"
          @ok="addMaterialData"
          v-if="visible.addProductList"
        ></material-list>
      </vxe-modal>
      <vue-easy-lightbox
        :visible="previewImg"
        :imgs="imgs"
        :index="previewIndex"
        @hide="previewImg = false"
        ref="lightbox"
      ></vue-easy-lightbox>

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
      </page-drawer> -->
    </template>

    <!-- 添加地址联系人 -->
    <el-drawer
      title="确认收货地址"
      :visible.sync="visible.addAddressDrawer"
      :modal-append-to-body="false"
      direction="rtl"
      custom-class="add-address-drawer"
      ref="drawer"
      >
      <div class="add-address-drawer__content">
        <el-form :model="addAddressForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="区域" prop="addAddressForm">
            <pca-cascader-home
              v-model="addAddressForm"
              data-type="string"
              @change="pcaChange"
              clearable
              :check-strictly="false"
              placeholder="请选择"
              style="width: 100%"
            ></pca-cascader-home>
          </el-form-item>
          <el-form-item label="详细地址" prop="deliveryAddress">
            <el-input v-model="addAddressForm.deliveryAddress" placeholder="请输入详细地址" :clearable="true" ></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="receiveLinkName">
            <el-input v-model="addAddressForm.receiveLinkName" placeholder="请输入联系人" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="receiveLinkTel">
            <el-input v-model="addAddressForm.receiveLinkTel"  placeholder="请输入联系方式" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="是否默认" prop="defaultFlag">
            <el-radio v-model="addAddressForm.defaultFlag" label="1">是</el-radio>
            <el-radio v-model="addAddressForm.defaultFlag" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="visible.addAddressDrawer = false">取 消</el-button>
          <el-button type="primary" @click="addAddress">确定</el-button>
        </div>
      </div>
    </el-drawer>

    
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

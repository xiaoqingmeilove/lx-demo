<template>
  <app-page>
    <bill-btns :form="form">
      <template #state></template>
      <template #buttons>
        <template v-if="id">
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
          <page-button
            v-if="!editState && showBtn('submit')"
            @click="submitApply"
            >{{ showBtn("submit")?.btnName ?? "提交报价" }}</page-button
          >
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('closePage')">{{
          showBtn("closePage")?.btnName ?? "关闭"
        }}</page-button>
      </template>
      <template #steps>
        <div class="steps-box">
          <el-steps :active="activeStep" align-center>
            <el-step
              :status="getStepStatus(0)"
              title="待报价"
              description=""
            ></el-step>
            <el-step
              :status="getStepStatus(1)"
              title="已报价"
              description=""
            ></el-step>
            <el-step
              :status="getStepStatus(2)"
              title="已开标"
              description=""
            ></el-step>
            <el-step
              :status="getStepStatus(3)"
              title="已定标"
              description=""
            ></el-step>
          </el-steps>
          <!-- 装饰盖章图片 -->
          <img
            class="steps-stamp"
            src="./getit.png"
            alt="stamp"
            v-if="getStepStatus(4) === 'process'"
          />
        </div>
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
            ref="dataForm"
          >
            <template #quotationCountdown="{ row }">
              <span
                style="color: red"
                v-if="form.enquiryState == '0' || form.enquiryState == '1'"
                >{{ timeDifference }}</span
              >
              <span style="color: red" v-else>已结束</span>
            </template>
          </data-form>

          <sub-title title="报价明细">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.bjmx
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.bjmx = !formDataShow.bjmx"
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
            v-show="formDataShow.bjmx"
            :data="form.detailList"
            :id="`tb_xjsq_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
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
            <!-- 是否现货 -->
            <template
              #slot_edit_flag="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-checkbox
                  v-model="row[column.field]"
                  :true-label="1"
                  :false-label="0"
                  @change="(e) => inStockFlagChange(e, row, rowIndex, column)"
                  >是否现货</el-checkbox
                >
              </template>
              <template v-else>
                <span>{{ row[column.field] ? "有现货" : "无现货" }}</span>
              </template>
            </template>
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
          <div class="cghj-content" v-show="formDataShow.bjhz">
            <p>
              不含税总额:￥<span>{{
                form.untaxAmount ? form.untaxAmount.toFixed(2) : 0
              }}</span>
            </p>
            <p>
              税费:￥<span>{{
                form.taxAmount ? form.taxAmount.toFixed(2) : 0
              }}</span>
            </p>
            <p>
              订单总额：￥<span>{{
                form.amount ? form.amount.toFixed(2) : 0
              }}</span>
            </p>
          </div>

          <!-- <data-form
            v-show="formDataShow.bjhz"
            :items="descItems1"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj1"
            ref="dataForm"
          ></data-form> -->
        </el-tab-pane>
        <el-tab-pane name="xjxx">
          <span slot="label">询价信息</span>
          <data-form
            :items="descItems2"
            :form-data="form.enquiryApplyBill"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj2"
            ref="dataForm"
            class="dataForm"
          >
            <template #areaCodeList="{ item }">
              <div class="form-content">
                <div class="form-content-value">
                  <splicin-address
                    :form="form.enquiryApplyBill"
                    style="display: inline-block"
                  ></splicin-address>
                  <!--  <page-button  type="text" v-if="editState" @click="visible.viewAddressVisible=true">更改收货地址</page-button> -->
                  <!-- <el-button type="primary" v-if="editState" size="mini" plain @click="visible.addAddressDrawer=true" style="margin-left: 10px;">添加新地址</el-button> -->
                </div>
              </div>
            </template>

            <template #slot_switch="{ item }">
              <el-switch
                v-model="form[item.field]"
                :disabled="!editState"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </template>
          </data-form>
          <sub-title title="询价内容">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.xjnr
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.xjnr = !formDataShow.xjnr"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="toolbar1" class="app-table-toolbar">
                <template #buttons> </template>
                <template #tools>
                  <table-tools
                    :default-columns="defaultColumns1"
                    @ok="onToolOk"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.xjnr"
            :data="form.detailList"
            :id="`tb_xjsq_detail1_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns1"
            ref="table1"
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
                <span>{{ row.areaCodeListName }}</span>
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
                  :digits="getDigits(column.field)"
                  @keydown="upDownMove($event, rowIndex, columnIndex, column)"
                  @change="upDownMove($event, rowIndex, columnIndex, column)"
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
                  @change="upDownMove($event, rowIndex, columnIndex, column)"
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
          <sub-title title="参与供应商">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.gys
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.gys = !formDataShow.gys"
              ></i>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.gys"
            :data="form.enquiryApplyBill?.supplierList"
            :id="`tb_xjsq_supplier_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="supplierColumns"
            ref="supplierTable"
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
                <span>{{ row.areaCodeListName }}</span>
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
                <span
                  v-if="column.params && column.params.required"
                  style="color: red"
                  >*</span
                >
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
            <template
              #slot_edit_select="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState && row.notGeneral">
                <el-select
                  v-model="row[column.field]"
                  placeholder="请选择"
                  size="small"
                >
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
                <span v-if="row[column.field]">{{
                  moment(row[column.field]).format("YYYY-MM-DD")
                }}</span>
              </template>
            </template>
            <template
              #slot_edit_qty="{
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
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            :bill-type="fileBillTpye"
            ref="fileList"
            menuCode="seekContrast_supplierApply"
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
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
/* 询价流程时间轴右侧盖章装饰 */
.steps-box {
  position: relative;
}
/* 询价流程时间轴右侧盖章装饰 */
.steps-box {
  position: relative;
}
.steps-stamp {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 120px;
  opacity: 0.2;
  transform: rotate(-18deg);
  pointer-events: none;
  user-select: none;
  z-index: 2;
}
</style>

<template>
  <app-page>
    <bill-btns :form="form" title="竞价单号" filed="billNo">
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
            >{{ showBtn("submitWorkflow")?.btnName ?? "提交审批" }}</page-button>
            <page-button v-if="showBtn('toPricing')" @click="toPricing">核价</page-button>
            <page-button theme="special" v-if="showBtn('edit')" @click="editClick">修改</page-button>
          </template>
        </template>
        <template v-else>
          <page-button v-if="showBtn('addSave')" @click="addSave">保存</page-button>
        </template>
        <page-button v-if="showBtn('closePage')" @click="$tabs.close()">关闭</page-button>
        <workflow-operation
          v-show="!editState"
          code="market_bidding_apply"
          :bill-id="form.id"
          :bill-no="form.billNo"
          :bill-state="form.billState"
          :read-only="false"
          :before-submit="beforeSubmit"
          @ok="onWorkflowOk"
          ref="workflow"
        ></workflow-operation>
      </template>
      <template #steps>
        <div class="steps-box">
          <el-steps :active="form.projectStatus" align-center >
            <el-step title="报名中" description=""></el-step>
            <el-step title="报名截止" description=""></el-step>
            <el-step title="竞价开始" description=""></el-step>
            <el-step title="竞价结束" description=""></el-step>
            <el-step title="定标" description=""></el-step>
          </el-steps>
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
            :rules="rules"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #supplierListObj="{ value, item }">
              <div class="supplier-config">
                <div v-for="(items, index) in form.supplierList" :key="items.id">
                  <div class="supplier-item">
                    <span>{{ items.supplierName }}</span>
                    <span>{{ items.linkerName }}</span>
                    <span>{{ items.linkerTel }}</span>
                    <i
                      @click.stop="delSupplier(value, item, items, index)"
                      v-if="editState"
                      type="close"
                      class="el-icon-close icon1"
                    />
                  </div>
                </div>
                <page-button v-if="editState" @click="visible.addSupplierVisible=true" type="text">
                  <i class="el-icon-circle-plus-outline"></i>
                </page-button>
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
            :id="`tb_bidInvite_detail_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            :footer-method="footerMethod"
            :show-footer="showfooter('tableColumns')"
            min-height="180px"
            max-height="600px"
            ref="cpxxtable"
          >
            <template #slot_edit_select="{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex}">
                <template v-if="editState">
                    <el-select v-model="row[column.field]" placeholder="请选择" size="small" @change="inputChange(row, rowIndex, column)">
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
            <template #slot_areaCodeList="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <pca-cascader-home
                  v-model="form.detailList[rowIndex]"
                  data-type="string"
                  @change="(e) => pcaRowChange(e, row, rowIndex)"
                  clearable
                  :check-strictly="false"
                  style="width: 100%"
                ></pca-cascader-home>
              </template>
              <template v-else>
                <span>{{ row.areaCodeListName }}</span>
              </template>
            </template>
            <!-- 文本 -->
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
                <el-input
                  placeholder="请输入"
                  v-model="row[column.field]"
                  @focus="($event) => $event.target.select()"
                  size="small"
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
                  size="small"
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
            <!-- 时间日期 -->
            <template
              #slot_edit_datetime="{
                row,
                rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-date-picker
                  style="width: 100%"
                  v-model="row[column.field]"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="small"
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
            <template #slot_edit_integerNumber="{row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,}">
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
            <template #slot_edit_textarea="{row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,}">
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
          </vxe-grid>
          <sub-title title="竞价规则">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.zjgz
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.zjgz = !formDataShow.zjgz"
              ></i>
            </template>
          </sub-title>
          <data-form
            labelWidth="188px"
            :items="descItems1"
            :form-data="form"
            v-show="formDataShow.zjgz"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm1"
          >
            <template #bid_interval>
              <span class="data-form--value">
                <span style="margin-right:6px">每次出价间隔时间</span>
                <template v-if="editState">
                  <el-input-number v-model="form.offerMin" controls-position="right" :min="0" size="small"></el-input-number>
                </template>
                <template v-else>
                  <span style="color: red">{{form.offerMin}}</span>
                </template>
                <span style="margin-left:6px">分钟</span>
              </span>
            </template>
            <template #deadline>
              <span class="data-form--value">
                <span style="margin-right:6px">在截止时间到</span>
                <!-- <template v-if="editState"> -->
                  <el-input-number v-model="form.num" controls-position="right" :disabled="!editState" :min="0" size="small"></el-input-number>
                <!-- </template>
                <template v-else>
                  <span style="color: red">****</span>
                </template> -->
                <span style="margin:0 6px">分钟内，且排名进入</span>
                <!-- <template v-if="editState"> -->
                  <el-input-number v-model="form.num" controls-position="right" :disabled="!editState" :min="0" size="small"></el-input-number>
                <!-- </template>
                <template v-else>
                  <span style="color: red">****</span>
                </template> -->
                <span style="margin:0 6px">名时触发延时</span>
                <!-- <template v-if="editState"> -->
                  <el-input-number v-model="form.num" controls-position="right" :disabled="!editState" :min="0" size="small"></el-input-number>
                <!-- </template>
                <template v-else>
                  <span style="color: red">****</span>
                </template> -->
                <span style="margin-left:6px">分钟</span>
              </span>
            </template>
          </data-form>

          <sub-title title="参与供应商">
            <template #beforeIcon>
              <i :class="formDataShow.gys ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.gys = !formDataShow.gys"></i>
            </template>
            <template #buttons >
              <page-button @click="addSupplierVisible=true" :disabled="!(form.inviteMethod=='designated' && editState)"  >添加供应商</page-button>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.gys"
            :data="form.supplierList"
            :id="`tb_xjsq_supplier_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="supplierColumns"
            ref="supplierTable"
            min-height="180"
            max-height="600"
          >
            <template #action="{ row, rowIndex }">
              <page-button type="text" @click="delSupplier(row, rowIndex)" v-if="editState">删除</page-button>
            </template>
            <template #quoteStateName="{ row }">
              <span @click="quoteStateNameClick(row)" style="color: #409EFF;cursor: pointer;">{{ row.quoteStateName }}</span>
            </template>
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
            bill-type="JS"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
    <vxe-modal
      width="80%"
      v-model="addSupplierVisible"
      resize
      title="添加供应商"
      destroy-on-close
      height="90%"
      @close="addSupplierVisible = false"
      class-name="add-modal"
    >
      <supplier-list
        :menuCode="menuCode"
        @ok="addSupplierData"
        v-if="addSupplierVisible"
      ></supplier-list>
    </vxe-modal>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>

<template>
  <app-page>
    <bill-btns :form="form" title="询价单号">
      <template #buttons>
        <template v-if="id">
          <page-button  v-if="showBtn('changeTime')" @click="visible.changeTimeVisible=true">{{ showBtn("changeTime")?.btnName ?? "变更时间" }}</page-button>
          <page-button  v-if="showBtn('moreEnquiry')" @click="visible.moreEnquiryVisible=true">{{ showBtn("moreEnquiry")?.btnName ?? "多轮询价" }}</page-button>
          <page-button theme="danger" v-if="showBtn('stop')" @click="stopEnquiry">{{ showBtn("stop")?.btnName ?? "终止询价" }}</page-button>
          <page-button v-if="!editState && showBtn('submitWorkflow')"  @click="onSubmitBtnClick" >{{ showBtn("submitWorkflow")?.btnName ?? "提交审批" }}</page-button>
          <page-button v-if="!editState && showBtn('priceComparison')" @click="priceComparisonClick">{{ showBtn("priceComparison")?.btnName ?? "比价" }}</page-button>
          <page-button v-if="!editState && showBtn('openBid')" @click="openBidClick" >{{ showBtn("openBid")?.btnName ?? "开标" }}</page-button>
          <page-button theme="special" @click="editForm"  v-if="!editState && showBtn('edit')" >修改</page-button>
          <page-button v-if="showBtn('save') && editState" @click="submit(2)" >保存</page-button>
          <page-button v-if="editState && showBtn('editClose')" theme="default"  @click="cancel" >{{ showBtn("editClose")?.btnName ?? "取消" }}</page-button>
        </template>
        <template v-else>
          <page-button v-if="showBtn('save') && editState" @click="submit(1)">保存</page-button>
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('closePage')">{{ showBtn("closePage")?.btnName ?? "关闭" }}</page-button>
        <workflow-operation
          code="market_seekContrast_enquiryApply"
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
          <el-steps :active="form.enquiryState" align-center >
            <el-step title="报名中" description=""></el-step>
            <el-step title="报名截止" description=""></el-step>
            <el-step title="报价中" description=""></el-step>
            <el-step title="已开标" description=""></el-step>
            <el-step title="已终止" description=""></el-step>
            <el-step title="已定标" description=""></el-step>
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
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm_JBXX"
            class="dataForm"
          >
          <template #areaCodeList="{ item }">
            <div class="form-content">
                <div class="form-content-value">
                  <splicin-address :form="form" style="display: inline-block;"></splicin-address>
                  <page-button  type="text" v-if="editState" @click="visible.viewAddressVisible=true">更改收货地址</page-button>
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
          <template #purchaseUserTel="{ item }">
            <el-input type="text" v-if="editState" clearable v-model="form.purchaseUserTel" style="width: 100%;"/>
            <span v-else>
              {{ form.purchaseUserTel }}
            </span>
          </template>
          </data-form>
          <sub-title title="询价内容">
            <template #beforeIcon>
              <i :class=" formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.cgmx = !formDataShow.cgmx" ></i>
            </template>
            <template #buttons >
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
            v-show="formDataShow.cgmx"
            :data="form.detailList"
            :id="`tb_xjsq_detail_${userInfo.userId}`"
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
          <sub-title title="业务规则">
            <template #beforeIcon>
              <i :class=" formDataShow.ywgz ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.ywgz = !formDataShow.ywgz"></i>
            </template>
          </sub-title>
          <data-form 
            v-show="formDataShow.ywgz"
            :items="businessRule"
            :form-data="form.ruleMap"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
          >
          <template #slot_switch="{ item }">
            <el-switch
              :disabled="!editState"
              v-model="form.ruleMap[item.field]"
              :active-value="1"
              :inactive-value="0"
              >
            </el-switch>
          </template>
          <template #openMethod="{ item }">
            <el-radio-group v-model="form.ruleMap[item.field]" :disabled="!editState">
              <el-radio v-for="item in descSourceList[item.source]" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </template>
          </data-form>
          <sub-title title="参与供应商">
            <template #beforeIcon>
              <i :class=" formDataShow.gys ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.gys = !formDataShow.gys"></i>
            </template>
            <template #buttons >
              <page-button @click="addSupplierVisible=true" :disabled="!(form.enquiryType=='designated' && editState)"  >添加供应商</page-button>
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
    <!-- 变更时间 -->
    <vxe-modal
      width="30%"
      v-model="visible.changeTimeVisible"
      show-footer
      resize
      title="变更时间"
      destroy-on-close
      @close="visible.changeTimeVisible = false"
      class-name="change-time-modal"
    >
    <template #default>
      <data-form ref="changeTimeDataForm"
      class="change-time-data-form"
      :items="changeTimeItems" 
      :form-data="changeTimeForm" 
      :source-list="descSourceList" 
      :editable="visible.changeTimeVisible"
      :rules="changeTimeRules">
      </data-form>
    </template>
    <template #footer>
      <page-button @click="visible.changeTimeVisible = false">取消</page-button>
      <page-button @click="changeTimeSubmit">确认</page-button>
    </template>
    </vxe-modal>
    <!--多轮询价 -->
    <vxe-modal
      show-footer
      width="80%"
      v-model="visible.moreEnquiryVisible"
      resize
      title="多轮询价"
      destroy-on-close
      @close="visible.moreEnquiryVisible = false"
      class-name="add-modal"
    >
    <template #default>
      <vxe-grid
        :checkbox-config="{ checkField: 'select' }"
        :data="form.supplierList"
        :id="`tb_xjsq_moreEnquiry_${userInfo.userId}`"
        :custom-config="{ storage: true }"
        :columns="moreEnquiryColumns"
        ref="moreEnquiryTable"
        min-height="180"
        max-height="600"
      >
      <template #select="{ row, rowIndex }">
        <el-checkbox v-model="row.select" :disabled="!visible.moreEnquiryVisible"></el-checkbox>
      </template>
      </vxe-grid>
    </template>
    <template #footer>
      <page-button @click="visible.moreEnquiryVisible = false">取消</page-button>
      <page-button @click="moreEnquirySubmit">确认</page-button>
    </template>
    </vxe-modal>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

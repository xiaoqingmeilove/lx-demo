<template>
  <app-page>
    <bill-btns :form="form" title="询价单号">
      <template #state>
        <span style="color:red;">{{form.enquiryStateName}}</span>
      </template>
      <template #buttons>
        <template v-if="id">
          <!-- <page-button theme="special" @click="editForm" v-if="!editState && showBtn('edit')" >修改</page-button>
          <page-button v-if="showBtn('save') && editState" @click="submit()">保存</page-button>
          <page-button v-if="showBtn('stop')" @click="stopEnquiry">{{ showBtn("stop")?.btnName ?? "终止" }}</page-button>
          <page-button v-if="showBtn('delay')" @click="delayClick">{{ showBtn("delay")?.btnName ?? "延期" }}</page-button>
          <page-button v-if="showBtn('resultConfirm')" @click="resultConfim">{{ showBtn("resultConfirm")?.btnName ?? "询价结果确认" }}</page-button>
          <page-button v-if="showBtn('againEnquiry')"  @click="againEnquiryClick" >{{ showBtn("againEnquiry")?.btnName ?? "二次询价" }}</page-button> -->
          <page-button v-if="showBtn('involved')" @click="involvedClick">{{ showBtn("involved")?.btnName ?? "参与报价" }}</page-button>
          <page-button theme="special" v-if="showBtn('accept')" @click="accept">{{ showBtn("accept")?.btnName ?? "报名" }}</page-button>
          <page-button theme="danger" v-if="showBtn('refuse')" @click="reject">{{ showBtn("reject")?.btnName ?? "不报名" }}</page-button>
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('closePage')">{{showBtn("closePage")?.btnName ?? "关闭"}}</page-button>
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
          <template #slot_switch="{ item }">
            <el-switch
              v-model="form[item.field]"
              :disabled="true"
              :active-value="1"
              :inactive-value="0"
              >
            </el-switch>
          </template>
          <template #areaCodeList="{ item }">
            <div class="form-content">
                <div class="form-content-value">
                  <splicin-address :form="form" style="display: inline-block;"></splicin-address>
                </div>
              </div>
          </template>
        </data-form>
          <sub-title title="询价内容">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cgmx = !formDataShow.cgmx"
              ></i>
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
            <template #buttons >
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
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            :bill-type="fileBillTpye"
            ref="fileList"
            menuCode="seekContrast_enquiryApply"
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
    <popup-form
      v-model="delayVisible"
      title="延期"
      :form-data="delayObj"
      :data-gather="delayDataGather"
      :rules="delayRules"
      @ok="delayOk"
      width="500"
    >
    </popup-form>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

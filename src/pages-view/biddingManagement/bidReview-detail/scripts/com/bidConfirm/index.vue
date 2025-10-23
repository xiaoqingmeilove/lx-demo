<template>
    <div>
      <div class="seach">
        <data-form
            :items="dataForm"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            ref="dataForm"
          >
          <template #tender_radio="{item}">
            <el-radio-group v-model="form.awardMethodCode" :disabled="!editState">
              <el-radio v-for="item in descSourceList[item.source]" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </template>
        </data-form>
      </div>

      <sub-title title="供应商报价信息">
          <template #beforeIcon>
            <i :class="formDataShow.gysxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="formDataShow.gysxx = !formDataShow.gysxx"></i>
          </template>
          <template #buttons>
          <page-button size="small" @click="handleConfirm" :disabled="!editState">确认中标供应商</page-button>
        </template> 
      </sub-title>
      <vxe-grid
        v-show="formDataShow.gysxx"
        :data="form.supplierList"
        :id="`tb_bid_confirm_${userInfo.userId}`"
        :custom-config="{ storage: true }"
        :columns="bidConfirmColumns"
        ref="table"
        min-height="180"
        max-height="600"
      >
        <template #rowNum="{rowIndex}">
          <span>{{ rowIndex + 1 }}</span>
        </template>
        <template #registrationStatus="{row}">
          {{ row.registrationStatusName }}
        </template>
        <template #action="{row}">
          <el-button type="text" size="small" @click="handleDetail(row)">查看详情</el-button>
        </template>
      </vxe-grid>
      <sub-title title="定标确认">
          <template #beforeIcon>
            <i :class="formDataShow.dbqr ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="formDataShow.dbqr = !formDataShow.dbqr"></i>
          </template>
      </sub-title>
      <div class="dbqr-content-box" v-show="formDataShow.dbqr">
        <vxe-grid
            v-show="formDataShow.dbqr"
            :data="form.awardList"
            :id="`tb_dbqr_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="dbqrColumns"
            ref="dbqrTable"
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
            <template #slot_edit_bidResult="{
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
        <div class="dbqr-content" >
          <div class="dbqr-content-item" v-for="item in form.supplierList" :key="item.id" v-if="item.registrationStatus == 4" >
            <div class="dbqr-title-item">中标供应商:{{ item.supplierName }}</div>
            <div class="dbqr-content-item-box">
              <div class="dbqr-content-item-label">中标金额：{{ item.bidAmount }}元</div>
              <div class="dbqr-content-item-label">评分：{{ item.score }}分</div>
            </div>
          </div>
        </div>

        <div class="dbqr-btn">
          <!-- <el-button type="primary" plain @click="handleSave" :disabled="!editState">保存草稿</el-button> -->
        </div>
      </div>

    </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

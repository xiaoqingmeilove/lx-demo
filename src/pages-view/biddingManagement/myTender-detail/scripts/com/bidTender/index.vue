<template>
    <div>
        <sub-title title="物料明细及报价">
            <template #beforeIcon>
                <i :class=" formDataShow.wlmxbj ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.wlmxbj = !formDataShow.wlmxbj"></i>
            </template>
            <template #buttons>
              <div class="table-action-layouts" v-if="editState && formDataShow.wlmxbj">
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
            </template>
        </sub-title>
        <div v-show="formDataShow.wlmxbj">
            <vxe-grid
                :data="form.detailList"
                :id="`tb_cgsq_detail_${userInfo.userId}`"
                :custom-config="{ storage: true }"
                :columns="columns"
                ref="table"
                min-height="120"
                max-height="600"
            >
                <template #rowNum="{ row, rowIndex }">
                    <div >
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
                <template #slot_edit_textarea="{
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
                <!-- 日期 -->
                <template #slot_edit_date="{
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
                <template #slot_edit_price="{
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
                    @keydown="upDownMove($event, rowIndex, columnIndex, column,row)"
                    @input="inputChange(row, rowIndex, column)"
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
                <template #slot_edit_number="{
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
                <template #slot_edit_integerNumber="{
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
                    :digits="getDigits(column.field)"
                    @keydown="upDownMove($event, rowIndex, columnIndex, column,row)"
                    @input="inputChange(row, rowIndex, column)"
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
                <template  #slot_edit_input="{
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
        </div>
        <div class="boxflex">
            <div class="filebox">
                <div>
                    <sub-title title="商务标书">
                        <template #beforeIcon>
                            <i :class="formDataShow.bidBusinessFileList ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.bidBusinessFileList = !formDataShow.bidBusinessFileList"></i>
                        </template>
                    </sub-title>
                    <div class="file-list" v-show="formDataShow.bidBusinessFileList">
                        <FilelistList
                            v-bind="$attrs"
                            v-on="$listeners"
                            :readOnly="!editState"
                            :showEditName="false"
                            :file-list="form.bidBusinessFileList"
                            @event:upload="onEventUpload($event, 'bidBusinessFileList')"
                            @event:delete-file="onEventDeleteFile($event, 'bidBusinessFileList')"
                            manual
                        >
                            <template #buttons>
                            <slot name="buttons"></slot>
                            </template>
                            <template #operations="data">
                            <slot name="operations" v-bind="{ ...data }"></slot>
                            </template>
                        </FilelistList>
                    </div>
                </div>
                <div v-if="formData.bidScope != 'tenderBusinessExpert' ">
                    <sub-title title="技术标书 " >
                        <template #beforeIcon>
                            <i :class="formDataShow.bidTechnicalFileList ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.bidTechnicalFileList = !formDataShow.bidTechnicalFileList"></i>
                        </template>
                    </sub-title>
                    <div class="file-list" v-show="formDataShow.bidTechnicalFileList">
                        <FilelistList
                            v-bind="$attrs"
                            v-on="$listeners"
                            :readOnly="!editState"
                            :showEditName="false"
                            :file-list="form.bidTechnicalFileList"
                            @event:upload="onEventUpload($event, 'bidTechnicalFileList')"
                            @event:delete-file="onEventDeleteFile($event, 'bidTechnicalFileList')"
                            manual
                        >
                            <template #buttons>
                            <slot name="buttons"></slot>
                            </template>
                            <template #operations="data">
                            <slot name="operations" v-bind="{ ...data }"></slot>
                            </template>
                        </FilelistList>
                    </div>  
                </div>
                <div>
                    <sub-title title="投标承诺函">
                        <template #beforeIcon>
                            <i :class="formDataShow.bidLetterFileList ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.bidLetterFileList = !formDataShow.bidLetterFileList"></i>
                        </template>
                    </sub-title>
                    <div class="file-list" v-show="formDataShow.bidLetterFileList">
                        <FilelistList
                            v-bind="$attrs"
                            v-on="$listeners"
                            :readOnly="!editState"
                            :showEditName="false"
                            :file-list="form.bidLetterFileList"
                            @event:upload="onEventUpload($event, 'bidLetterFileList')"
                            @event:delete-file="onEventDeleteFile($event, 'bidLetterFileList')"
                            manual
                        >
                            <template #buttons>
                            <slot name="buttons"></slot>
                            </template>
                            <template #operations="data">
                            <slot name="operations" v-bind="{ ...data }"></slot>
                            </template>
                        </FilelistList>
                    </div>  
                </div>


            </div>
            <div class="pricebox">
                <div class="cghj-content" >
                    <p>不含税总额:￥<span>{{form.untaxAmount?(form.untaxAmount).toFixed(2):0}}</span></p>
                    <p>税费:￥<span>{{form.taxAmount?(form.taxAmount).toFixed(2):0}}</span></p>
                    <p>订单总额：￥<span>{{form.amount?(form.amount).toFixed(2):0}}</span></p>
                </div>
            </div>
        </div>

    </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

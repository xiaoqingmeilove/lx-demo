<template>
  <app-page>
    <div class="view-section" style="padding: 10px">
      <sub-title title="基本信息">
        <template #buttons >
         <div v-if="showEdit">
          <page-button v-if="!editState" @click="editForm">修改</page-button>
          <page-button v-if="editState" @click="submit">保存修改</page-button>
          <page-button v-if="editState" @click="cancel">取消</page-button>
          <page-button @click="$tabs.close()">关闭</page-button>
         </div>
        </template>
      </sub-title>
      <data-form
        :items="descItems1"
        :editable="false"
        :form-data="form"
        :source-list="descSourceList"
      ></data-form>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title title="表头配置"></sub-title>
          <div class="app-table-action-layouts" v-if="editState">
            <page-button type="text" @click="onTableActionBtnClick('copy')"
              >复制</page-button
            >
            <page-button type="text" @click="onTableActionBtnClick('reverse')"
              >反选</page-button
            >
            <page-button type="text" @click="onTableActionBtnClick('moveUp')"
              >上移</page-button
            >
            <page-button type="text" @click="onTableActionBtnClick('moveDown')"
              >下移</page-button
            >
            <page-button type="text" @click="onTableActionBtnClick('toTop')"
              >移至顶部</page-button
            >
            <page-button type="text" @click="onTableActionBtnClick('toBottom')"
              >移至底部</page-button
            >
            <page-button type="text" @click="onTableActionBtnClick('delete')"
              >删除</page-button
            >
            <div class="app-table-moveto">
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
              :source-list="tableSourceList"
              button-text="批量填充"
              :disabled="!editState"
              @click="onCombineOptionsOk"
            ></combine-operation>
          </div>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons> </template>
            <template #tools>
              <table-tools
                :default-columns="defaultColumns"
                @ok="onToolOk"
              ></table-tools>
            </template>
            <template #buttons v-if="editState">
              <div class="addLine">
                        <vxe-input
                          v-model="addRowNum"
                          type="integer"
                          size="mini"
                          min="1"
                          class="co-input"
                          :controls="false"
                        >
                          <template #suffix>
                            <page-button @click="addDtailList"
                              >增行</page-button
                            >
                          </template>
                        </vxe-input>
                      </div>
            </template>
          </vxe-toolbar>
        </div>
        <div class="app-table-body">
          <vxe-grid
            :data="tableData"
            :id="`tb_bgpz_detail_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :scroll-y="{ enabled: true }"
            :columns="bindColumns"
            height="auto"
            ref="table"
          >
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
                  :digits="getDigits(column.field)"
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
            <!-- 是否 -->
            <template
              #slot_edit_enable="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-select v-model="row[column.field]" size="small">
                  <el-option
                    v-for="item in tableSourceList.enableList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
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
            <!-- fixed固定方式 -->
            <template #fixed="{ row, rowIndex }">
              <span v-if="editState === false">{{ row.fixed }}</span>
              <div @dblclick.stop v-else>
                <el-select v-model="row.fixed" size="small">
                  <el-option
                    v-for="item in tableSourceList.fixedList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </div>
            </template>
            <!-- 居中方式 -->
            <template #align="{ row, rowIndex }">
              <span v-if="editState === false">{{ row.align }}</span>
              <div @dblclick.stop v-else>
                <el-select v-model="row.align" size="small">
                  <el-option
                    v-for="item in tableSourceList.alignList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </div>
            </template>
            <template #slot_edit_slots="{row, rowIndex }">
              <div class="base-font-color" @click="slotsClick(row.slots,rowIndex)">{{showSlot(row.slots)}}</div>
            </template>
          
        </vxe-grid>
        </div>
      </div>
    </table-section>
    <popup-form
      v-model="slotsFormVisible"
      title="配置插槽"
      :form-data="slotsObj"
      :data-gather="slotsDataGather"
      :data-list="descSourceList"
      :rules="{}"
      :readOnly="!editState"
      @ok="slotsFormOk"
    >
    </popup-form>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

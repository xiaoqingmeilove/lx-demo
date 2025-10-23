<template>
  <div class="popup-table-view">
    <div class="popup-table-view-body">
      <vxe-grid
        :columns="bindColumns"
        :data="tableData"
        height="auto"
        align="center"
        :show-footer="showFooter"
        :footer-method="footerMethod"
        ref="table"
      >
        <template #checkbox="{ row, column }">
          <vxe-checkbox
            class="popup-table--checkbox"
            v-model="row[column.field]"
            :disabled="!editable"
          ></vxe-checkbox>
        </template>
        <template #edit_input="{ row, column, rowIndex }">
          <template v-if="editable && !isReadonly(column)">
            <vxe-input
              v-model="row[column.field]"
              class="popup-table--input"
              ref="tableinput"
              :placeholder="`请输入${column.title}`"
              :align="column.align"
              :disabled="isDisabled(column)"
              size="mini"
              @change="updateFooterEvent"
              @focus="onInputFocus"
            ></vxe-input>
          </template>
          <template v-else>
            <span>{{ row[column.field] }}</span>
          </template>
        </template>
        <template #edit_selectinput="{ row, column, rowIndex }">
          <el-select
            class="popup-table--date"
            v-model="row[column.field]"
            size="small"
            filterable
            :disabled="!(editable && !isReadonly(column))"
          >
            <el-option
              v-for="(opt, optIndex) in dataList[column.params.soure] || []"
              :key="optIndex"
              :value="opt.value"
              :label="opt.label"
            ></el-option>
          </el-select>
        </template>
        <template #edit_datetime="{ row, column, rowIndex }">
          <template v-if="editable && !isReadonly(column)">
            <el-date-picker
              v-model="row[column.field]"
              class="popup-table--date"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
            >
            </el-date-picker>
          </template>
          <template v-else>
            <span>{{ row[column.field] }}</span>
          </template>
        </template>

        <template #edit_textarea="{ row, column, rowIndex }">
          <template v-if="editable && !isReadonly(column)">
            <vxe-textarea
              v-model="row[column.field]"
              :placeholder="`请输入${column.title}`"
              rows="1"
              class="popup-table--input"
              resize="vertical"
              :align="column.align"
              size="mini"
              @change="updateFooterEvent"
              @focus="onInputFocus"
              :disabled="isDisabled(column)"
            ></vxe-textarea>
          </template>
          <template v-else>
            <span>{{ row[column.field] }}</span>
          </template>
        </template>

        <template #edit_number="{ row, column }">
          <template v-if="editable && !isReadonly(column)">
            <vue2-number-input
              v-model="row[column.field]"
              class="popup-table--input"
              type="number"
              :focus-select="clickSelectAll"
              width="100%"
              :digits="bindNumberDigits(column)"
              :align="column.align"
              :controls="false"
              :disabled="isDisabled(column)"
              :placeholder="`请输入${column.title}`"
              @change="updateFooterEvent"
            ></vue2-number-input>
          </template>
          <template v-else>
            <span>{{ binNumberValue(row, column) }}</span>
          </template>
        </template>

        <template #operation="{ row, rowIndex }">
          <page-button theme="danger" @click="onDeleteClick(row, rowIndex)"
            >删除</page-button
          >
        </template>
        </vxe-grid>
    </div>
    <div class="popup-table-view-add" v-if="editable">
      <page-button type="text" icon="vxe-icon-add" @click="onAddBtnClick">{{
        addText
      }}</page-button>
    </div>
    <div class="popup-table-view-footer">
      <page-button @click="onOkClick" v-if="editable">{{ okText }}</page-button>
      <page-button theme="default" @click="onCloseClick">{{
        cancelText
      }}</page-button>
    </div>
  </div>
</template>

<script>
import XEUtils from "xe-utils";

export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    dataList: {
      type: Object,
      default: () => {
        return {};
      },
    },
    editable: {
      type: Boolean,
      default: true,
    },
    okText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    addText: {
      type: String,
      default: "新增",
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    clickSelectAll: {
      type: Boolean,
      default: true,
    },
    deleteBtn: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    bindColumns() {
      const columns = this.columns.map((item) => {
        if (item.columnType === "checkbox") {
          item.slots = item.slots ?? {};
          item.slots.default = "checkbox";
        } else {
          if (item.edit === "number") {
            item.slots = item.slots ?? {};
            item.slots.default = "edit_number";
          } else if (item.edit === "textarea") {
            item.slots = item.slots ?? {};
            item.slots.default = "edit_textarea";
          }else  if (item.edit === "datetime") {
            item.slots = item.slots ?? {};
            item.slots.default = "edit_datetime";
          }else  if (item.edit === "selectinput") {
            item.slots = item.slots ?? {};
            item.slots.default = "edit_selectinput";
          } else {
            item.slots = item.slots ?? {};
            item.slots.default = "edit_input";
          }
        }
        item.params = {
          edit: item.edit,
          digits: item.digits,
          readonly: item.readonly,
          disabled: item.disabled,
          ...item.params,
        };
        return item;
      });
      if (this.editable && this.deleteBtn) {
        columns.push({
          title: "操作",
          width: 120,
          fixed: "right",
          slots: {
            default: "operation",
          },
        });
      }
      return columns;
    },
    bindNumberDigits() {
      return (column) => {
        let { digits } = column.params ?? {};
        digits = [null, undefined].includes(digits) ? 2 : digits;
        digits = digits < 0 ? 0 : digits;
        return digits;
      };
    },
    binNumberValue() {
      return (row, column) => {
        const digits = this.bindNumberDigits(column);
        return this.toFixedNumber(row[column.field], digits);
      };
    },
    isReadonly() {
      return (column) => {
        const { readonly } = column.params ?? {};
        return !!readonly;
      };
    },
    isDisabled() {
      return (column) => {
        const { disabled } = column.params ?? {};
        return !!disabled;
      };
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.tableData = XEUtils.clone(this.data, true);
  },
  methods: {
    close() {
      this.$emit("close");
    },
    onCloseClick() {
      this.close();
    },
    onOkClick() {
      const data = this.tableData.map((item) => {
        delete item._X_ROW_KEY;
        return item;
      });
      this.$emit("ok", data);
    },
    onDeleteClick(row, rowIndex) {
      this.tableData.splice(rowIndex, 1);
    },
    footerMethod() {
      const footerData = this.columns.map((item, index) => {
        if (index === 0) return "合计";
        if (item.sum) {
          return this.sumField(item);
        }
        return "";
      });
      return [footerData];
    },

    toFixedNumber(number, digits) {
      const result = XEUtils.floor(number, digits);
      return XEUtils.toFixed(result, digits);
    },

    sumField(item) {
      console.log("item", item);
      const { field } = item;
      const sum = this.tableData.reduce((total, cur) => {
        total = XEUtils.add(total, Number(cur[field] || 0));
        return total;
      }, 0);
      const digits = this.bindNumberDigits(item);
      return this.toFixedNumber(sum, digits);
    },
    updateFooterEvent() {
      const table = this.$refs.table;
      table.updateFooter();
    },
    onAddBtnClick() {
      this.tableData.push({});
      this.scrollToBottom();
    },
    scrollToBottom() {
      const table = this.$refs.table;
      const bodies = table.$el.querySelectorAll(".vxe-table--body-wrapper");
      for (let i = 0; i < bodies.length; i++) {
        const el = bodies[i];
        setTimeout(() => {
          el.scrollTop = el.scrollHeight;
        }, 0);
      }
    },
    onInputFocus({ $event }) {
      if (this.clickSelectAll) {
        const { target } = $event;
        target.select();
      }
    },
  },
};
</script>

<style lang="less">
.popup-table-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  .popup-table-view-body {
    // flex: 1;
    // height: 0;
    height: 400px;
    padding: 20px;
    .vxe-header--column {
      text-align: center !important;
    }
  }
  .popup-table-view-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 25px;
    height: 72px;
    > button {
      padding: 0 10px;
    }
  }

  .popup-table-view-add {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    > button {
      font-size: 16px;
    }
  }

  .popup-table--checkbox {
    .vxe-checkbox--label {
      display: none;
    }
  }

  .vxe-cell .vxe-input > .vxe-input--inner {
    padding: 0 6px;
  }
  .vxe-textarea--inner {
    height: 28px;
    min-height: 28px;
  }

  .popup-table--input {
    font-size: 14px;
  }
  .popup-table--date {
    width: 100%;
  }
}
</style>

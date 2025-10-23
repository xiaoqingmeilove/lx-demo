<template>
  <div
    class="data-form-container"
    :class="[size ? `data-form-size-${size}` : '']"
  >
    <el-form
      class="data-form"
      :label-width="labelWidth"
      :label-position="labelPosition"
      label-suffix=":"
      :rules="rules"
      :model="formData"
      ref="form"
    >
      <el-form-item
        v-for="(item, index) in items"
        :key="index"
        class="data-form-item"
        :class="[itemClassName(item), bindItemClass(item)]"
        :style="itemStyle(item)"
        :prop="item.field"
      >
        <template #label> {{ item.label }}: </template>

        <template v-if="item.slot">
          <slot
            :name="item.slot"
            v-bind="{
              value: formData[item.field],
              item,
              model: formData,
            }"
          ></slot>
        </template>
        <template v-else>
          <template v-if="editable && item.readOnly !== true">
            <!-- 输入框 -->
            <!--  onfocus="this.select();" -->
            <template v-if="item.type === 'input'">
              <el-input
                v-model="formData[item.field]"
                class="data-form--input"
                v-bind="item.props"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :disabled="item.disabled"
                :maxlength="item.maxlength || null"
                @input="onItemValueChange($event, item, 'input')"
                @focus="onInputFocus($event, item)"
                @blur="onInputBlur($event, item)"
              ></el-input>
            </template>

            <!-- 数字输入框 -->
            <!-- <template v-else-if="item.type === 'number'">
              <el-input v-model="formData[item.field]"
                class="data-form--input"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :maxlength="item.maxlength || null"
                @input="onItemValueChange($event, item, 'input')"
                @blur="onInputBlur($event, item)"
              ></el-input>
            </template> -->

            <!-- 数字输入框 -->
            <template v-else-if="item.type === 'number'">
              <vue2-number-input
                v-model="formData[item.field]"
                class="data-form--number"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :digits="item.digits"
                :focus-select="clickSelectAll"
                @input="onItemValueChange($event, item, 'input')"
                @focus="onNumberFocus($event, item)"
                @blur="onNumberBlur($event, item)"
                v-bind="item.props"
              >
              </vue2-number-input>
            </template>
            <template v-else-if="item.type === 'pca'">
              <pca
                v-model="formData[item.field]"
                data-type="string"
                placeholder="请选择区域"
                :check-strictly="false"
              ></pca>
            </template>

            <!-- 文本域 -->
            <!-- onfocus="this.select();" -->
            <template v-else-if="item.type === 'textarea'">
              <el-input
                v-model="formData[item.field]"
                class="data-form--textarea"
                type="textarea"
                :rows="item.rows||1"
                :disabled="item.disabled"
                :placeholder="item.placeholder|| `请输入${item.label}`"
                @input="onItemValueChange($event, item, 'input')"
                v-bind="item.props"
              >
              </el-input>
            </template>
            <template v-else-if="item.type === 'maxtextarea'">
              <el-input
                v-model="formData[item.field]"
                onfocus="this.select();"
                class="data-form--textarea"
                type="textarea"
                :disabled="item.disabled"
                @focus="onMaxTextareaFocus(formData[item.field], item)"
                @input="onItemValueChange($event, item, 'input')"
                v-bind="item.props"
              >
              </el-input>
            </template>

            <!-- 日期选择器 -->
            <template v-else-if="item.type === 'date'">
              <el-date-picker
                v-model="formData[item.field]"
                class="data-form--datepicker"
                type="date"
                :placeholder="item.placeholder||'请选择'"
                :disabled="item.disabled"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="onItemValueChange($event, item, 'date')"
                v-bind="item.props"
              >
              </el-date-picker>
            </template>

            <!-- 日期时间选择器 -->
            <template v-else-if="item.type === 'datetime'">
              <el-date-picker
                v-model="formData[item.field]"
                class="data-form--datepicker"
                type="datetime"
                :placeholder="item.placeholder"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="item.disabled"
                @change="onItemValueChange($event, item, 'datetime')"
                v-bind="item.props"
              >
              </el-date-picker>
            </template>

            <!-- 日期范围选择器 -->
            <template v-else-if="item.type === 'daterange'">
              <el-date-picker
                v-model="formData[item.field]"
                class="data-form--datepicker"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :disabled="item.disabled"
                v-bind="item.props"
              >
              </el-date-picker>
            </template>

            <!-- 下拉选择框 -->
            <template v-else-if="item.type === 'select'">
              <el-select
                v-model="formData[item.field]"
                class="data-form--select"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                clearable
                @change="onSelectValueChange($event, item, 'select')"
                @visible-change="onSelectVisibleChange($event, item)"
                @clear="onSelectValueClear($event, item, 'select')"
              >
                <el-option
                  v-for="opt in sourceList[item.source] || []"
                  :key="opt.value"
                  :value="bindOptionValue(opt, item)"
                  :label="opt.label"
                ></el-option>
              </el-select>
            </template>

            <!-- 下拉选择框多选 -->
            <template v-else-if="item.type === 'selectmulti'">
              <el-select
                v-model="formData[item.field]"
                class="data-form--select"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                multiple
                clearable
                @change="onSelectValueChange($event, item, 'select')"
                @visible-change="onSelectVisibleChange($event, item)"
              >
                <el-option
                  v-for="sourceItem in sourceList[item.source] || []"
                  :key="sourceItem.value"
                  :value="sourceItem.value"
                  :label="sourceItem.label"
                ></el-option>
              </el-select>
            </template>

            <!-- 可搜索下拉选择 -->
            <template v-else-if="item.type === 'selectinput'">
              <el-select
                v-model="formData[item.field]"
                class="data-form--select"
                :placeholder="item.placeholder"
                filterable
                :disabled="item.disabled"
                clearable
                v-bind="item.props"
                @change="onSelectValueChange($event, item, 'select')"
                @visible-change="onSelectVisibleChange($event, item)"
              >
                <el-option
                  v-for="sourceItem in sourceList[item.source] || []"
                  :key="sourceItem.value"
                  :value="sourceItem.value"
                  :label="sourceItem.label"
                ></el-option>
              </el-select>
            </template>

            <!-- 可搜索下拉选择多选 -->
            <template v-else-if="item.type === 'selectinputmulti'">
              <el-select
                v-model="formData[item.field]"
                class="data-form--select"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                multiple
                filterable
                clearable
                v-bind="item.props"
                @change="onSelectValueChange($event, item, 'select')"
                @visible-change="onSelectVisibleChange($event, item)"
              >
                <el-option
                  v-for="sourceItem in sourceList[item.source] || []"
                  :key="sourceItem.value"
                  :value="sourceItem.value"
                  :label="sourceItem.label"
                ></el-option>
              </el-select>
            </template>

            <!-- 可搜索下拉选择2 -->
            <template v-else-if="item.type === 'selectinput2'">
              <el-select
                v-model="formData[item.field]"
                class="data-form--select"
                :placeholder="item.placeholder"
                filterable
                :disabled="item.disabled"
                clearable
                allow-create
                :filter-method="
                  (value) => selectInputFilterMethod2(value, item)
                "
                v-bind="item.props"
                @change="onSelectValueChange($event, item, 'select')"
                @visible-change="onSelectVisibleChange($event, item)"
              >
                <el-option
                  v-for="sourceItem in bindSelectInput2Options(item)"
                  :key="sourceItem.value"
                  :value="sourceItem.value"
                  :label="sourceItem.label"
                ></el-option>
              </el-select>
            </template>

            <!-- 单选框 -->
            <template v-else-if="item.type === 'radio'">
              <el-radio-group
                v-model="formData[item.field]"
                class="data-form--radio"
                :disabled="item.disabled"
                @change="onItemValueChange($event, item, 'radio')"
              >
                <el-radio
                  v-for="opt in sourceList[item.source] || []"
                  :key="opt.value"
                  :label="bindOptionValue(opt, item)"
                  >{{ opt.label }}</el-radio
                >
              </el-radio-group>
            </template>
            <template v-else-if="item.type === 'radioButton'">
              <el-radio-group
                v-model="formData[item.field]"
                class="data-form--radio"
                :disabled="item.disabled"
                :size="item.small || 'small'"
                @change="onItemValueChange($event, item, 'radio')"
              >
                <el-radio-button
                  v-for="opt in sourceList[item.source] || []"
                  :key="opt.value"
                  :label="bindOptionValue(opt, item)"
                  >{{ opt.label }}</el-radio-button
                >
              </el-radio-group>
            </template>

            <!-- autocomplete -->
            <template v-else-if="item.type === 'autocomplete'">
              <el-autocomplete
                class="data-form--autocomplete"
                v-model="formData[item.field]"
                :fetch-suggestions="
                  (queryString, cb) => {
                    querySuggestions(queryString, cb, item);
                  }
                "
                :placeholder="item.placeholder"
                @select=""
              ></el-autocomplete>
            </template>

            <template v-else>
              <div class="data-form--content">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="`${bindItemValue(item)}`"
                  placement="top-start"
                >
                  <span class="data-form--value">{{
                    bindItemValue(item)
                  }}</span>
                </el-tooltip>
              </div>
              <span
                class="data-form--content-suffix"
                v-if="bindSuffixContent(item)"
                >{{ bindSuffixContent(item) }}</span
              >
            </template>
          </template>
          <template v-else>
            <div class="data-form--content">
              <el-tooltip
                class="item"
                effect="dark"
                :content="`${bindItemValue(item)}`"
                placement="top-start"
                v-if="showTool"
              >
                <span class="data-form--value">{{ bindItemValue(item) }}</span>
              </el-tooltip>
              <span v-else class="data-form--value">{{
                bindItemValue(item)
              }}</span>
            </div>
            <span
              class="data-form--content-suffix"
              v-if="bindSuffixContent(item)"
              >{{ bindSuffixContent(item) }}</span
            >
          </template>
        </template>
      </el-form-item>
    </el-form>
    <vxe-modal
      v-model="maxTextObj.visibleModal"
      :title="maxTextObj.modalTitle"
      resize
    >
      <template #default>
        <div
          v-if="showAreaInfo(maxTextObj)"
          v-html="showAreaInfo(maxTextObj)"
        ></div>
        <el-input
          type="textarea"
          :rows="10"
          v-model="maxTextObj.textvalue"
          v-focus
        ></el-input>
        <div class="view-footer">
          <page-button @click="maxTextOk">确定</page-button>
          <page-button @click="maxTextCancel">取消</page-button>
        </div>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import XEUtils from "xe-utils";
import moment from "moment";

let cache_select_values = {};

function debounce(fn, duration = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, duration);
  };
}

export default {
  name: "dataForm",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    sourceList: {
      type: Object,
      default: () => ({}),
    },
    editable: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
      default: "120px",
    },
    labelPosition: {
      type: String,
      default: "right",
    },
    valueFormatters: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    itemWidth: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: "small",
    },
    showTool: {
      type: Boolean,
      default: true,
    },
    clickSelectAll: {
      type: Boolean,
      default: true,
    },
    formSize: {
      type: String,
      default: "small",
    },
  },
  computed: {
    bindItemValue() {
      return (item) => {
        const fn = this.formatters[item.formatterName];
        const value = this.formData[item.field];
        if (fn && typeof fn === "function") {
          return fn(value, item);
        }
        if (item.type === "select" || item.type === "radio" ||  item.type === "radioButton") {
          const sourceList = this.sourceList[item.source] ?? [];
          const find = sourceList.find((x) => x.value == value);
          if (find) {
            return find.label;
          }
        } else if (item.type === "selectmulti") {
          const sourceList = this.sourceList[item.source] ?? [];
          return (value || [])
            .map((i) => {
              const find = sourceList.find((x) => x.value === i);
              return find?.label;
            })
            .join(",");
        } else if (item.type === "selectinput") {
          const sourceList = this.sourceList[item.source] ?? [];
          const find = sourceList.find((x) => x.value === value);
          return find ? find?.label : value;
        } else if (item.type === "selectinputmulti") {
          const sourceList = this.sourceList[item.source] ?? [];
          return (value || [])
            .map((i) => {
              const find = sourceList.find((x) => x.value === i);
              return find ? find?.label : i;
            })
            .join(",");
        } else if (item.type === "selectinput2") {
          const sourceList = this.sourceList[item.source] ?? [];
          const find = sourceList.find((x) => x.value === value);
          return find ? find?.label : value;
        } if (item.type === "pca") {
          return this.formData[item.fieldName] ?? "";
        }
        return value;
      };
    },
    itemClassName() {
      return (item) => {
        return {
          "data-form-item-edit":
            this.editable &&
            (!!item.type || !!item.slot) &&
            item.readOnly !== true,
          "data-form-item-blank": item.isBlank,
        };
      };
    },
    bindItemClass() {
      return (item) => {
        if (typeof item.itemClass === "function") {
          return item.itemClass({
            item,
            data: this.formData,
          });
        }
        if (item.hasOwnProperty("itemClass")) {
          return item.itemClass ?? "";
        }
        return "";
      };
    },
    itemStyle() {
      return (item) => {
        let style = {};
        style.width = this.itemWidth || item.width || "25%";
        if (typeof item.itemStyle === "function") {
          style = {
            ...style,
            ...item.itemStyle({ item, data: this.formData }),
          };
        }
        return style;
      };
    },
    bindSelectInput2Options() {
      return (item) => {
        const sourceList = this.sourceList[item.source] ?? [];
        const val = this.formData[item.field];
        if (val) {
          return sourceList.filter(
            (item) =>
              !!val &&
              ((item.value || "").indexOf(val) > -1 ||
                (item.labelss || "").indexOf(val) > -1)
          );
        }
        return sourceList;
      };
    },
    bindOptionValue() {
      return (opt, item) => {
        if (item.valueType === "number") {
          return Number(opt.value);
        } else if (item.valueType === "string") {
          return String(opt.value);
        }
        return opt.value;
      };
    },
    bindSuffixContent() {
      return (item) => {
        return item.props?.suffix;
      };
    },
    showAreaInfo() {
      return (item) => {
        let code = item.textitem?.infoCode ?? false;
        let obj = (this.dict["sys_config"] ?? []).find(
          (x) => x.dictValue == code
        );
        return obj ? obj.dictLabel : null;
      };
    },
  },
  mounted() {},
  watch: {
    editable(val) {
      if (!val) {
        this.clearValidate();
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      dict,
      maxTextObj: {
        textitem: {},
        textvalue: null,
        modalTitle: null,
        visibleModal: false,
      },
      formatters: {
        toFixedNumber: (value, item) => {
          value = Number(value || 0);
          const digits = item.digits || 2;
          value = XEUtils.floor(value, digits);
          return XEUtils.toFixed(value, digits);
        },
      },
      emitDebounce: debounce(this.emitData),
      timeout: null,
    };
  },
  created() {
    this.formatters = {
      ...this.formatters,
      ...this.valueFormatters,
    };
  },
  methods: {
    moment,
    maxTextOk() {
      this.formData[this.maxTextObj.textitem.field] = this.maxTextObj.textvalue;
      this.maxTextObj.visibleModal = false;
      this.maxTextObj.textvalue = null;
    },
    maxTextCancel() {
      this.maxTextObj.visibleModal = false;
      this.maxTextObj.textvalue = null;
    },
    onMaxTextareaFocus(value, item) {
      this.maxTextObj = {
        ...this.maxTextObj,
        textvalue: value,
        modalTitle: item.label,
        visibleModal: true,
        textitem: { ...item },
      };
    },
    onNumberInputInput(value, item) {
      value = value || "";
      value = value
        .replace(/[^-0-9.]/g, "")
        .replace(/(\..*)\./g, "$1")
        //.replace(/(\..{3})./g, '$1')
        .replace(/-/g, (_v, _i) => (_i === 0 ? _v : ""));
      const { precision } = item;
      if (precision) {
        const regex = new RegExp(`(\\..{${precision}}).`, "g");
        value = value.replace(regex, "$1");
      }
      this.formData[item.field] = value;
    },

    valueHandles() {
      return {
        number: (value, item) => {
          value = value || "";
          value = value
            .replace(/[^-0-9.]/g, "")
            .replace(/(\..*)\./g, "$1")
            //.replace(/(\..{3})./g, '$1')
            .replace(/-/g, (_v, _i) => (_i === 0 ? _v : ""));
          const { precision } = item;
          if (precision) {
            const regex = new RegExp(`(\\..{${precision}}).`, "g");
            value = value.replace(regex, "$1");
          }
          this.formData[item.field] = value;
          return value;
        },
      };
    },

    onItemValueChange(value, item, event) {
      const { type } = item;
      const handle = this.valueHandles()[type];
      if (handle) {
        value = handle(value, item);
      }
      this.$refs.form.validateField(item.field);
      this.$emit(`change:${event}`, {
        value,
        item,
      });
    },

    onInputFocus($event, item) {
      const { target } = $event;
      if (this.clickSelectAll) {
        target.select();
      }
      this.$emit("focus:input", {
        $event,
        value: target.value,
        item,
      });
    },
    onInputBlur($event, item) {
      const { value } = $event.target;
      this.$emit("blur:input", {
        value,
        item,
      });
    },

    onNumberFocus($event, item) {
      this.$emit("focus:input", {
        value: this.formData[item.field],
        item,
      });
    },
    onNumberBlur(value, item) {
      this.$emit("blur:input", {
        value,
        item,
      });
    },

    onInputNumberChange(e, item) {
      const { value, $event } = e;
      if ($event.type === "init") return;
      this.$emit("change:input", {
        value,
        item,
      });
    },
    onInputNumberBlur($event, item) {
      const { value } = $event;
      this.$emit("blur:input", {
        value,
        item,
      });
    },

    emitData(eventName, events) {
      this.$emit(eventName, events);
    },

    onSelectValueChange(value, item) {
      const { type, linkageField } = item;
      const handle = this.valueHandles()[type];
      if (handle) {
        value = handle(value, item);
      }
      if (linkageField) {
        const list = this.sourceList[item.source] ?? [];
        const label = list.find((x) => x.value == value)?.label ?? "";
        this.formData[linkageField] = label;
      }

      this.$refs.form.validateField(item.field);
      this.emitDebounce("change:select", {
        value,
        item,
      });
    },
    onSelectVisibleChange(visible, item) {
      const value = this.formData[item.field];
      if (!visible) {
        if (cache_select_values[item.field] !== value) {
          // this.$emit("hidden:select", {
          //   value,
          //   item
          // })
          this.emitDebounce("hidden:select", {
            value,
            item,
          });
        }
        cache_select_values[item.field] = value;
      }
    },
    onSelectValueClear($event, item, event) {
      // this.$emit(`clear:${event}`, {
      //   value: undefined,
      //   item,
      // })
      this.emitDebounce(`clear:${event}`, {
        value: undefined,
        item,
      });
    },

    validate(callback) {
      this.$refs.form.validate((valid) => {
        typeof callback === "function" && callback(valid);
      });
    },
    clearValidate(){
      this.$refs.form.clearValidate();
    },

    validateField(field, callback) {
      this.$refs.form.validateField(field, (valid) => {
        typeof callback === "function" && callback(valid);
      });
    },

    selectInputFilterMethod2(value, item) {
      this.formData[item.field] = value;
      this.$emit("filter:selectinput", {
        value,
        item,
      });
    },

    querySuggestions(queryString, cb, item) {
      const list = (this.sourceList[item.source] || []).map((item) => {
        return {
          value: item.label,
          data: item.value,
        };
      });
      const results = queryString
        ? list.filter((item) => item.value.toString().indexOf(queryString) > -1)
        : list;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 30);
    },
  },
};
</script>

<style lang="less">
.data-form-container {
  background: #fff;
  padding: 10px;
  .data-form {
    display: flex;
    flex-wrap: wrap;
    .data-form-item {
      display: flex;
      align-items: center;
      float: left;
      width: 25%;
      min-height: 42px;
      margin-bottom: 18px;
      // border: 1px solid #eee;
    }
    .el-input {
      .el-input__icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .el-input__validateIcon {
      display: none !important;
    }
  }
  .data-form::after {
    display: block;
    content: "";
    clear: both;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
    flex: 1;
    width: 0;
    height: 100%;
    margin-left: 0 !important;
    // border-bottom: solid 1px #cadde8;
    transition: border 0.3s;
    color: #595959;
    // border-color: #ffff;
  }

  .el-form-item__label {
    position: relative;
    padding: 0 6px;
    margin-left: 3px;
    line-height: 19px;
    color: #595959;
    font-weight: normal;
  }
  .color---red {
    .el-form-item__label {
      color: red !important;
    }
  }
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before {
    // position: absolute;
    // left: 0;
    // top: 0;
    // bottom: 0;
    // margin: auto;
    // width: 7px;
    // height: 7px;
    // line-height: 14px;
  }

  .data-form--value {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    line-height: 19px;
    padding: 0 8px;
  }
  input[aria-hidden="true"] {
    display: none !important;
  }
  .el-radio:focus:not(.is-focus):not(:active):not(is-disabled) .el-radio_inner {
    box-shadow: none !important;
  }

  .data-form--input {
    > input {
      padding: 0 6px;
      // border: none;
    }
  }
  .data-form--number {
    width: 100% !important;
    height: 40px;
    // border: none;
    > input {
      padding: 0 6px;
      // border: none !important;
    }
  }
  .data-form--datepicker {
    width: 100%;
    height: 40px;
    > input {
      padding: 0 6px;
      // border: none !important;
    }
    .el-input__prefix {
      left: auto;
      right: 5px;
    }
    .el-input__suffix {
      right: 25px;
    }
    .el-textarea__inner {
      min-height: 40px !important;
      color: #595959;
    }
    .el-range__icon,
    .el-range-separator,
    .el-range__close-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .data-form--select {
    width: 100%;
    min-height: 40px;
    .el-input {
      > input {
        padding: 0 6px;
        // border: none !important;
      }
    }
  }
  .data-form--textarea {
    margin-bottom: 2px;
  }

  .data-form-item-edit {
    .el-form-item__content {
      // border-bottom: solid 1px #87bcd2;
      // border-bottom: solid 1px var(--form-item-edit-color);
    }
  }

  .data-form--radio {
    margin-right: auto;
  }

  .data-form--autocomplete {
    width: 100%;
    height: 40px;
    .el-input {
      height: 100%;
    }
    .el-input__inner {
      height: 100%;
      line-height: 28px;
      // border: none;
      padding: 0 6px;
    }
  }

  .pca-cascader {
    .el-input__inner {
      // border: none;
    }
  }
  .pca-select {
    .el-input__inner {
      // border: none;
    }
  }
  .pca-input {
    .el-input__inner {
      // border: none;
    }
  }
}
.data-form-size-small {
  .el-form-item__content {
    line-height: 28px;
  }
  .el-input__suffix {
    display: flex;
    align-items: center;
  }
  .data-form {
    .data-form-item {
      min-height: 36px;
      margin-bottom: 8px;
      // padding: 0 18px;
    }
    .data-form-item.is-error {
      margin-bottom: 16px;
    }
  }
  .data-form--input {
    .el-input__inner {
      height: 40px;
    }
  }
  .data-form--datepicker {
    height: 40px;
    .el-input__inner {
      height: 40px;
    }
  }
  .data-form--select {
    min-height: 28px;
    .el-input {
      min-height: 28px;
    }
    .el-input__inner {
      min-height: 28px;
    }
  }
  .data-form--textarea {
    min-height: 40px !important;
    .el-textarea__inner {
      padding: 4px 12px;
      line-height: 19px;
      min-height: 40px !important;
      // border: none;
    }
  }

  .data-form-item-blank {
    > label,
    > div {
      display: none;
    }
  }

  .data-form--content {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    width: 0;
    height: 100%;
  }
  .data-form--content-suffix {
    padding: 0 6px;
    color: #a3a3a3;
    font-size: 14px;
  }
}
.view-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 25px;
  height: 60px;
  > button {
    padding: 0 10px;
  }
  .info-detail {
    margin: 10px;
  }
}
</style>

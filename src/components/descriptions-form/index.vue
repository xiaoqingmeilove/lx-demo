<template>
  <div
    class="descriptions-form"
    :class="[
      showOverflow ? 'descriptions-form-showoverflow' : '',
      editable ? 'descriptions-form--edit' : '',
    ]"
  >
    <el-descriptions
      border
      :column="column"
      :labelStyle="{ width: '160px', background: `${lebalBackground}` }"
    >
      <el-descriptions-item
        v-for="(item, index) in items"
        :key="index"
        :span="item.span || 1"
        :labelClassName="bindItemLabelClassName(item)"
        :contentClassName="bindItemContentClassName(item)"
      >
        <template v-if="item.visible !== false">
          <template slot="label">
            <label class="desc-item-label" :class="labelClass(item)">{{
              item.label
            }}</label>
          </template>
          <div
            class="descriptions-form-content"
            :style="bindContentStyle(item)"
          >
            <template v-if="item.slot">
              <slot
                :name="item.slot"
                v-bind="{ value: itemModel[item.field], item }"
              ></slot>
            </template>
            <template v-else>
              <template v-if="editable">
                <template v-if="item.type === 'input'">
                  <el-input
                    v-model="itemModel[item.field]"
                    size="small"
                    class="desc-item--input"
                    @input="onItemValueChange($event, item, 'input')"
                    @blur="onInputBlur($event, item)"
                  ></el-input>
                </template>
                <template v-else-if="item.type === 'number'">
                  <vxe-input
                    :type="item.numberType || 'number'"
                    class="desc-item--input"
                    :digits="item.digits"
                    v-model="itemModel[item.field]"
                    :controls="false"
                    size="small"
                    @change="onInputNumberChange($event, item)"
                    @blur="onInputNumberBlur($event, item)"
                  >
                  </vxe-input>
                </template>
                <template v-else-if="item.type === 'textarea'">
                  <el-input
                    type="textarea"
                    :rows="1"
                    v-model="itemModel[item.field]"
                    @input="onItemValueChange($event, item, 'input')"
                  >
                  </el-input>
                </template>
                <template v-else-if="item.type === 'select'">
                  <el-select
                    v-model="itemModel[item.field]"
                    size="small"
                    class="desc-item--select"
                    clearable
                    @change="onItemValueChange($event, item, 'select')"
                  >
                    <el-option
                      v-for="sourceItem in sourceList[item.source] || []"
                      :key="sourceItem.value"
                      :value="sourceItem.value"
                      :label="sourceItem.label"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="item.type === 'selectmulti'">
                  <el-select
                    v-model="itemModel[item.field]"
                    size="small"
                    class="desc-item--select"
                    multiple
                    clearable
                    @change="onItemValueChange($event, item, 'select')"
                  >
                    <el-option
                      v-for="sourceItem in sourceList[item.source] || []"
                      :key="sourceItem.value"
                      :value="sourceItem.value"
                      :label="sourceItem.label"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="item.type === 'selectinput'">
                  <el-select
                    v-model="itemModel[item.field]"
                    size="small"
                    class="desc-item--select"
                    filterable
                    allow-create
                    clearable
                    @change="onItemValueChange($event, item, 'select')"
                  >
                    <el-option
                      v-for="sourceItem in sourceList[item.source] || []"
                      :key="sourceItem.value"
                      :value="sourceItem.value"
                      :label="sourceItem.label"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="item.type === 'selectinputmulti'">
                  <el-select
                    v-model="itemModel[item.field]"
                    size="small"
                    class="desc-item--select"
                    multiple
                    filterable
                    allow-create
                    clearable
                    @change="onItemValueChange($event, item, 'select')"
                  >
                    <el-option
                      v-for="sourceItem in sourceList[item.source] || []"
                      :key="sourceItem.value"
                      :value="sourceItem.value"
                      :label="sourceItem.label"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="item.type === 'date'">
                  <el-date-picker
                    v-model="itemModel[item.field]"
                    type="date"
                    placeholder="日期"
                    size="small"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    class="desc-item--datepicker"
                    @change="onItemValueChange($event, item, 'date')"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="item.type === 'datetime'">
                  <el-date-picker
                    v-model="itemModel[item.field]"
                    type="datetime"
                    placeholder="时间"
                    size="small"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    class="desc-item--datepicker"
                    @change="onItemValueChange($event, item, 'datetime')"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="item.type === 'radio'">
                  <el-radio-group
                    v-model="itemModel[item.field]"
                    class="desc-item--radio"
                    @change="onItemValueChange($event, item, 'radio')"
                  >
                    <el-radio
                      v-for="sourceItem in sourceList[item.source] || []"
                      :key="sourceItem.value"
                      :label="sourceItem.value"
                      >{{ sourceItem.label }}</el-radio
                    >
                  </el-radio-group>
                </template>
                <template v-else>
                  {{ bindItemValue(item) }}
                </template>
              </template>
              <template v-else>
                <span :title="bindItemValue(item)">{{ bindItemValue(item) }}</span>
              </template>
            </template>
          </div>
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import XEUtils from "xe-utils";

export default {
  name: "descriptionsForm",
  model: {
    prop: "itemModel",
    event: "change",
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    itemModel: {
      type: Object,
      default: () => ({}),
    },
    autoSize: {
      type: Boolean,
      default: false,
    },
    lebalBackground: {
      type: String,
      default: "#FAFAFA",
    },
    showOverflow: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Number,
      default: 4,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    valueFormatters: {
      type: Object,
      default: () => ({}),
    },
    sourceList: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    labelClass() {
      return (item) => {
        const classList = [];
        const rules = this.rules[item.field] ?? [];
        const isRequired = rules.some((x) => x.required);
        if (item.required || isRequired) {
          classList.push("desc-item--required");
        }
        return classList.join(" ");
      };
    },

    bindContentStyle(item) {
      return (item) => {
        const style = {};
        if (!this.autoSize) {
          style.width = `${
            (this.containerWidth / this.column) * (item.span || 1) - 160
          }px`;
        }
        return style;
      };
    },
    bindItemLabelClassName() {
      return (item) => {
        return item.visible === false
          ? "descriptions-form-item--hidden label-border--hidden"
          : "";
      };
    },
    bindItemContentClassName() {
      return (item) => {
        return item.visible === false ? "descriptions-form-item--hidden" : "";
      };
    },
    bindItemValue() {
      return (item) => {
        const fn = this.formatters[item.formatterName];
        const value = this.itemModel[item.field];
        if (fn && typeof fn === "function") {
          return fn(value, item);
        }
        if (item.type === "select" || item.type === "radio") {
          const sourceList = this.sourceList[item.source] ?? [];
          const find = sourceList.find((x) => x.value === value);
          if (find) {
            return find.label;
          }
        } else if (item.type === "selectmulti") {
          const sourceList = this.sourceList[item.source] ?? [];
          return value
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
          return value
            .map((i) => {
              const find = sourceList.find((x) => x.value === i);
              return find ? find?.label : i;
            })
            .join(",");
        }
        return value;
      };
    },
  },
  data() {
    return {
      containerWidth: 0,

      formatters: {
        toFixedNumber: (value, item) => {
          value = Number(value || 0);
          const digits = item.digits || 2;
          return XEUtils.toFixed(value, digits);
        },
      },
    };
  },
  created() {
    this.formatters = {
      ...this.formatters,
      ...this.valueFormatters,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.containerWidth = this.$children[0].$el.clientWidth;
    });
  },
  methods: {
    onItemValueChange(value, item, event) {
      this.$emit(`change:${event}`, {
        value,
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

    validate(callback) {
      let valid = true;
      let errorObj = {};
      const keys = Object.keys(this.rules);
      for (const key of keys) {
        const value = this.itemModel[key];
        const rules = this.rules[key];
        for (let rule of rules) {
          if (rule.required && [undefined, null, ""].includes(value)) {
            valid = false;
            errorObj = {
              rule,
              value,
            };
            this.$message.error(rule.message);
            break;
          }
          if (typeof rule.validator === "function") {
            let validResult = rule.validator(rule, value);
            if (validResult === false) {
              valid = false;
              this.$message.error(rule.message);
              break;
            }
          }
        }
        if (!valid) break;
      }
      typeof callback === "function" && callback(valid);
    },
  },
};
</script>

<style lang="less">
.descriptions-form {
  .el-descriptions-item__label {
    vertical-align: baseline;
  }
  .el-descriptions-item__content{
    line-height: 46px;
    .descriptions-form-content{
      overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    }
  }

  .el-descriptions
    .is-bordered
    .el-descriptions-item__cell.el-descriptions-item__content {
    padding: 0;
  }

  .el-descriptions .is-bordered .el-descriptions-item__cell {
    padding: 12px 10px;
  }

  .descriptions-form-content {
    display: block;
    padding: 6px 10px;
  }

  .descriptions-form-item--hidden {
    visibility: hidden;
  }

  .label-border--hidden {
    border-right: solid 1px transparent !important;
  }

  .desc-item-label {
    padding-left: 10px;
    position: relative;
  }
  .desc-item-label.desc-item--required::before {
    display: block;
    position: absolute;
    content: "*";
    color: red;
    width: 10px;
    text-align: center;
    line-height: inherit;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}

.descriptions-form-showoverflow {
  .descriptions-form-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.descriptions-form--edit {
  .desc-item--input,
  .desc-item--select,
  .el-date-editor {
    width: 100%;
  }

  .desc-item--textarea {
    .vxe-textarea--inner {
      max-width: 100%;
    }
  }
}
</style>

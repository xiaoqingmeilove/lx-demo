<template>
  <div class="popup-form-view">
    <slot name="header"></slot>
    <div class="popup-form-view-body">
      <vxe-form
        :data="formModel"
        :rules="rules"
        :span="span"
        :title-width="titleWidth"
        :title-align="titleAlign"
        :title-colon="titleColon"
        ref="form"
      >
        <template v-for="gatherItem in dataGather">
          <vxe-form-gather span="24">
            <vxe-form-item
              v-if="gatherItem.title"
              class-name="popup-form-gather-title"
            >
              <template #default>
                <sub-title :title="gatherItem.title"></sub-title>
              </template>
            </vxe-form-item>
            <template v-for="(item, index) in gatherItem.config">
              <template v-if="item.slot && $scopedSlots[item.slot]">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <slot
                      :name="item.slot"
                      v-bind="{ item, index, data: formModel }"
                    ></slot>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'text'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <div class="popup-form--span">
                      <span>{{ bindContent(item, gatherItem) }}</span>
                    </div>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'input'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span
                          >{{ formModel[item.field]
                          }}{{ item.inputSuffix }}</span
                        >
                      </div>
                    </template>
                    <template v-else>
                      <vxe-input
                        class="popup-form--input"
                        v-model="formModel[item.field]"
                        :placeholder="item.placeholder||`请输入${item.label}`"
                        v-bind="item.props"
                      >
                      <!-- v-bind="item.props" 用于做浏览器缓存 -->
                        <template #suffix v-if="item.inputSuffix">{{
                          item.inputSuffix
                        }}</template>
                      </vxe-input>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'password'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>******</span>
                      </div>
                    </template>
                    <template v-else>
                      <vxe-input
                        class="popup-form--input"
                        v-model="formModel[item.field]"
                        type="password"
                        autocomplete="off"
                        :placeholder="`请输入${item.label}`"
                        v-bind="item.props"
                      ></vxe-input>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'number'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span
                          >{{ formModel[item.field]
                          }}{{ item.inputSuffix }}</span
                        >
                      </div>
                    </template>
                    <template v-else>
                      <vxe-input
                        class="popup-form--input"
                        v-model="formModel[item.field]"
                        type="number"
                        :controls="false"
                        :placeholder="`请输入${item.label}`"
                        v-bind="item.props"
                      >
                        <template #suffix v-if="item.inputSuffix">{{
                          item.inputSuffix
                        }}</template>
                      </vxe-input>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'inputnumber'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ formModel[item.field] }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <el-input-number
                        v-model="formModel[item.field]"
                        class="popup-form--inputnumber"
                        controls-position="right"
                        size="small"
                        :min="0"
                        v-bind="item.props"
                      ></el-input-number>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'textarea'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ formModel[item.field] }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="popup-form-wrapper">
                        <div class="popup-form-wrapper-main">
                          <vxe-textarea
                            class="popup-form--textarea"
                            v-model="formModel[item.field]"
                            rows="4"
                            :placeholder="`请输入${item.label}`"
                          ></vxe-textarea>
                        </div>
                      </div>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'select'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindListContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <el-select
                        class="popup-form--select"
                        v-model="formModel[item.field]"
                        size="small"
                        v-bind="item.props"
                      >
                        <el-option
                          v-for="(opt, optIndex) in dataList[item.source] || []"
                          :key="optIndex"
                          :value="bindOptionsValue(opt, item)"
                          :label="opt.label"
                        ></el-option>
                      </el-select>
                    </template>
                  </template>
                </vxe-form-item>
              </template>
              <template v-else-if="item.type === 'selectinput'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindListContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <el-select
                        class="popup-form--select"
                        v-model="formModel[item.field]"
                        size="small"
                        filterable
                        v-bind="item.props"
                        @change="onSelectChange($event, item)"
                      >
                        <el-option
                          v-for="(opt, optIndex) in dataList[item.source] || []"
                          :key="optIndex"
                          :value="opt.value"
                          :label="opt.label"
                        ></el-option>
                      </el-select>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'searchable'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindListContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="popup-form-wrapper">
                        <div class="popup-form-wrapper-main">
                          <vxe-select
                            v-model="formModel[item.field]"
                            clearable
                            filterable
                          >
                            <vxe-option
                              v-for="_item in dataList[item.source] || []"
                              :key="_item.value"
                              :value="_item.value"
                              :label="_item.label"
                            ></vxe-option>
                          </vxe-select>
                        </div>
                      </div>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'radio'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindListContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <vxe-radio-group
                        v-model="formModel[item.field]"
                        class="popup-form--radio"
                      >
                        <vxe-radio
                          v-for="opt in dataList[item.source] || []"
                          :key="opt.value"
                          :label="bindOptionsValue(opt, item)"
                          :content="opt.label"
                        ></vxe-radio>
                      </vxe-radio-group>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'radioButton'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindListContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <vxe-radio-group
                        v-model="formModel[item.field]"
                        class="popup-form--radio-button"
                        :strict="false"
                      >
                        <vxe-radio-button
                          v-for="item in dataList[item.source] || []"
                          :key="item.value"
                          :label="item.value"
                          :content="item.label"
                        ></vxe-radio-button>
                      </vxe-radio-group>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'radio'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindListContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <vxe-radio-group
                        v-model="formModel[item.field]"
                      >
                        <vxe-radio-button
                          v-for="item in dataList[item.source] || []"
                          :key="item.value"
                          :label="item.value"
                          :content="item.label"
                        ></vxe-radio-button>
                      </vxe-radio-group>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'checkbox'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindCheckboxContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <vxe-checkbox
                        class="popup-form--checkbox"
                        v-model="formModel[item.field]"
                      ></vxe-checkbox>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'checkboxGroup'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindCheckboxGroupContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <vxe-checkbox-group
                        v-model="formModel[item.field]"
                        class="popup-form--checkbox-group"
                      >
                        <vxe-checkbox
                          v-for="item in dataList[item.source] || []"
                          :key="item.value"
                          :label="item.value"
                          :content="item.label"
                        ></vxe-checkbox>
                      </vxe-checkbox-group>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'arrayInput'">
                <template v-if="readOnly">
                  <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                    <template #default>
                      <p
                        class="popup-form--p"
                        v-for="(item, index) in formModel[item.field]"
                        :key="index"
                      >
                        {{ item }}
                      </p>
                    </template>
                  </vxe-form-item>
                </template>
                <template v-else>
                  <template v-if="formModel[item.field].length === 0">
                    <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                      <template #default>
                        <div class="popup-form-wrapper">
                          <div
                            class="popup-form-wrapper-btns"
                            style="margin: 0"
                          >
                            <i
                              class="vxe-icon-add add"
                              @click="onAddArrayInputClick(item)"
                            ></i>
                          </div>
                        </div>
                      </template>
                    </vxe-form-item>
                  </template>
                  <template v-else>
                    <vxe-form-item
                      v-for="(valItem, valIndex) in formModel[item.field]"
                      v-bind="bindItemProps(item, gatherItem)"
                      :title="item.label + (valIndex === 0 ? '' : valIndex + 1)"
                      :key="`${item.field}_${valIndex}`"
                    >
                      <template #default>
                        <div class="popup-form-wrapper">
                          <div class="popup-form-wrapper-main">
                            <vxe-input
                              class="popup-form--input"
                              v-model="formModel[item.field][valIndex]"
                              v-bind="item.props"
                            ></vxe-input>
                          </div>
                          <div class="popup-form-wrapper-btns">
                            <i
                              v-if="
                                valIndex === formModel[item.field].length - 1
                              "
                              class="vxe-icon-add add"
                              @click="onAddArrayInputClick(item)"
                            ></i>
                            <i
                              class="vxe-icon-minus"
                              @click="onDelArrayInputClick(item, valIndex)"
                            ></i>
                          </div>
                        </div>
                      </template>
                    </vxe-form-item>
                  </template>
                </template>
              </template>

              <template v-else-if="item.type === 'date'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ formModel[item.field] }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <el-date-picker
                        v-model="formModel[item.field]"
                        class="popup-form--datetime"
                        type="datetime"
                        placeholder="选择日期"
                        align="right"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="small"
                        v-bind="item.props"
                      >
                      </el-date-picker>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'datetime'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ formModel[item.field] }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <el-date-picker
                        v-model="formModel[item.field]"
                        class="popup-form--datetime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        size="small"
                        v-bind="item.props"
                      >
                      </el-date-picker>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'selecttree'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindSelectTreeContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <el-select
                        v-model="formModel[item.field]"
                        class="popup-form--selecttree"
                        size="small"
                        :ref="`select_tree_${index}`"
                      >
                        <el-option
                          v-for="optionItem in bindSelectTreeSource(item)"
                          :key="optionItem.value"
                          :value="optionItem.value"
                          :label="optionItem.label"
                          style="display: none"
                        ></el-option>
                        <el-tree
                          :data="dataList[item.source]"
                          class="popup-form--tree"
                          size="small"
                        >
                          <div
                            class="popup-form--tree-item"
                            slot-scope="{ node, data }"
                          >
                            <span>{{ data.label }}</span>
                            <page-button
                              type="text"
                              size="small"
                              v-if="!isValueEmpty(data.value)"
                              @click.stop="
                                onSelectTreeItemClick(item, index, node, data)
                              "
                              >选择</page-button
                            >
                          </div>
                        </el-tree>
                      </el-select>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'tree'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindTreeContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <!--  :allow-create="true" 隐藏了cc6/21 -->
                      <el-select-tree
                        v-model="formModel[item.field]"
                        class="popup-form--selecttree"
                        size="small"
                        filterable
                        :data="dataList[item.source]"
                      >
                      </el-select-tree>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'pca'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div class="popup-form--span">
                        <span>{{ bindPcaContent(item) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <!-- v-model="formModel[item.field]" -->
                      <pca-cascader-home
                        class="popup-form--pca"
                        v-model="formModel"
                        data-type="string"
                        placeholder="请选择区域"
                        :check-strictly="false"
                        clearable
                        v-bind="{ ...item.pcaOptions }"
                        @change="onPcaChange($event, item)"
                      ></pca-cascader-home>
                    </template>
                  </template>
                </vxe-form-item>
              </template>

              <template v-else-if="item.type === 'custom'">
                <vxe-form-item v-bind="bindItemProps(item, gatherItem)">
                  <template #default>
                    <template v-if="readOnly">
                      <div
                        class="popup-form--span"
                        v-html="bindCustomContent(item)"
                      ></div>
                    </template>
                    <template v-else>
                      <component
                        :is="item.component"
                        v-bind="item.customOptions"
                        v-model="formModel[item.field]"
                      ></component>
                    </template>
                  </template>
                </vxe-form-item>
              </template>
            </template>
          </vxe-form-gather>
        </template>
      </vxe-form>
    </div>
    <div class="popup-form-view-footer" :style="footerStyle">
      <template v-if="readOnly">
        <page-button
          class="popup-form--button"
          theme="default"
          @click="onCloseBtnClick"
          >关闭</page-button
        >
      </template>
      <template v-else>
        <page-button class="popup-form--button" @click="onOkBtnClick">{{
          okText
        }}</page-button>
        <page-button class="popup-form--button" @click="onCloseBtnClick">{{
          cancelText
        }}</page-button>
      </template>
    </div>
  </div>
</template>

<script>
import XEUtils from "xe-utils";

const BTN_ALIGN = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

function filterTree(tree) {
  return tree.reduce((acc, item) => {
    if ((item.value ?? "") !== "") {
      acc.push({ label: item.label, value: item.value });
    }
    if (item.children) {
      acc.push(...filterTree(item.children));
    }
    return acc;
  }, []);
}

export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    dataList: {
      type: Object,
      default: () => {
        return {};
      },
    },
    dataGather: {
      type: Array,
      default: () => {
        return [];
      },
    },
    rules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    span: {
      type: Number,
      default: 24,
    },
    okText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    btnAlign: {
      type: String,
      default: "",
    },
    titleAlign: {
      type: String,
      default: "right",
    },
    titleWidth: {
      type: [Number, String],
      default: 100,
    },
    titleColon: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    arrayValues() {
      return (item) => {
        return this.formModel[item.field] || [];
      };
    },
    footerStyle() {
      const style = {};
      const align = BTN_ALIGN[this.btnAlign];
      if (align) {
        style["justify-content"] = align;
      }
      return style;
    },
    bindContent() {
      return (item, gatherItem) => {
        if (typeof item.formatter === "function") {
          return item.formatter(item, gatherItem);
        }
        return this.formModel[item.field] ?? "";
      };
    },
    bindListContent() {
      return (item) => {
        const list = this.dataList[item.source] ?? [];
        const find = list.find((i) => i.value == this.formModel[item.field]);
        return find ? find.label : this.formModel[item.field];
      };
    },
    bindCheckboxGroupContent() {
      return (item) => {
        const list = this.dataList[item.source] ?? [];
        return list
          .filter((i) => this.formModel[item.field].includes(i.value))
          .map((i) => i.label)
          .join(",");
      };
    },
    bindCheckboxContent() {
      return (item) => {
        let val = this.formModel[item.field];
        const showText = item.showText ?? [];
        return val ? showText[0] || "是" : showText[1] || "否";
      };
    },
    bindCustomContent() {
      return (item) => {
        const formatter = item.customOptions.formatter;
        if (typeof formatter === "function") {
          return formatter(this.formModel[item.field], item);
        }
        return this.formModel[item.field];
      };
    },
    bindSelectTreeSource() {
      return (item) => {
        const sourceList = this.dataList[item.source] ?? [];
        const list = filterTree(sourceList);
        return list;
      };
    },
    bindSelectTreeContent() {
      return (item) => {
        const val = this.formModel[item.field];
        const list = this.bindSelectTreeSource(item);
        return list.find((i) => i.value === val)?.label;
      };
    },
    bindTreeContent() {
      return (item) => {
        const val = this.formModel[item.field];
        const sourceList = this.dataList[item.source] ?? [];
        const list = filterTree(sourceList);
        const find = list.find((i) => i.value === val);
        return find ? find.label : val;
      };
    },
    bindPcaContent() {
      return (item) => {
        if (item.pcaTextField) {
          return this.formModel[item.pcaTextField];
        }
        return this.formModel[item.field];
      };
    },
    isValueEmpty() {
      return (value) => {
        return (value ?? "") === "";
      };
    },
    bindItemProps() {
      return (item, gatherItem) => {
        const { label, field, span, titleWidth, titleColon } = item;
        return {
          title: label,
          field,
          span: span || gatherItem.span,
          titleWidth,
          titleColon: titleColon || gatherItem.titleColon,
        };
      };
    },
    bindOptionsValue() {
      return (opt, item) => {
        if (item.valueType === "number") {
          return Number(opt.value);
        } else if (item.valueType === "string") {
          return String(opt.value);
        }
        return opt.value;
      };
    },
  },
  data() {
    return {
      formModel: {},

      handles: {
        arrayInput: (model, item) => {
          let val = model[item.field] || "";
          if (typeof val === "string") {
            model[item.field] = val.split(",");
          }
        },
        checkboxGroup: (model, item) => {
          let val = model[item.field] || "";
          if (typeof val === "string") {
            model[item.field] = val === "" ? [] : val.split(",");
          }
        },
      },
      outputHandles: {
        arrayInput: (model, item) => {
          let val = model[item.field] || [];
          if (typeof item.output === "string") {
            model[item.field] = val.join(",");
          }
        },
        checkboxGroup: (model, item) => {
          let val = model[item.field] || [];
          if (typeof item.output === "string") {
            model[item.field] = val.join(",");
          }
        },
      },
    };
  },
  created() {
    let formModel = XEUtils.clone(this.formData, true);
    this.formModel = this.handleModel(formModel);
  },
  destroyed() {
    console.log("destroyed");
  },
  methods: {
    handleModel(model) {
      this.dataGather.forEach((gather) => {
        gather.config.forEach((item) => {
          const handle = this.handles[item.type];
          handle && handle(model, item);
        });
      });
      return model;
    },
    handleOutputModel(model) {
      this.dataGather.forEach((gather) => {
        gather.config.forEach((item) => {
          const handle = this.outputHandles[item.type];
          handle && handle(model, item);
        });
      });
      return model;
    },
    onCloseBtnClick() {
      this.$emit("close");
    },
    onOkBtnClick() {
      const form = this.$refs.form;
      form.validate((errMap) => {
        if (errMap) return;
        let data = this.handleOutputModel(XEUtils.clone(this.formModel, true));
        this.$emit("ok", data);
      });
    },

    onDelArrayInputClick(item, index) {
      this.formModel[item.field].splice(index, 1);
    },
    onAddArrayInputClick(item) {
      this.formModel[item.field].push("");
    },

    onSelectTreeItemClick(item, index, node, data) {
      this.formModel[item.field] = data.value;
      const el = this.$refs[`select_tree_${index}`][0];
      el && el.blur();
    },

    onPcaChange($event, item) {
      console.log("$event", $event);
      console.log("item", item);
      const { name } = $event;
      if (item.pcaTextField) {
        this.formModel[item.pcaTextField] = name;
      }
    },

    onSelectChange(e, item) {
      this.$emit('events', {
        eventName: 'change:select',
        data: {
          item,
          instance: this
        },
      })
    }
  },
};
</script>

<style lang="less">
.popup-form-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  .vxe-form--item-title {
    margin-bottom: auto;
    .vxe-form--item-title-label {
      vertical-align: unset;
    }
  }
  .vxe-form--item-title-content {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 20px;
  }
  .vxe-form .vxe-form--item-inner > .align--right {
    .vxe-form--item-title-content {
      justify-content: flex-end;
    }
  }
  .vxe-form .vxe-form--item-inner > .align--center {
    .vxe-form--item-title-content {
      justify-content: center;
    }
  }

  .popup-form-wrapper {
    display: flex;
    align-items: center;
    min-height: 40px;
    .popup-form-wrapper-main {
      display: flex;
      align-items: center;
      flex: 1;
      width: 0;
      padding: 0;
    }
    .popup-form-wrapper-btns {
      display: flex;
      align-items: center;
      padding: 0;
      margin-left: 12px;
      > i {
        display: block;
        text-align: center;
        margin: 0 6px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 13px;
        border-radius: 50%;
        border: solid 1px #ddd;
        color: #ddd;
        cursor: pointer;
      }
      > i.add {
        border-color: var(--base-color);
        color: var(--base-color);
      }
    }
  }
  .vxe-input.is--suffix .vxe-input--inner {
    padding-right: 60px;
  }
  .vxe-input .vxe-input--suffix {
    width: fit-content;
    white-space: nowrap;
    right: 12px;
  }
}
.popup-form-view-body {
  flex: 1;
  height: 0;
  padding: 12px;
}
.popup-form-view-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 25px;
  height: 72px;

  .popup-form--button {
    padding: 0 10px;
    height: 30px;
  }
}

.popup-form--input {
  width: 100%;
}
.popup-form--input,
.popup-form--select,
.popup-form--selecttree {
  width: 100%;
  height: 34px;
  line-height: 34px;
}
.popup-form--radio,
.popup-form--checkbox {
  line-height: 34px;
}
.popup-form--radio {
  .vxe-radio {
    margin-left: 0 !important;
    margin-right: 10px;
  }
}
.popup-form--radio-button {
  color: #a3a3a3;
  background: #fff;
  .vxe-radio-button:first-child .vxe-radio--label {
    border-left: 1px solid #a3a3a3;
  }
  .vxe-radio--label {
    line-height: 22px;
    padding: 0 10px;
    border-color: #a3a3a3;
  }
}
.popup-form--checkbox-group {
  .vxe-checkbox {
    margin-left: 0;
    margin-right: 10px;
  }
}
.popup-form--textarea {
  > textarea {
    max-width: 100%;
  }
}
.el-select-tree__popper {
  .el-select-dropdown__list {
    > li.el-select-dropdown__item {
      font-size: 14px;
      padding: 0 20px;
      margin-bottom: 6px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      background-color: #f5f7fa !important;
      height: 34px;
      line-height: 34px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
.popup-form--pca {
  width: 100%;
}
.popup-form-view {
  .popup-form--datetime {
    width: 100%;
  }
}
.popup-form--inputnumber {
  width: 100%;
}

// .popup-form-modal--scroll {
//   .popup-form-view-body {
//     overflow: auto;
//   }
// }
.popup-form-view {
  .popup-form-gather-title {
    padding: 0;
    width: 100%;
  }
}
.popup-form--span {
  padding: 7px 0;
}
.popup-form--p {
  margin: 0;
  line-height: 40px;
}

.popup-form--tree-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px 0 0;
  width: 100%;
  font-size: 14px;
}
</style>

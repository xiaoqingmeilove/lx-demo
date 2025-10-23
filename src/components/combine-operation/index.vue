<template>
  <div class="combine-operation">
    <div class="co-wrapper">
      <vxe-select v-model="selectValue"
        class="co-selector"
        placeholder="请填充"
        :disabled="disabled"
        @change="onSelectChange"
      >
        <vxe-option v-for="(item, index) in options"
          :key="index"
          :value="item.value"
          :label="item.label"
        ></vxe-option>
      </vxe-select>
      <template v-if="currentSelect">
        <template v-if="currentSelect.type === 'combobox'">
          <vxe-select v-model="value"
            class="co-combobox"
            :placeholder="currentLabel"
            clearable
            :disabled="disabled"
          >
            <vxe-option v-for="(_item, _index) in currentSource"
              :key="_item.value"
              :value="_item.value"
              :label="_item.label"
            ></vxe-option>
          </vxe-select>
        </template>

        <template v-else-if="currentSelect.type === 'select'">
          <el-select v-model="value"
            class="co-select"
            :placeholder="currentLabel"
            :disabled="disabled"
            collapse-tags
            clearable
            v-bind="currentSelect.props"
          >
            <el-option v-for="(_item, _index) in currentSource"
              :key="_item.value"
              :value="_item.value"
              :label="_item.label"
            ></el-option>
          </el-select>
        </template>

        <template v-else-if="currentSelect.type === 'number'">
          <vxe-input v-model="value"
            type="number"
            class="co-input"
            :placeholder="currentLabel"
            clearable
            :controls="false"
            :disabled="disabled"
            @focus="onInputFocus"
            @blur="onInputBlur"
          ></vxe-input>
        </template>
        <template v-else-if="currentSelect.type === 'integer'">
          <vxe-input v-model="value"
            type="integer"
            class="co-input"
            :placeholder="currentLabel"
            clearable
            :controls="false"
            :disabled="disabled"
            @focus="onInputFocus"
          ></vxe-input>
        </template>
        <template v-else-if="currentSelect.type === 'float'">
          <vxe-input v-model="value"
            type="float"
            :digits="currentSelect.digits"
            class="co-input"
            :placeholder="currentLabel"
            clearable
            :controls="false"
            :disabled="disabled"
            @focus="onInputFocus"
          ></vxe-input>
        </template>
        <template v-else-if="currentSelect.type === 'date'">
          <el-date-picker
            class="co-date-picker"
            v-model="value"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            prefix-icon=" "
            placeholder="请选择日期"
            v-bind="currentSelect.props"
          >
          </el-date-picker>
        </template>
        <template v-else>
          <vxe-input v-model="value"
            class="co-input"
            :placeholder="currentLabel"
            clearable
            :disabled="disabled"
            @focus="onInputFocus"
          ></vxe-input>
        </template>
      </template>
    </div>
    <page-button class="co-button" @click.stop="onBtnClick" :disabled="btnDisabled">{{buttonText}}</page-button>
  </div>
</template>

<script>
import XEUtils from "xe-utils";
  export default {
    name: 'combineOperation',
    props: {
      options: {
        type: Array,
        default: () => ([])
      },
      buttonText: {
        type: String,
        default: '填充'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      sourceList: {
        type: Object,
        default: () => ({})
      },
      required: {
        type: Boolean,
        default: true
      },
      clickSelectAll: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      currentSelect() {
        return this.options[this.currentIndex]
      },
      currentLabel() {
        return this.currentSelect ? `请输入${this.currentSelect.label}` : ''
      },
      currentSource() {
        return this.currentSelect ? this.sourceList[this.currentSelect.source] ?? [] : []
      },
      btnDisabled() {
        if (this.disabled
          || (this.required && [undefined, null, ''].includes(this.value))
        ) {
          return true;
        }
        return false;
      }
    },
    data() {
      return {
        selectValue: null,
        value: '',
        currentIndex: -1,
      }
    },
    created() {
      this.setDefaultOptions()
    },
    methods: {
      setDefaultOptions() {
        const first = this.options[0]
        if (first) {
          this.selectValue = first.value
          this.currentIndex = 0
        }
      },
      onSelectChange({ value, $event }) {
        this.currentIndex = this.options.findIndex(x => x.value === value)
        this.value = ''
      },
      onBtnClick() {
        let value = this.value
        const current = this.currentSelect
        if (current.type === 'select' && current.output === 'string' && value instanceof Array) {
          value = value.join(',')
        }
        this.$emit('click', {
          field: this.selectValue,
          value
        })
      },
      clear() {
        this.value = undefined
      },
      onInputFocus({ $event }) {
        if (this.clickSelectAll) {
          const { target } = $event
          target.select()
        }
      },
      onInputBlur(e) {
        // toFixed四舍五入
        const { toFixed } = this.currentSelect
        let { value } = this
        if (![undefined, null, false].includes(toFixed)) {
          value = XEUtils.round(value, toFixed || 0)
          this.value = value
        }
      }
    }
  }
</script>

<style lang="less">
.combine-operation {
  display: flex;
  align-items: center;
  height: 32px;
  .co-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .co-selector {
    width: 120px;
    height: 28px;
    .vxe-input {
      height: 100%;
      line-height: 1;
    }
    .vxe-input--inner {
      border-radius: 4px 0 0 4px;
      border: solid 1px #cadde8;
      border-right: none;
    }
  }
  .co-selector.vxe-select.is--active:not(.is--filter)>.vxe-input .vxe-input--inner {
    border: solid 1px #cadde8;
    border-right: none;
  }
  .co-input {
    width: 136px;
    height: 28px;
    line-height: 1;
    .vxe-input--inner {
      border-radius: 0 4px 4px 0;
      border: solid 1px #cadde8;
    }
  }
  .co-input.vxe-input:not(.is--disabled).is--active .vxe-input--inner {
    border: solid 1px #cadde8;
  }

  .co-combobox {
    width: 136px;
    height: 28px;
    .vxe-input {
      height: 100%;
      line-height: 1;
      .vxe-input--inner {
        border-radius: 0 4px 4px 0;
        border: solid 1px #cadde8;
      }
    }
    .vxe-input:not(.is--disabled).is--active .vxe-input--inner {
      border: solid 1px #cadde8;
    }
  }

  .co-select {
    width: 136px;
    height: 28px;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
        line-height: 1;
        border-radius: 0 4px 4px 0;
        border: solid 1px #cadde8;
        padding: 0 1.8em 0 .6em;
      }
      .el-input__suffix {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0.2em;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 1.6em;
        height: 1.6em;
        .el-icon-arrow-up:before {
          font-family: vxeiconfont !important;
          content: "\e8ee";
        }
      }
    }
    .el-select__tags {
      flex-wrap: nowrap;
    }
  }
  .co-date-picker{
    width: 136px;
    height: 28px !important;
    &.el-input, &.el-input--prefix, &.el-input--suffix {
      height: 100%;
      .el-input__inner{
        height: 100%;
        line-height: 1;
        border-radius: 0 4px 4px 0;
        border: solid 1px #cadde8;
        padding: 0 1.8em 0 .6em;
      }
      .el-input__suffix{
        top:-5px;
      }
    }
  }
  .co-button {
    margin-left: 6px;
  }
}
</style>

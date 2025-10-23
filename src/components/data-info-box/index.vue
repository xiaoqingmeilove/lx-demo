<template>
  <div class="data-info-box">
    <i
      :class="show ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
      @click="showClick"
    ></i>
    <div
    v-if="show"
      class="data-info-item"
      v-for="(item, index) in infoList"
      :key="index"
      :class="hasValue(item)"
      :style="itemStyle(item)"
    >
      <div class="data-info-title">
        <div class="data-info-icon">
          <i :class="item.icon" v-if="item.icon"></i>
        </div>
        <div class="data-info-label">
          <label>{{ item.label }}</label>
        </div>
      </div>
      <div class="data-info-content">
        <template v-if="item.slot">
          <slot :name="item.slot" v-bind="{ item }"></slot>
        </template>
        <template v-else>
          <el-tooltip effect="dark" :content="itemText(item)" placement="top">
            <span :style="itemStateStyle(item)">{{ itemText(item) }}</span>
          </el-tooltip>
        </template>        
      </div>
    </div>
   
  </div>
</template>

<script>
export default {
  name: "dataInfoBox",
  props: {
    infoList: {
      type: Array,
      default: () => [],
    },
    infoValue: {
      type: Object,
      default: () => ({}),
    },
    showValue: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    }
  },
  computed: {
    itemStateStyle(){
      return (item) => {
        if(item.label == "单据状态"){
          const val = this.infoValue[item.field]
          let dict = this.$store.state.Common.dict;
          let stateList = dict["bill_state"] ?? [];
          let find = stateList.find(x => x.dictLabel == val);
          if(find && find.remark){
            return {
              color:find.remark
            }
          }
          return {}
        }
        return {}
      } 
    },
    hasValue() {
      return (item) => {
        //const value = this.infoValue[item.field]
        //return ['', null, undefined].includes(value) ? '' : 'data-item--value'
        return this.showValue ? "data-item--value" : "";
      };
    },
    itemStyle() {
      return (item) => {
        const style = {};
        if (item.span) {
          style["flex"] = item.span;
        }
        return style;
      };
    },
    itemText() {
      return (item) => {
        if (this.showValue) {
          const { findInOptions } = item
          const val = this.infoValue[item.field]
          if (findInOptions) {            
            const options = this.options[findInOptions] ?? []
            return options.find(i => i.value == val)?.label
          }
          return val ?? ''
        }
        return item.placeholder || ''
      };
    },
  },
  data(){
    return {
      show:localStorage.getItem("data_bill_info_show") === "false" ? false:true,
    };
  },
  methods:{
    showClick(){
      this.show = !this.show;
      localStorage.setItem("data_bill_info_show", this.show);
    },
  },
};
</script>

<style lang="less">
.data-info-box {
  display: flex;
  justify-content: space-between;
  gap: 27px;
  height: auto;
  margin-bottom: 12px;
  color: #a3a3a3;
  position: relative;
  .el-icon-arrow-down,.el-icon-arrow-up,.el-icon-arrow-right{
    position: absolute;
  left: 0;
  top: -15px;
  font-size: 20px;
  padding-right: 30px;
  color:#595959;
  }
  .data-info-item {
    display: block;
    padding: 6px 8px;
    height: 100%;
    min-width: 112px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
    .data-info-title {
      display: flex;
      align-items: center;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: #7f7f7f;
      .data-info-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 22px;
        height: 22px;
        font-size: 16px;
        margin-right: 0;
        > i {
          color: #a3a3a3;
        }
      }
      .data-info-label {
        > label {
          font-weight: normal;
        }
      }
    }
    .data-info-content {
      line-height: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #d2d2d2;
      font-size: 16px;
    }
  }
}
.data-item--value.data-info-item {
  .data-info-content {
    color: #595959;
  }
}
</style>

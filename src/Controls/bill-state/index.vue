<template>
  <div class="bill-state">
    <!-- <i class="bill-state-dot" :style="stateColor"></i> -->
    <span :style="`color:${stateObj.color}`">{{ stateObj.text }}</span>
  </div>
</template>

<script>
import { number } from "echarts/lib/export";
const STATE_CONFIG = {
  0: { text: "计划中", color: "#D5E2FF" },
  1: { text: "审核中", color: "#FFA940" },
  2: { text: "已审核", color: "#52C41A" },
  3: { text: "已作废", color: "#FF4D4F" },
  4: { text: "转议价", color: "#780FFF" },
  5: { text: "已失效", color: "#9F9F9F" },
  6: { text: "转线下", color: "#BB0366" },
  7: { text: "已成交", color: "#69C0FF" },
  8: { text: "完成制作", color: "#52C41A" },
};
export default {
  name: "billState",
  props: {
    state: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    stateObj() {
      let billState = this.$store.state.Common.dict["bill_state"] ?? [];
      let stateFind = billState.find((x) => Number(x.dictValue) === Number(this.state));
      if (stateFind) {
        return {
          text: stateFind.dictLabel,
          color: stateFind.remark ?? "#D5E2FF",
        };
      } else {
        return {
          text: "未知",
          color: "#D5E2FF",
        };
      }
    },
    stateColor() {
      return {
        background: this.stateObj.color,
      };
    },
  },
};
</script>

<style lang="less">
.bill-state {
  display: inline-flex;
  align-items: center;
  line-height: 22px;
  font-size: 14px;
  // color: #595959;
  cursor: default;
  .bill-state-dot {
    width: 6px;
    height: 6px;
    margin-right: 5px;
    border-radius: 50%;
    background: none;
  }
}
</style>

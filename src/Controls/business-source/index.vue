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
};
export default {
  name: "businessSource",
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
      // console.log('this.state',this.state);
      let businessSource = this.$store.state.Common.dict["OrderBusinessSource"] ?? [];
      let stateFind = businessSource.find((x) => Number(x.dictValue) === Number(this.state));
      if (stateFind) {
        return {
          text: stateFind.dictLabel,
          color: stateFind.remark ?? "#D5E2FF",
        };
      } else {
        return {
          text: this.state,
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

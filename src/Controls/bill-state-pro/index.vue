<template>
  <div class="state-pro">
    <!-- <i class="bill-state-dot" :style="stateColor"></i> -->
    <!-- <span :style="`color:${stateObj.color}`">{{ stateObj.text }}</span> -->
    <span class="status" :style="{color: stateObj.color}">
      <span class="dot" :style="{background: stateObj.color}"></span>
      <span>{{stateObj.text}}</span>
    </span>
  </div>
</template>

<script>

export default {
  name: "statePro",
  props: {
    state: {
      type: [String, Number],
      default: null,
    },
    source: {
      type: String,
      default: "bill_state",
    },
  },
  data() {
    return {};
  },
  computed: {
    stateObj() {
      let billState = this.$store.state.Common.dict[this.source] ?? [];
      let stateFind = billState.find((x) => Number(x.dictValue) == Number(this.state));
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
.state-pro {
  display: inline-flex;
  align-items: center;
  line-height: 22px;
  font-size: 14px;
  cursor: default;
  .state-dot {
    width: 6px;
    height: 6px;
    margin-right: 5px;
    border-radius: 50%;
    background: none;
  }
}
</style>

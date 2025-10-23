<template>
  <div class="biz-flow-status">
     <span> 
      <span class="row-bg" :style="{background: `${stateObj.color}`}">
        {{stateObj.text}}
      </span>
     </span>
  </div>
</template>

<script>
export default {
  name: "businessStatusPro",
  props: {
    state: {
      type: [String, Number],
      default: null,
    },
    source:{
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    stateObj() {
      let bizFlowStatus = this.$store.state.Common.dict[this.source] ?? [];
      let stateFind = bizFlowStatus.find((x) => x.dictValue == this.state);
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
.biz-flow-status{
  span{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    white-space: normal;
    line-height: 1;
  }
  .row-bg {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 4px;
  color: #fff;
}
}

</style>

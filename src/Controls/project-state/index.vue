<template>
  <div class="project-state">
     <span> 
      <span class="row-bg" :style="{background: `${stateObj.color}`}">
        {{stateObj.text}}
      </span>
     </span>
  </div>
</template>

<script>
const stateList = [
  { dictLabel: "报名中", dictValue: 0, remark: "#A2A2A2"},
  { dictLabel: "报名截止", dictValue: 1, remark: "#f8a900"},
  { dictLabel: "报价中", dictValue: 2, remark: "#199eff"},
  { dictLabel: "已开标", dictValue: 3, remark: "#18c3d9"},
  { dictLabel: "已终止", dictValue: 4, remark: "#ff7272"},
  { dictLabel: "已定标", dictValue: 5, remark: "#49b714"},
];
export default {
  name: "projectState",
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
      let stateFind = stateList.find((x) => x.dictValue == this.state);
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
.project-state{
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

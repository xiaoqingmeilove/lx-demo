<template>
  <div class="bill-item-states">
    <!-- <svg-icon v-for="item in states" :key="item.icon"
      :class-name="['bill-item-state-icon', inList(item)]"
      :icon-class="item.icon"
      :title="item.title"
      :size="12"
    ></svg-icon> -->
    <!-- <img v-for="item in states" :key="item.icon"
      :class-name="['bill-item-state-icon', inList(item)]"
      :src="iconImg(item)"
      :title="item.title"
    /> -->
      <new-item-state-icon
      v-for="item in states" :key="item.icon"
        v-if="inList(item)"
        :class="[inList(item)]"
        :icon="item"
      ></new-item-state-icon>
  </div>
</template>

<script>
export default {
  name: "newItemStates",
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    // console.log(this.dataList, "dataList");
  },
  computed: {
    inList() {
      return (item) => {
        // return "bill-item-state-visible"
        return this.dataList.includes(item) ? "bill-item-state-visible" : "";
      };
    },
  },
  data() {
    return {
      states: ["fei","deng", "gou", "xie", "cai","aps"],
    };
  },
};
</script>

<style lang="less">
.bill-item-states {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 1px;
  gap: 2px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .bill-item-state-icon {
    flex: 1;
    flex-grow: 0;
    visibility: hidden;
  }
  .bill-item-state-visible {
    visibility: visible;
  }
}
</style>

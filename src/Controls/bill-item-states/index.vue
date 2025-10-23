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
    <bill-item-state-icon v-for="item in states" :key="item.icon"
      :class="[inList(item)]"
      :icon="item"
    ></bill-item-state-icon>
  </div>
</template>

<script>
  export default {
    name: 'billItemStates',
    props: {
      dataList: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      inList() {
        return item => {
          return this.dataList.includes(item) ? 'bill-item-state-visible' : ''
        }
      },
    },
    data() {
      return {
        states: ['fei', 'aps', 'deng', 'gou', 'xie']
      }
    }
  }
</script>

<style lang="less">
.bill-item-states {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 1px;
  gap: 2px;
  width: 44px;
  height: 28px;
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

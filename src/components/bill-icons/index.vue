<template>
  <div class="bill-icons">
   
    <div v-for="(item,index) in data" class="icons">
      <div
        v-if="billInfo[item.key]"
        :style="`color:${item.color};border:1px solid ${item.color};background-color:${item.bg};`"
      >
        {{ item.name }}
      </div>
     
    </div>
  
  </div>
</template>

<script>
import XEUtils from "xe-utils";
export default {
  name: "billIcons",
  props: {
    billInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {},
  data() {
    return {
      data: [
        {
          name: "框架协议",
          key: "xie",
          color: "#1890FF",
          bg: "#E9F2FF",
        },
        {
          name: "已成交",
          key: "deal",
          color: "#52C41A",
          bg: "#E9FFE9",
        },
        {
          name: "有附件",
          key: "file",
          color: "#ED5E60",
          bg: "#FFE9E9",
        },
        {
          name: "合并议价",
          key: "merge",
          color: "#FFA800",
          bg: "#FFF3E9",
        },
        {
          name: "复制单",
          key: "copy",
          color: "#4CD2E3",
          bg: "#E7F9FF",
        },
        {
          name: "技术评审中",
          key: "teching",
          color: "#ef6d77",
          bg: "#ffeee9",
        },
        {
          name: "技术评审完成",
          key: "teched",
          color: "#ef6d77",
          bg: "#ffeee9",
        },
        {
          name: "外购询价中",
          key: "purching",
          color: "#2cb391",
          bg: "#e9fffa",
        },
        {
          name: "外购询价完成",
          key: "purched",
          color: "#2cb391",
          bg: "#e9fffa",
        },
        {
          name: "资信评审中",
          key: "legaling",
          color: "#2cb391",
          bg: "#e9fffa",
        },
        {
          name: "资信评审完成",
          key: "legaled",
          color: "#2cb391",
          bg: "#e9fffa",
        },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.bill-icons {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 50px;
  .icons {
    div {
      text-align: center;
      border-radius: 2px;
      padding: 2px 5px;
      font-size: 14px;
    }
  }
}
</style>

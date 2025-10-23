<template>
  <div class="filter-main">
    <div class="filter-content">
      <div class="filter-item" v-for="(item, index) in filters" :key="index">
        <vxe-select
          v-model="item.field"
          class="filter-item--select-field"
          transfer
          placeholder="请选择字段"
          :options="fields"
          filterable
        ></vxe-select>

        <vxe-select v-model="item.where" transfer class="filter-item--select">
          <vxe-option
            v-for="op in opList"
            :key="op.value"
            :value="op.value"
            :label="op.label"
          ></vxe-option>
        </vxe-select>
        <vxe-input
          v-model="item.value"
          class="filter-item--input-inter"
          @keyup.enter.native="onConfirm"
          :style="{
            visibility: ['null', 'notnull'].includes(item.where)
              ? 'hidden'
              : '',
          }"
        ></vxe-input>
      </div>
    </div>
    <div class="btn-list">
      <page-button @click="onConfirm">筛选</page-button>
      <page-button @click="Reset()">重置</page-button>
    </div>
  </div>
</template>

<script>
import XEUtils from "xe-utils";
import { OPERATORS, OPERATOR_LIST } from "./filter.js";

export default {
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    filterList: {
      type: Array,
      default: () => [],
    },
    cacheName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      opList: [...OPERATOR_LIST],
      filters: [
        { field: "", where: "eq", value: "" },
        { field: "", where: "eq", value: "" },
      ],
      showPull: false,
    };
  },
  mounted() {
    if (this.cacheName) {
      const filters = localStorage.getItem("InternalSearch")
        ? JSON.parse(localStorage.getItem("InternalSearch"))[this.cacheName] ||
          null
        : null;
      this.filters = filters ? filters : this.filters;
    } else {
      this.filters = XEUtils.clone(this.filterList, true);
    }
  },
  methods: {
    Reset() {
      // this.filters = [
      //   { field: "", where: "eq", value: "" },
      //   { field: "", where: "eq", value: "" },
      // ];
      this.filters = this.filters.map(x => {
        x.value = "";
        return x;
      })
      this.onConfirm();
    },
    onConfirm() {
      const data = [...this.filters].filter(
        (item) =>
          !!item.field &&
          ([OPERATORS.NULL, OPERATORS.NOTNULL].includes(item.where) ||
            Object.values(item).every((v) => !!v))
      );
      this.$emit("confirm", data);
      if (this.cacheName) {
        let InternalSearchObj = localStorage.getItem("InternalSearch")
          ? JSON.parse(localStorage.getItem("InternalSearch"))
          : {};
        InternalSearchObj[this.cacheName] = this.filters;
        localStorage.setItem(
          "InternalSearch",
          JSON.stringify(InternalSearchObj)
        );
      }
    },
    onDeleteClick(item, index) {
      this.filters.splice(index, 1);
    },
    selectEvent(item, fieldItem) {
      item.label = fieldItem.label;
      item.field = this.fields.find((i) => i.value === fieldItem.value)?.value;
      this.showPull = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-main {
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .filter-content {
    width: 86%;
    display: flex;
    overflow: hidden;
    .filter-item {
      // width: 48%;
      width: 0;
      flex: 1;
      display: flex;
      height: 40px;
      align-items: center;
      margin-right: 10px;
      .filter-item--select-field {
        width: 0;
        flex: 2;
      }
      .filter-item--select {
        width: 0;
        flex: 1.5;
      }
      .filter-item--input-inter {
        width: 0;
        flex: 2;
      }
    }
  }
  .btn-list {
    width: 0;
    flex: 1;
    display: flex;
    align-items: center;
  }
}
.fields-dropdown {
  max-height: 250px;
  overflow-y: auto;
  .fields-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 32px;
    &:hover {
      background: #e8ffff;
    }
  }
}
</style>

<template>
  <el-date-picker class="search-component__datepicker"
    v-model="item.value"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    format="yyyy-MM-dd"
    value-format="yyyy-MM-dd"
    unlink-panels
    :editable="false"
    v-bind="item.props"
    @change="onChange"
    :picker-options="pickerOptions"
  >
  </el-date-picker>
</template>

<script>
import moment from "moment";
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data(){
    return{
      moment,
      pickerOptions:{
        shortcuts: [
        {
          text: '今日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '昨日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() - 3600 * 1000 * 24);
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '本周',
          onClick(picker) {
            const start = moment().startOf("week").add(1, "day").format("YYYY-MM-DD");
            const end = moment().endOf("week").add(1, "day").format("YYYY-MM-DD");
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '本月',
          onClick(picker) {
            const start = moment().startOf("month").format("YYYY-MM-DD");
            const end = moment().endOf("month").format("YYYY-MM-DD");
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '本季度',
          onClick(picker) {
            const start = moment().startOf("quarter").format("YYYY-MM-DD");
            const end = moment().endOf("quarter").format("YYYY-MM-DD");
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '本年',
          onClick(picker) {
            const start = moment().startOf("year").format("YYYY-MM-DD");
            const end = moment().endOf("year").format("YYYY-MM-DD");
            picker.$emit('pick', [start, end]);
          }
        },
       ]
      }
    }
  },
  methods: {
    onChange(value) {
      this.$emit('update:value', {
        item: this.item,
        value,
      })
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="view-header">
    <el-divider direction="vertical"></el-divider>
    <div class="view-header-icon-left">
      <div class="iconBox" @click="sort">
        <i class="el-icon-sort"></i>
        <!-- <svg-icon iconClass="paixu" class="icon" /> -->
        <span>排序</span>
      </div>
      <div class="iconBox" @click="refresh" >
        <!-- <i class="el-icon-refresh icon"></i> -->
        <svg-icon iconClass="biaoqing" class="icon" />
        <span>定时刷新</span>
      </div>
      <div class="iconBox" @click="tableView">
        <i class="el-icon-copy-document"></i>
        <!-- <svg-icon iconClass="biaoge1" class="icon" /> -->
        <span>表格布局</span>
      </div>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="view-header-icon-right">
      <div class="iconBoxR" @click="showSearch">
        <i class="el-icon-search"></i>
        <!-- <svg-icon iconClass="sousuo" /> -->
      </div>
      <div class="iconBoxR" @click="renovate">
        <i class="el-icon-refresh"></i>
        <!-- <svg-icon iconClass="shuaxin" /> -->
      </div>
      <div class="iconBoxR" @click="headerField">
        <i class="el-icon-menu"></i>
        <!-- <svg-icon iconClass="split-screen" /> -->
      </div>
      <div class="iconBoxR" @click="layout">
        <i class="el-icon-monitor"></i>
        <!-- <svg-icon iconClass="shitu" /> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tableIcon",
  props: {},
  methods: {
    // 排序
    sort() {
      this.$emit("sort");
    },
    // 定时刷新
    refresh() {
      this.$emit("refresh");
    },
    // 表格视图
    tableView() {
      this.$emit("tableView");
    },
    // 收起搜索区域
    showSearch() {
      this.$emit("showSearch");
    },
    // 刷新当前页面
    renovate() {
      this.$emit("renovate");
    },
    // 自定义表头字段
    headerField() {
      this.$emit("headerField");
    },
    // 自定义布局
    layout() {
      this.$emit("layout");
    },
  },
};
</script>

<style lang="less" scoped>
.view-header {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999999;
  margin-top: 10px;
  .view-header-icon-left {
    display: flex;
    align-items: center;
    .iconBox { 
      cursor: pointer;
      > span {
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px 0 5px; 
      } 
    }
    .icon{
      display: inline-block;
      vertical-align: middle;
      font-size: 16px; 
      color: #999999;
    }
  }
  .view-header-icon-right {
    display: flex;
    .iconBoxR {
      width: 22px;
      height: 22px; 
      margin-left: 10px;
      background: #fff;
      border: 1px solid #999999;
      border-radius: 50%;
      text-align: center;
      line-height: 22px;
      font-size: 12px; 
      cursor: pointer;
    }
  }
}
.el-divider--vertical {
  height: 1.5em;
}
</style>
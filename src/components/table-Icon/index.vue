<template>
  <div class="view-header">
    <el-divider direction="vertical"></el-divider>
    <div class="view-header-icon-left">
      <div class="iconBox" @click="sort"> 
        <svg-icon iconClass="paixu" class="icon" />
        <span>排序</span>
      </div>
      <div class="iconBox" @click="refresh" >
        <i class="el-icon-refresh icon"></i> 
        <span>定时刷新</span>
      </div>
      <div class="iconBox" @click="tableView"> 
        <svg-icon iconClass="biaoge1" class="icon" />
        <span>表格布局</span>
      </div>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="view-header-icon-right">
      <div class="iconBoxR" @click="showSearch">
        <i class="el-icon-search"></i> 
      </div>
      <div class="iconBoxR" @click="renovate">
        <i class="el-icon-refresh"></i> 
      </div>
      <div class="iconBoxR" @click="headerField">
        <i class="el-icon-menu"></i> 
      </div>
      <div class="iconBoxR" @click="layout">
        <i class="el-icon-monitor"></i> 
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 事件名称
 * 
 * sort                 排序 回调
 * refresh              定时刷新 回调
 * tableView            表格布局 回调
 * showSearch           收起搜索区域 回调          
 * renovate             刷新当前页面 回调
 * headerField          自定义表头字段 回调
 * layout               自定义布局 回调
 * 
 */
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
    // 表格布局
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
      line-height: 21px;
      font-size: 12px; 
      cursor: pointer;
    }
  }
}
.el-divider--vertical {
  height: 1.5em;
}
</style>
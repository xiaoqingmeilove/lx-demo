<template>
  <app-page>
    <div class="header-card">
      <div class="header-card-title">供应商概览</div>
      <div class="header-card-body">
        <div class="header-card-item" v-for="item in sumList" :key="item.value">
          <svg-icon :icon-class="item.icon" size="56"></svg-icon>
          <div class="header-card-item-value">
            <div class="header-card-item-value-title">{{ item.label }}</div>
            <div class="header-card-item-value-num">{{ form[item.field] }}</div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="main-card">
      <div class="main-card-item card-item">
        <div class="card_title">供应商分布</div>
        <div class="card-item-content" ref="chinaMap"></div>
      </div>
      <!-- <div class="main-card-item card-item">
        <div class="card-item-content" ref="charts1"></div>
      </div> -->
      <div class="main-card-item card-item">
        <div class="card_title">供应商订单排名</div>
        <div class="card-item-content" ref="charts3"></div>
      </div>
      <div class="main-card-item card-item">
        <div class="card_title">类型分布</div>
        <div class="card-item-content" ref="charts2"></div>
      </div>
      <div class="main-card-item card-item">
        <div class="card_title">月度合同订单金额</div>
        <div class="card-item-content" ref="charts4"></div>
      </div>
    </div>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
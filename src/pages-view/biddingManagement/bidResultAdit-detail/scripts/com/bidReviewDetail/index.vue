<template>
    <app-page>
      <div class="bidReview-detail">
        <div class="bidReview-detail-header">
          <div class="bidReview-detail-header-title">
            <div class="header-left">
              <el-radio-group v-model="headerRadio">
                <el-radio-button label="按专家查看"></el-radio-button>
                <el-radio-button label="按供应商查看"></el-radio-button>
              </el-radio-group>
            </div>
            <!-- <div class="header-right">
              <el-input placeholder="搜索专家或供应商" v-model="searchValue" class="input-with-select"  >
                <el-button slot="append" size="small" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div> -->
          </div>
        </div>
        <div class="bidReview-detail-content content">
          <div class="content-item" v-for="item in form.supplierList" :key="item.id" v-show="headerRadio === '按供应商查看'">
            <div class="content-title" >
              <div class="title-left">
                <div class="title-logo">
                  <img src="@/assets/fileIcon/default.png" alt="logo">
                </div>
                <div class="title-text">
                  <h3>{{ item.supplierName }}</h3>
                  <h4>综合评分：<span>{{ item.score }}</span>&nbsp;&nbsp;|&nbsp;&nbsp;排名：<span>{{ item.scoreRank }}</span></h4>
                </div>
              </div>
              <div class="title-right">
                  <!-- <el-button type="primary" size="small" icon="el-icon-document"> 查看投标文件 </el-button>
                  <el-button type="primary" plain size="small" icon="el-icon-download"> 下载评估报告 </el-button> -->
              </div>
            </div>
            <div class="tableBox">
              <vxe-grid
                :data="item.expertList"
                :id="`tb_cgsq_detail_${item.id}`"
                :custom-config="{ storage: true }"
                :columns="viewDetailList3"
                :show-footer="true"
                :footer-method="footerMethod"	
                min-height="100"
                ref="table3"
              >
                <template #rowNum="{rowIndex}">
                  <span>{{ rowIndex + 1 }}</span>
                </template>
              </vxe-grid>
            </div>
          </div>
          <div class="content-item" v-for="item in form.expertList" :key="item.id" v-show="headerRadio === '按专家查看'">
            <div class="content-title" >
              <div class="title-left">
                <div class="title-logo">
                  <img src="@/assets/fileIcon/default.png" alt="logo">
                </div>
                <div class="title-text">
                  <h3>{{ item.nickName }}</h3>
                  <h4>{{ item.rank }}&nbsp;&nbsp;|&nbsp;&nbsp;评分权重: {{ (item.weightRatio).toFixed(2) || 0 }}&nbsp;%</h4>
                </div>
              </div>
              <div class="title-right">
                <div class="totalScore">
                  <h1>{{ (item.weightRatioScore).toFixed(2)  || 0}}</h1>
                  <h2>综合评分</h2>
                </div>
              </div>
            </div>
            <div class="tableBox">
              <vxe-grid
                :data="item.supplierList"
                :id="`tb_cgsq_detail_${item.id}`"
                :custom-config="{ storage: true }"
                :columns="viewDetailList4"
                min-height="100"
                ref="table4"
              >
                <template #rowNum="{rowIndex}">
                  <span>{{ rowIndex + 1 }}</span>
                </template>
              </vxe-grid>
            </div>
          </div>

        </div>
      </div>
    </app-page>
  </template>
  
  <script src="./index.js" />
  <style scoped lang="less" src="./index_scoped.less"></style>
  
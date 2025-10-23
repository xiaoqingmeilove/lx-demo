<template>
  <div class="page-quotation-details">
    <div class="q-header">
      <div class="bg">
        <div class="name item">
          <div class="label">
            <i class="el-icon-user"></i>
            <span>供应商名称</span>
          </div>
          <div class="val">{{form.supplierName}}</div>
        </div>
      </div>
      <div class="bg">
        <div class="amount item">
          <div class="label">
            <i class="el-icon-tickets"></i>
            <span>报价总金额</span>
          </div>
          <div class="val">¥ &nbsp; {{form.amount}}</div>
        </div>
      </div>
    </div>
    <sub-title title="报价明细">
      <template #beforeIcon>
        <i :class=" formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.cgmx = !formDataShow.cgmx"></i>
      </template>
    </sub-title>
    <vxe-grid
      v-show="formDataShow.cgmx"
      :data="form.detailList"
      :id="`tb_cgsq_detail_${userInfo.userId}`"
      :custom-config="{ storage: true }"
      :columns="columns"
      ref="table"
      min-height="180"
      max-height="600"
    >
      <template #rowNum="{rowIndex}">
        <span>{{ rowIndex + 1 }}</span>
      </template>
    </vxe-grid>
    <sub-title title="投标文件">
      <template #beforeIcon>
        <i :class=" formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.cgmx = !formDataShow.cgmx"></i>
      </template>
    </sub-title>
    <FilelistList
      v-bind="$attrs"
      v-on="$listeners"
      :readOnly="true"
      :showEditName="false"
      :file-list="[...(form.fileList || [])]"
    >
      <template #buttons>
        <slot name="buttons"></slot>
      </template>
      <template #operations="data">
        <slot name="operations" v-bind="{ ...data }"></slot>
      </template>
    </FilelistList>
  </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

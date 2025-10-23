<template>
  <!-- 添加非常规 -->
  <app-page>
    <div class="view-section header">
      <div style="padding-right: 6px">手动物料产品</div>
      <div>
        <span>已添加{{ (detailList && detailList.length) || 0 }}条物料</span>
        <i
          class="el-icon-close"
          @click="close"
          style="padding-left: 10px; font-size: 20px;cursor: pointer;"
        ></i>
      </div>
    </div>
    <table-section style="border-radius: 0">
      <div class="app-table-container" style="width: 460px" auto>
        <div class="app-table-header">
          <sub-title title="添加物料"></sub-title>
        </div>
        <div class="app-table-body">
          <data-form
            :items="descItems"
            :form-data="addProductForm"
            :editable="true"
            :source-list="sourceList"
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            ref="addProductForm"
          >
            <template #select_tree="{ item }">
              <el-select-tree
                v-model="addProductForm[item.field]"
                style="width: 100%;"
                filterable
                clearable
                check-strictly
                :data="sourceList[item.source]"
                :props="{label:'label',value:'id',children:'children'}"
                @change="onInputBlurFormChange({ item })"
              ></el-select-tree>
            </template>
          </data-form>
        </div>
      </div>
      <div class="app-table-container" style="flex:1" auto>
        <div class="app-table-header">
          <sub-title title="等效物料清单"></sub-title>
          <vxe-toolbar class="app-table-toolbar">
            <template #buttons>
              <el-input
                v-model="search.model"
                placeholder="型号"
                style="width: 150px"
                size="small"
              >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-input
                v-model="search.standard"
                placeholder="规格"
                style="width: 150px; margin-right: 12px"
                size="small"
              >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <page-button
                content="搜索"
                @click="searchPriceClick(1)"
              ></page-button>
              <page-button @click="searchReset">重置</page-button>
            </template>
          </vxe-toolbar>
        </div>
        <div class="app-table-body">
          <vxe-grid
            :data="priceData"
            :columns="priceColumns"
            ref="table1"
            height="auto"
            @radio-change="priceCellClick"
            :row-config="{ isCurrent: true, isHover: true, highlight: true }"
            :radio-config="{ labelField: 'name', trigger: 'row' }"
          ></vxe-grid>
        </div>
        <div class="app-table-footer">
          <vxe-pager
            :current-page.sync="pagination.currentPage"
            :page-size.sync="pagination.pageSize"
            :total="pagination.total"
            @page-change="pageChange"
          ></vxe-pager>
        </div>
      </div>
    </table-section>
    <footer style="padding: 15px 0">
      <page-button content="确定" @click="submit"></page-button>
      <page-button content="取消" @click="close" theme="default"></page-button>
    </footer>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

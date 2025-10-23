<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_zxbj_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      ></search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? '模板一览表'">
          </sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
            </template>
            <template #tools>
              <table-tools
                :default-columns="defaultColumns"
                @ok="onToolOk"
              ></table-tools>
            </template>
          </vxe-toolbar>
        </div>
        <div class="app-table-body">
          <vxe-grid
            :data="tableData"
            :id="`tb_template_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            @cell-dblclick="onCellDbClick"
            ref="table"
            height="auto"
          >
        </vxe-grid>
        </div>
      </div>
    </table-section>
  </app-page>
</template>
<script src="./index.js"></script>

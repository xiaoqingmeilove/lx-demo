<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_gggl_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      ></search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title high :title="$route.meta.title ?? ''"> </sub-title>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button
                content="发布公告"
                class="page-button-red"
                @click="editNotice" type="text" color="red" style="margin-left: 36px;" >
                <template #img><svg-icon icon-class="" style="margin-right: 5px" /></template>
              </page-button>
              <page-button content="导出" @click="exportExec" type="text" style="margin-left: 36px;" >
                <template #img><svg-icon icon-class="educe" style="margin-right: 5px" /></template>
              </page-button>
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
            :id="`tb_gggl_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            ref="table"
            height="auto"
          >
            <template #cz="{ row, rowIndex }">
              <page-button
                type="text"
                @click="
                showDetail(row)"
                >详情</page-button
              >
              <page-button type="text" @click="deleteNotice(row)"
                >删除</page-button
              >
            </template>
          
        </vxe-grid>
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
    <vxe-modal
      show-zoom
      resize
      v-model="noticeVisible"
      width="50%"
      height="80%"
      title="发布公告"
      :maskClosable="false"
      destroy-on-close
      @close="noticeClose"
    >
    <notice-modal v-if="noticeVisible" :editNoticeState="editNoticeState" :form="noticeForm" @close="noticeClose" @ok="issueOk" :saveEdit="true"></notice-modal>
  </vxe-modal>
   
  </app-page>
</template>
<script src="./index.js"></script>


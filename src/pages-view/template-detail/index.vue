<template>
  <app-page>
    <bill-btns :form="form" >
      <template #buttons>
        <page-button theme="special" @click="editState = true" v-if="!editState"
          >修改</page-button
        >
        <page-button v-if="editState" @click="editState = false"
          >保存</page-button
        >
        <page-button>通过</page-button>
        <page-button>驳回</page-button>
        <page-button>发布中标公告</page-button>
      </template>
    </bill-btns>

    <div class="view-section" auto>
      <data-form
        :items="descItems"
        :form-data="form"
        :editable="editState"
        :source-list="descSourceList"
        :rules="rulesobj"
        ref="dataForm"
      ></data-form>

      <sub-title title="询价清单">
        <template #beforeIcon>
          <i
            :class="
              formDataShow.xjqd ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
            "
            @click="formDataShow.xjqd = !formDataShow.xjqd"
          ></i>
        </template>
      </sub-title>
      <data-form
        :items="descItems"
        :form-data="form"
        v-show="formDataShow.xjqd"
        :editable="editState"
        :source-list="descSourceList"
        :rules="rulesobj"
        ref="dataForm"
      ></data-form>
      <sub-title title="操作记录">
        <template #beforeIcon>
          <i
            :class="
              formDataShow.czjl ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
            "
            @click="formDataShow.czjl = !formDataShow.czjl"
          ></i>
        </template>
        <template #buttons>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons> </template>
            <template #tools>
              <table-tools
                :default-columns="defaultColumns"
                @ok="onToolOk"
              ></table-tools>
            </template>
          </vxe-toolbar>
        </template>
      </sub-title>
      <vxe-grid
        v-if="formDataShow.czjl"
        :data="[]"
        :id="`tb_template_list_${userInfo.userId}`"
        :custom-config="{ storage: true }"
        :columns="columns"
        ref="table"
        height="660"
      >
        </vxe-grid>
      <sub-title>
        <template #title>
          附件操作
          <el-badge
            v-if="descSourceList.fileList.length"
            :value="descSourceList.fileList.length"
            class="item"
          >
          </el-badge>
        </template>
        <template #beforeIcon>
          <i
            :class="
              formDataShow.fjcz ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
            "
            @click="formDataShow.fjcz = !formDataShow.fjcz"
          ></i>
        </template>
      </sub-title>
      <bill-filelist-group
        v-show="formDataShow.fjcz"
        :read-only="false"
        :bill-id="form.id"
        :bill-type="fileBillTpye"
        ref="fileList"
        :menuCode="menuCode"
        @filelist-update="onFilelistUpdate"
      >
      </bill-filelist-group>
    </div>
  </app-page>
</template>
<script src="./index.js"></script>

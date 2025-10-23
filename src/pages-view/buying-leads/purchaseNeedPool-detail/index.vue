<template>
  <app-page>
    <bill-btns :form="form" title="需求池流水号" >
      <template #state>
        <span>{{form.sourcingStateName ?? ''}}</span>
      </template>
      <template #buttons>
        <template v-if="id">
          <page-button
            theme="special"
            @click="editForm"
            v-if="!editState && showBtn('edit')"
            >修改</page-button
          >
          <page-button v-if="showBtn('save') && editState" @click="submit(2)"
            >保存</page-button
          >
          <page-button
            v-if="editState && showBtn('editClose')"
            theme="default"
            @click="cancel"
            >{{ showBtn("editClose")?.btnName ?? "取消" }}</page-button
          >
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('closePage')">{{
          showBtn("closePage")?.btnName ?? "关闭"
        }}</page-button>
      </template>
    </bill-btns>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <data-form
            :items="descItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            ref="dataForm"
          ></data-form>
          <sub-title title="采购明细内容">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cgmx = !formDataShow.cgmx"
              ></i>
            </template>
          </sub-title>
          <data-form
          v-if="formDataShow.cgmx"
            :items="descItems1"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj1"
            ref="dataForm1"
          ></data-form>
          <sub-title title="寻源信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.xyxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.xyxx = !formDataShow.xyxx"
              ></i>
            </template>
          </sub-title>
          <data-form
          v-if="formDataShow.xyxx"
            :items="descItems2"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj2"
            ref="dataForm2"
          ></data-form>
          <sub-title title="采购执行">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cgzx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cgzx = !formDataShow.cgzx"
              ></i>
            </template>
          </sub-title>
          <data-form
          v-if="formDataShow.cgzx"
            :items="descItems3"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj3"
            ref="dataForm3"
          ></data-form>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            :bill-type="fileBillTpye"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

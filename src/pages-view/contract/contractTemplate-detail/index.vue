<template>
  <app-page>
    <bill-btns :form="form" title="模版编码" filed="billNo">
      <template #state>
        <span v-if="form.enableFlag === 1 && id" style="color:#81e6ae">启用</span>
        <span v-if="form.enableFlag === 0 && id" style="color:#ff9d9d">停用</span>
      </template>
      <template #content>
        <data-form
          class="page-form"
          :items="billDescItems"
          :showTool="false"
          :form-data="form"
          :editable="false"
          labelWidth="80px"
        ></data-form>
      </template>
      <template #buttons>
        <template v-if="id">
          <template v-if="editState">
            <page-button v-if="showBtn('save')" @click="editSave">保存</page-button>
            <page-button v-if="showBtn('cancel')" @click="cancel">取消</page-button>
          </template>
          <template v-else>
            <page-button v-if="showBtn('start') && form.enableFlag === 0" @click="setStatus(1)">启用</page-button>
            <page-button v-if="showBtn('stop') && form.enableFlag === 1" @click="setStatus(0)">停用</page-button>
            <page-button v-if="showBtn('edit')" @click="editClick">修改</page-button>
          </template>
        </template>
        <template v-else>
          <page-button v-if="showBtn('addSave')" @click="addSave">保存</page-button>
        </template>
        <page-button v-if="showBtn('close')" @click="$tabs.close()">关闭</page-button>
      </template>
    </bill-btns>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <div class="pane-content">
            <data-form
              :items="descItems"
              :form-data="form"
              :editable="editState"
              :source-list="descSourceList"
              :rules="rules"
              @hidden:select="onInputBlurFormChange"
              @change:select="onInputBlurFormChange"
              ref="dataForm"
            >
            </data-form>
            <sub-title title="模板编辑">
              <template #beforeIcon>
                <i
                  :class="
                    formDataShow.skxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                  "
                  @click="formDataShow.skxx = !formDataShow.skxx"
                ></i>
              </template>
            </sub-title>
            <div class="editor-content" v-show="formDataShow.skxx">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                class="editor-body"
                v-model="form.content"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
              />
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            bill-type="GYS"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>

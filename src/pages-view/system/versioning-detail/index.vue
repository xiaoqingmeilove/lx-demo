<template>
  <app-page>
    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" @tab-click="" flex>
        <template #buttons>

          <template v-if="id">
            <page-button
              v-if="editState === false "
              @click="editForm"
              >修改</page-button
            >
            <page-button
              v-if="editState === true"
              @click="submit(2)"
              >保存</page-button
            >
            <page-button
              v-if="editState === true "
              theme="default"
              @click="cancel"
              >取消</page-button
            >
          </template>
          <template v-else>
            <page-button @click="submit(1)">保存</page-button>
          </template>
          <page-button @click="$tabs.close()">关闭</page-button>


        </template>

        <el-tab-pane name="first">
          <span slot="label">新增内容</span>
          <div class="tab-content-container detailed-container">
            <div class="title-buttons">
              <sub-title title="基本信息"></sub-title>
            </div>
            <data-form
              :items="descItems"
              :form-data="form"
              :editable="editState"
              ref="dataForm"
            > 
              <template #select_tree="{ item }">
                <template v-if="!editState">
                  <div class="popup-form--span">
                    <span class="data-form--value" :title="bindTreeContent(item)">
                      {{ bindTreeContent(item) }}
                    </span>
                  </div>
                </template>
                <template v-else> 
                  <el-select-tree
                    v-model="form[item.field]"
                    class="form--selecttree"
                    size="small"
                    filterable
                    clearable
                    check-strictly
                    node-key="id"
                    :props="{label:'versionNumber'}"
                    :data="versionList" 
                  >
                  </el-select-tree>
                </template>
              </template>
            </data-form>  
            <table-section ref="tableSection">
              <div class="app-table-container" auto>
                <div class="app-table-body" style="margin-top: 10px" >
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="addEditor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                  />
                  <Editor
                    class="editor-body"
                    v-model="form.details"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onAddCreated"
                  />
                </div>
              </div>
            </table-section>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </app-page>
</template>

<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

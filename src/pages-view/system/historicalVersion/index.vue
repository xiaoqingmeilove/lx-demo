<template>
  <div class="page">
    <div class="page-left">
      <el-tree style="max-height:calc(100%-30px);"
        class="left-tree-cont"
        default-expand-all
        highlight-current
        node-key="id" 
        :data="versionTree"
        :props="{label:'versionNumber', value: 'id'}"
        :expand-on-click-node="false"
        @node-click="nodeClick"
        ref="versionTree"
      />
    </div>
    <div class="page-right">
      <div class="page-right-header">
        {{selversion.versionNumber}}
        <span class="time">{{selversion.releaseDate}}</span>
      </div>
      <div class="page-right-body">
        <Editor
          class="editor-main"
          v-model="selversion.details"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
          v-if="editorFlag"
        />
      </div>
    </div>
  </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>

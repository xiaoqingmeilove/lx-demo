<template>
  <div class="note">
    <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
            class="note-toolbar"
        />
        <Editor
           style="height: 100%; overflow-y: hidden;"
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            class="note-editor"
        />
  </div>
</template>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
export default {
  components: { Editor, Toolbar },
  data() {
        return {
            html: '',
            editor: null,
            editorConfig: { placeholder: '请输入内容...',autoFocus:true, MENU_CONF:{
              uploadImage:{
                base64LimitSize: 5 * 1024,
                customUpload: this.updateImage,
              }
            }},
            toolbarConfig:{
              toolbarKeys:['headerSelect','blockquote','|','bold', 'underline','italic','color','bgColor',],
            },
            mode: 'default', // or 'simple'
        }
    },
    methods: {
      onCreated(editor){
        this.editor = Object.seal(editor);
      },
      updateImage(file, insertFn) {
        console.log(this.editor.getConfig(),'editor');
        let url = window.URL.createObjectURL(file);
        insertFn(url);
    },
    },
}
</script>

<style scoped lang="less">
 .note{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1 solid #ccc;
  .note-toolbar{
    width: 100%;
    /deep/.w-e-toolbar{
      .w-e-menu-tooltip-v5{
        padding:  0 5px !important;
      }
    }
  }
  .note-editor{
    height: 0;
    flex: 1;
  }
 }
</style>
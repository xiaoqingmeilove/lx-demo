<template>
  <div class="proclamation-page">
    <div class="notice-body">
      <el-form
        ref="form"
        label-width="130px"
        :rules="noticeRules"
        class="noticeForm"
        :model="noticeForm"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input
            v-model="noticeForm.title"
            style="width: 400px"
            :disabled="!editNoticeState"
          ></el-input>
        </el-form-item>
        <el-form-item label="接收人员" prop="receivingPersonnel">
          <el-radio-group
            v-model="noticeForm.receivingPersonnel"
            :disabled="!editNoticeState"
          >
            <el-radio label="all">全体用户</el-radio>
            <el-radio label="gys">供应商</el-radio>
            <el-radio label="yg">员工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公布官网" prop="officialWebsite">
          <el-radio-group
            v-model="noticeForm.officialWebsite"
            :disabled="!editNoticeState"
          >
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提醒方式" prop="remindType">
          <el-select
            v-model="noticeForm.remindType"
            placeholder="请选择提醒方式"
            style="width: 400px"
            :disabled="!editNoticeState"
          >
            <el-option label="站内消息" value="zn"></el-option>
            <el-option label="公众号" value="gzh"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公示截止时间" prop="deadline">
          <el-date-picker
            v-model="noticeForm.deadline"
            type="datetime"
            style="width: 400px"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="!editNoticeState"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公告详情" prop="content" class="form-content">
          <div class="editor-content">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="addEditor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              class="editor-body"
              v-model="noticeForm.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onAddCreated"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" v-if="editNoticeState">
      <page-button @click="close">取消</page-button>
      <page-button @click="post" theme="special">发布</page-button>
    </div>
  </div>
</template>
<script>
import XEUtils from "xe-utils";
import { mapState } from "vuex";
import moment from "moment";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  components: { Editor, Toolbar },
  props: ["editNoticeState", "form"],
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      noticeForm: {},
      noticeRules: {
        title: [{ required: true, message: "请输入公告标题" }],
        receivingPersonnel: [{ required: true, message: "请选择接收人员" }],
        remindType: [{ required: true, message: "请选择提醒方式" }],
        officialWebsite: [{ required: true, message: "请选择是否公布官网" }],
        deadline: [{ required: true, message: "请选择公示截止时间" }],
        content: [{ required: true, message: "请输入公告详情" }],
      },
      editor: null,
      addEditor: null,
      putEditor: null,
      toolbarConfig: {
        excludeKeys: ["fullScreen", "group-video", "emotion"],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        readOnly: true,
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            customUpload: this.updateImage,
          },
        },
      }, // 编辑器的配置对象
      mode: "default", // or 'simple'
    };
  },
  created() {
    this.noticeForm = XEUtils.clone(this.form, true);
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async post() {
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return false;
      }
      this.$emit("ok", this.noticeForm);
    },
    validFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
        });
      });
    },
    //富文本
    onAddCreated(editor) {
      this.addEditor = Object.seal(editor);
      if (!this.editNoticeState) {
        this.addEditor.disable();
      } else {
        this.addEditor.enable();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.proclamation-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .footer {
    padding: 15px;
    text-align: right;
  }
  // /deep/.vxe-modal--content {
  .notice-body {
    width: 100%;
    height: 0;
    flex: 1;
    .noticeForm {
      height: 100%;
      display: flex;
      flex-direction: column;
      /deep/.el-form-item__error {
        padding: 0;
        top: 70%;
      }
      .form-content {
        height: 0;
        flex: 1;
        /deep/.el-form-item__content {
          height: 100%;

          .editor-content {
            width: 100%;
            height: 100%;
            border: 1px solid #ccc;
            display: flex;
            flex-direction: column;
          }
          .editor-body {
            height: 0;
            flex: 1;
            overflow: auto;
          }
        }
      }
    }
  }
  // }
}
</style>

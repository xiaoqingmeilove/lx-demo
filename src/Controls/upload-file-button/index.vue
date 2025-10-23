<template>
  <div class="page-button file-button">
    <page-button
      class="file-button-btn"
      :type="type"
      :disabled="disabled"
      :icon="icon"
      :color="color"
      @click="onBtnClick"
    >
      <span v-if="content">{{ content }}</span>
      <slot name="content"></slot>
    </page-button>
    <input
      type="file"
      class="file-button--input"
      :multiple="multiple"
      :accept="accepts"
      @change="onFileChange"
      ref="input"
    />
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { ApiCommon } from "@/apis";

export default {
  name: "uploadFileButton",
  props: {
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "button",
    },
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: [String, Array],
      default: "*",
    },
  },
  computed: {
    accepts() {
      if (this.accept instanceof Array) {
        return this.accept.join(",");
      }
      return this.accept;
    },
  },
  methods: {
    onBtnClick() {
      this.$refs.input.click();
    },
    onFileChange(e) {
      const files = e.target.files;
      this.upload(files);
    },
    async upload(files) {
      let loadingInstance = null;
      if (this.showLoading) {
        loadingInstance = Loading.service({
          lock: true,
          text: "正在上传",
          spinner: "el-icon-loading",
        });
      }

      const responses = await this.doUpload(files);
      if (loadingInstance) {
        loadingInstance.close();
      }
      if (this.multiple) {
        const data = responses
          .filter((r) => r.code === 200)
          .map((res) => res.data);
        if (data.length > 0) {
          this.$emit("success", data);
        } else {
          this.$emit("fail");
          this.$message.error("上传文件失败!");
        }
      } else {
        const res = responses[0];
        if (res?.code === 200) {
          this.$emit("success", [res.data]);
        } else {
          this.$emit("fail");
          this.$message.error("上传文件失败!");
        }
      }
      this.$refs.input.value = null;
    },
    async doUpload(files) {
      const tasks = [];
      for (let i = 0; i < files.length; i++) {
        tasks.push(ApiCommon.uploadFile(files[i]));
      }
      return Promise.all(tasks);
    },
  },
};
</script>

<style lang="less">
.file-button {
  display: inline-block;
  padding: 0 !important;
  height: auto !important;
  background: none !important;
  border: none !important;
}
.file-button--input {
  display: none;
}
</style>

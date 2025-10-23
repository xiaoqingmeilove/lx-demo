<template>
  <div
    class="dropzone"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragleave"
    @drop.prevent="handleDrop"
    @click="onBtnClick"
    :style="{height: height? height : '150px'}"
  >
    <div v-if="!isDragging" class="dropzone-content">
      <p class="icon" v-if="showUploadIcon"><i class="el-icon-upload"></i></p>
      <p>将文件拖到此处，或 <span class="fontColor">点击上传</span></p>
      <input
        type="file"
        :multiple="multiple"
        :accept="accepts"
        @change="onFileChange"
        class="hidden-input"
        ref="input"
      />
    </div>
    <div v-else class="dragging-overlay">
      <p>释放文件开始上传</p>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import { ApiCommon } from "@/apis";

export default {
  name: "uploadDrag",
  props: {
    content: {
      type: String,
      default: "上传",
    },
    type: {
      type: String,
      default: "button",
    },
    icon: {
      type: String,
      default: null,
    },
    background: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    borderColor: {
      type: String,
      default: null,
    },
    theme: {
      type: String,
      default: null,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
    fixedSize: {
      type: [Number, String],
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
    showLoading: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: "center",
    },
    width: {
      type: [String, Number],
      default: null,
    },
    height: {
      type: [String, Number],
      default: null,
    },
    showUploadIcon: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    accepts() {
      if (this.accept instanceof Array) {
        return this.accept.join(",");
      }
      return this.accept;
    },
  },
  data() {
    return {
      isDragging: false,
    };
  },
  methods: {
    onBtnClick() {
      this.$refs.input.click();
    },
    // 拖拽进入时触发
    handleDragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },
    // 拖拽离开时触发
    handleDragleave() {
      this.isDragging = false;
    },
    // 文件释放时触发
    handleDrop(e) {
      e.preventDefault();
      const files = e.dataTransfer.files;
      this.upload(files);
      this.isDragging = false;
    },
    onBtnClick() {
      this.$refs.input.click();
    },
    onFileChange(e) {
      const files = e.target.files;
      this.upload(files);
    },
    async upload(files) {
      let loadingInstance = null
      if (this.showLoading) {
        loadingInstance = Loading.service({
          lock: true,
          text: '正在上传',
          spinner: 'el-icon-loading',
        })
      }

      const responses = await this.doUpload(files)
      if (loadingInstance) {
        loadingInstance.close()
      }
      if (this.multiple) {
        const data = responses.filter(r => r.code === 200).map(res => res.data)
        if (data.length > 0) {
          this.$emit('success', data)
        } else {
          this.$emit('fail')
          this.$message.error('上传文件失败!')
        }
      } else {
        const res = responses[0]
        if (res?.code === 200) {
          this.$emit('success', [res.data])
        } else {
          this.$emit('fail')
          this.$message.error('上传文件失败!')
        }
      }
      this.$refs.input.value = null
    },
    async doUpload(files) {
      console.log(files, "doUpload");
      const tasks = [];
      for (let i = 0; i < files.length; i++) {
        tasks.push(ApiCommon.uploadFile(files[i]));
      }
      return Promise.all(tasks);
    },
  },
};
</script>
<style scoped lang="less">
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  height: 150px;
  width: 100%;
  text-align: center;
  transition: border-color 0.3s;
  cursor: pointer;
  &:hover{
    border-color: var(--base-color);
  }
}

.dropzone.dragging {
  border-color: var(--base-color);
  background: rgba(33, 150, 243, 0.1);
}

.dropzone-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .icon{
    font-size: 60px;
    color: #C0C4CC;
  }
}

.dragging-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.hidden-input {
  display: none;
  width: 100%;
  height: 100%;
}
</style>
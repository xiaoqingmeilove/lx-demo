<template>
  <div
    class="dropzone"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragleave"
    @drop.prevent="handleDrop"
    @click="onBtnClick"
  >
    <div v-if="!isDragging" class="dropzone-content">
      <p class="icon"><i class="el-icon-upload"></i></p>
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

export default {
  name: "fileButtonDrag",
  props: {
    content: {
      type: String,
      default: "上传",
    },
    type: {
      type: String,
      default: "button",
    },
    multiple: {
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
      this.$emit('change', files);      
      this.isDragging = false;
      if(this.$refs.input) this.$refs.input.value = null;
    },
    onBtnClick() {
      this.$refs.input.click();
    },
    onFileChange(e) {
      const files = e.target.files;
      this.$emit('change', files);      
      this.$refs.input.value = null;
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
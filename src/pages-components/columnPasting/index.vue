<template>
  <vxe-modal
    title="列粘贴"
    v-model="visible"
    :mask="false"
    :resize="true"
    :position="{ top: '30vh', left: '43vw' }"
    destroy-on-close
    width="20vw"
    height="48vh"
    @close="lztClose"
  >
    <template #corner>
      <page-button @click="load" v-if="lztLoadText">加载</page-button>
      <page-button @click="lztOk">确定</page-button>
      <page-button theme="default" @click="lztClose">取消</page-button>
    </template>
    <div class="note">
      <el-input
        type="textarea"
        autosize
        placeholder="请输入"
        v-model="lztText"
        class="note-textarea"
        @focus="($event) => $event.target.select()"
      ></el-input>
    </div>
  </vxe-modal>
</template>
<script>
export default {
  name:"columnPasting",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    lztLoadText:{
      type: String,
      default: '',
    }
  },
  data() {
    return {
      lztText: "",
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.lztText = "";
      },
      immediate: true,
    },
  },
  methods: {
    load(){
      this.lztText = this.lztLoadText;
    },
    removeTrailingEmptyStrings(arr) {
      while (arr.length > 0 && arr[arr.length - 1] === "") {
        arr.pop();
      }
      return arr;
    },
    lztOk() {
      const lztList = this.lztText
        .replace(/\r\n/g, "\\n")
        .split("\n")
        .map((x) => x.trim());
      this.$emit("ok", this.removeTrailingEmptyStrings(lztList));
    },
    lztClose() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.note {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .note-textarea {
    height: 0;
    flex: 1;
    /deep/ .el-textarea__inner {
      height: 100% !important;
    }
  }
}
</style>
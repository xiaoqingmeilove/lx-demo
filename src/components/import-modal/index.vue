<template>
  <vxe-modal
    :title="title"
    v-model="visible"
    :mask="false"
    :resize="true"
    destroy-on-close
    width="60vw"
    height="466px"
    :show-footer="showFooter"
    @close="close"
  >
    <template v-if="$scopedSlots.content"></template>
    <div v-else class="content">
      <div class="card">
        <div class="card_title">
          <span class="num">1</span>
          <span>下载模板</span>
        </div>
        <div class="card-content">
          <page-button type="text" @click="downloadExcel">{{this.templateName}}</page-button>
        </div>
      </div>
      <div class="card">
        <div class="card_title">
          <span class="num">2</span>
          <span>整理数据</span>
        </div>
        <div class="card-content">
          <div>请先将数据整理进模板文件中，整理完成后再进行上传文件操作！</div>
          <div class="card-content-text">{{hintText}}</div>
        </div>
      </div>
      <div class="card">
        <div class="card_title">
          <span class="num">3</span>
          <span>上传文件</span>
        </div>
        <div class="card-content">
          <file-button-drag :accept="['.xls','.xlsx']" @change="onUploadChange"></file-button-drag>
          <div class="card-content-text" style="text-align:left">最多1个, 只能上传.xls,.xlsx文件</div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <template v-if="$scopedSlots.footer"></template>
      <template v-else>
        <page-button theme="white" @click="close">关闭</page-button>
      </template>
    </template>
  </vxe-modal>
</template>
<script>
import { downloadUrlFile } from "@/utils/utils";
export default {
  name: "importModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "批量导入"
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    templateUrl: {
      type: String,
      default: ""
    },
    templateName: {
      type: String,
      default: ""
    },
    hintText: {
      type: String,
      default: "单次导入上限10000条"
    }
  },
  data() {
    return {};
  },
  methods: {
    downloadExcel() {
      if (!this.templateUrl) return;
      downloadUrlFile(this.templateUrl);
    },
    onUploadChange(e) {
      if (e.length > 1) {
        // 多文件上传
        this.$message.error(`只能选择一个文件`);
        return;
      }
      if (!/\.(xls|xlsx)$/.test(e[0].name.toLowerCase())) {
        // 文件格式不对
        this.$message.error(`上传格式不正确，请上传.xls,.xlsx格式`);
        return false;
      }
      this.$emit("change", e);
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  height: 100%;
  padding: 10px 15px;
  .card {
    display: flex;
    flex-direction: column;
    width: 32%;
    height: 100%;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &_title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 18px 20px;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
      .num {
        color: #fff;
        background-color: var(--base-color);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        text-align: center;
      }
    }
    &-content {
      width: 100%;
      flex: 1;
      padding: 20px;
      color: #303133;
      &-text {
        margin-top: 20px;
        text-align: center;
        color: #999;
      }
    }
  }
}
</style>
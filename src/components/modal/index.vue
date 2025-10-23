<template>
  <el-dialog
    :visible="visible"
    :width="width"
    :modal="modal"
    :before-close="handleClose"
    :close-on-click-modal="closeModal"
    :show-close="showClose"
    :append-to-body="true"
    :modal-append-to-body="false"
    :top="top"
  >
    <template #title>
      <span class="el-dialog__title"> {{ title }}</span>
      <div class="headerTitle">
        <slot name="header-title"></slot>
      </div>
    </template> 
    <slot></slot>

    <div class="dialog-bnt" v-if="$slots.footer_bnt">
      <slot name="footer_bnt"></slot>
    </div> 
    <div class="dialog-bnt" v-else>
      <page-button @click="ok">{{ okTitle }}</page-button>
      <page-button @click="cancel" theme="default">{{ cancelTitle }}</page-button>
    </div>
    <div class="dialog-footer"><slot name="footer-title"></slot></div>
  </el-dialog>
</template>
 
<script>
/**
 * 基本参数
 *
 * title:               标题
 * ok-title:            确定按钮文本， 默认 “ 确认 ”
 * cancel-title         取消按钮文本， 默认 “ 取消 ”
 * width:               modal框宽度
 * visible:             是否显示
 * show-close           关闭图标是否显示
 * modal                遮罩层
 * close-modal:         点击遮罩层是否关闭
 *
 * 事件名称
 *
 * ok                   确定按钮回调
 * cancel               取消按钮回调
 * close                关闭回调
 *
 * slot 插槽
 *
 * header-title         头部标题区 **副标题** 的内容
 * footer-title         尾部 按钮下方区域  的内容
 * footer_bnt           尾部按钮、
 * 
 */
export default {
  name: "modal",
  props: {
    title: {
      type: String,
      default: "提示",
    },
    okTitle: {
      type: String,
      default: "确 定",
    },
    cancelTitle: {
      type: String,
      default: "取 消",
    },
    width: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    modal: {
      //遮罩层
      type: Boolean,
      default: true,
    },
    closeModal: {
      //点击遮罩层是否关闭
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: "15vh",
    },
  },
  methods: {
    // 确定
    ok() {
      this.$emit("ok");
    },
    // 取消
    cancel() {
      this.$emit("cancel");
    },
    // 关闭
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
@distance: 30px;
.paddign {
  padding-left: @distance;
  padding-right: @distance;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid #e0e0e0;
  .paddign();
  .el-dialog__headerbtn {
    right: @distance;
  }
  .el-dialog__title {
    color: #333333;
  }
  .headerTitle {
    font-size: 14px;
    padding-top: 6px;
    color: #aeaeae;
  }
}

/deep/ .el-dialog__body {
  .paddign();
}
.dialog-footer {
  width: 100%;
  font-size: 12px;
  cursor: pointer;
}
.dialog-bnt {
  width: 100%;
  padding: 20px 0;
}
</style>
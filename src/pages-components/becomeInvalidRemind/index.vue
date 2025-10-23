<template>
  <vxe-modal
    v-model="visible"
    :width="width"
    show-footer
    destroy-on-close
    @close="cancel"
    class="approval-modal"
  >
    <template #title>
      <img :src="require(`/static/images/icon-warn-fill@2x.png`)" alt="img" />
      <span class="del-title">作废提醒</span>
    </template>
    <template v-if="Object.keys(list).includes('billNo')">
      <div style="font-size: 14px; color: #333333; font-weight: 400">
        确定要作废 <span style="color: #ff4d4f">单据{{ list.billNo }}</span>
      </div>
    </template>
    <template v-else>
      <div class="top" style="color: #ff4d4f">
        作废后，以下进行中的关联单据及流程将一起作废
      </div>
      <div class="warp">
        <div class="main" v-for="(value, key, index) in list" :key="index">
          <div class="main-left">{{ key }}：</div>
          <div class="main-right">
            <div v-for="(i, j) in value" :key="j" style="margin-right: 15px">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="fillRemark" style="display: flex; margin-top: 10px">
      <el-input
        style="margin-right: 3px;flex:1"
        type="textarea"
        placeholder="请输入作废原因"
        :autosize="{ minRows: 3, maxRows: 6 }"
        v-model="remark"
      ></el-input>
      <i
        class="el-icon-circle-plus-outline"
        @click="infoModal = true"
        v-if="causeList.length"
      >
        <div
          @click.stop
          class="info-select"
          v-if="infoModal && causeList.length"
        >
          <div class="info-item-icon">
            <i class="el-icon-close" @click.stop="infoModal = false"></i>
          </div>
          <div class="info-item-body">
            <div
              v-for="(item, index) in causeList"
              :key="`${item.value}_${index}`"
              :title="item.label"
              @click.stop="infoModalChange(item.label)"
              class="info-item"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </i>
    </div>
    <template #footer>
      <page-button theme="default" @click="cancel">取消</page-button>
      <page-button @click="confirm">确认</page-button>
    </template>
  </vxe-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    fillRemark: {
      type: Boolean,
      default: false,
    },
    list: {
      type: [Object],
      default: () => {},
    },
    width: {
      type: [Number, String],
      default: 460,
    },
    causeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      remark: null,
      infoModal: false,
    };
  },
  methods: {
    infoModalChange(label) {
      this.remark = this.remark ? this.remark + "" + label : label;
    },
    confirm() {
      if (!this.remark && this.fillRemark) {
        this.$message.error("请填写作废原因");
        return;
      }
      this.infoModal = false;
      this.$emit("ok", this.remark);
    },
    cancel() {
      this.infoModal = false;
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less" scoped>
.del-title {
  vertical-align: 6px;
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
  line-height: 24px;
  color: #333333;
}
.warp {
  max-height: 360px;
  overflow: auto;
}
.top {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 20px;
}
.main {
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #595959;
  line-height: 26px;
  .main-left {
    width: 90px;
  }
  .main-right {
    width: 280px;
    display: flex;
    flex-wrap: wrap;
  }
}
.el-icon-circle-plus-outline {
  font-size: 20px;
  cursor: pointer;
  .info-select {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 220px;
    background-color: #fff;
    position: absolute;
    right: -200px;
    border-radius: 10px;
    .info-item-icon {
      text-align: right;
      font-size: 20px;
      padding: 3px 5px;
    }
    .info-item-body {
      flex: 1;
      overflow: auto;
    }
    .info-item {
      font-size: 14px;
      padding: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
  }
}
/deep/ .el-textarea__inner {
  padding: 5px;
}
/deep/ .vxe-modal--content {
  margin: 0 15px;
}
</style>
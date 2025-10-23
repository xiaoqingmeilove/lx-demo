<template>
  <div class="bill-btns-page">
    <div class="page-title">
      <el-tooltip class="item" effect="dark" content="返回一览表" placement="top" >
        <i class="el-icon-arrow-left"   style="font-size: 20px; font-weight: 600"   @click="goBack"></i>
      </el-tooltip>
      <div class="bill-name">
        <span class="title">{{ title }}</span>
        <span class="content">
          <span>{{ form[filed] ?? "" }}</span>
        </span>
        <div class="state">
          <template v-if="$scopedSlots.state">
            <slot name="state"></slot>
          </template>
          <template v-else>
            <bill-state :state="form.billState"></bill-state>
          </template>
        </div>
      </div>
      <div class="btns">
        <slot name="buttons"></slot>
      </div>
    </div>
    <template v-if="$scopedSlots.content">
      <slot name="content"></slot>
    </template>
    <template v-else>
      <data-form
        class="page-form"
        :items="descItems"
        :showTool="false"
        :form-data="form"
        :editable="false"
        labelWidth="80px"
      ></data-form>
    </template>

    <template v-if="$scopedSlots.steps">    
      <slot name="steps"></slot>
    </template>
  </div>
</template>

<script>
export default {
  name: "bill-btns",
  props: {
    title: {
      type: String,
      default: "单据号",
    },
    filed: {
      type: String,
      default: "billNo",
    },
    form: {
      type: Object,
      default: () => {},
    },
    jumpUrl: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      descItems: [
        { label: "创建人", field: "createUserName", type: "", width: "20%" },
        { label: "单据时间", field: "createTime", type: "", width: "20%" },
        { label: "提交时间", field: "submissionTime", type: "", width: "20%" },
        { label: "审核时间", field: "auditDate", type: "", width: "20%" },
      ],
    };
  },
  methods: {
    goBack() {
      if (this.jumpUrl) {
        this.$router.push({
          path: this.jumpUrl,
        });
      } else {
        let path = this.$route.path.split("-");
        if (path.length) {
          this.$router.push({
            path: path[0],
          });
        }
      }
    },
  },
};
</script>
<style lang="less">
.bill-btns-page {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #fff;
  .page-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    .bill-name {
      font-size: 20px;
      font-weight: 600;
      display: flex;
      flex-direction: row;
      padding-left: 8px;

      .title {
        margin-right: 15px;
      }
      .content {
        margin-right: 15px;
      }
    }
    .state {
      font-size: 14px;
      color: #a3a3a3;
      font-weight: 400;
      line-height: 24px;
    }
    .btns {
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
}
</style>

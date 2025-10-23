<template>
  <div class="approval-modal-view">
    <div class="approval-modal-view-body">
      <vxe-form
        :data="formModel"
        :rules="{}"
        title-width="120"
        title-align="right"
        :span="24"
        :title-colon="true"
        ref="form"
      >
        <vxe-form-item class-name="approval-opinion">
          <template #title>
            <label>审批意见</label>
          </template>
          <template #default>
            <vxe-textarea
              :rows="8"
              placeholder="请输入审批意见"
              v-model="opinion"
            ></vxe-textarea>
            <i class="el-icon-circle-plus-outline" @click="iconsClick" v-if="infoList.length">
              <div
                @click.stop
                class="info-select"
                v-if="infoModal && infoList.length"
              >
                <div
                  v-for="item in infoList"
                  :title="item.label"
                  @click.stop="infoModalChange(item.label)"
                  class="info-item"
                >
                  {{ item.label }}
                </div>
              </div>
            </i>
          </template>
        </vxe-form-item>

        <vxe-form-item v-if="operation === 1">
          <template #title>
            <label>审批时间</label>
          </template>
          <template #default>
            <span>{{ now }}</span>
          </template>
        </vxe-form-item>

        <vxe-form-item v-if="operation === 3">
          <template #title>
            <label>委托时间</label>
          </template>
          <template #default>
            <span>{{ now }}</span>
          </template>
        </vxe-form-item>

        <vxe-form-item v-if="operation === 1 && nextNodeVisible">
          <template #title>
            <label>需要上级审批</label>
          </template>
          <template #default>
            <vxe-checkbox
              v-model="toNext"
              @change="onToNextChange"
            ></vxe-checkbox>
          </template>
        </vxe-form-item>

        <vxe-form-item
          :span="12"
          v-if="operation === 1 && toNext && hasDynUser"
        >
          <template #title>
            <label>上级审批</label>
          </template>
          <template #default>
            <!-- <vxe-select v-model="dynuser" placeholder="请选择上级审批人" :option-groups="auditors" size="small"></vxe-select> -->
            <vxe-select
              v-model="dynuser"
              placeholder="请选择上级审批人"
              :disabled="!toNext"
            >
              <vxe-option
                v-for="item in bindAuditors"
                style="font-size: 16px"
                class-name="dynuser-vxeoption"
                :key="item.value"
                :value="item.value"
                :label="`${item.label} ${item.billNum}份/${item.detailNum}条`"
              ></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>

        <vxe-form-item :span="12" v-if="operation === 2">
          <template #title>
            <label>驳回节点</label>
          </template>
          <template #default>
            <vxe-select
              v-model="appNode"
              placeholder="请选择驳回节点"
              @change="onRejectNodeChange"
            >
              <vxe-option
                v-for="item in bindRejectNodes"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>

        <vxe-form-item
          :span="12"
          v-if="operation === 2 && bindRejectNodeUsers.length > 0"
        >
          <template #title>
            <label>节点成员</label>
          </template>
          <template #default>
            <!-- <vxe-select v-model="dynuser" placeholder="请选择上级审批人" :option-groups="auditors" size="small"></vxe-select> -->
            <vxe-select v-model="dynuser" placeholder="请选择驳回人">
              <vxe-option
                v-for="item in bindRejectNodeUsers"
                :key="item.value"
                :value="item.value"
                :label="`${item.label} ${item.billNum}份/${item.detailNum}条`"
              ></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>

        <vxe-form-item :span="12" v-if="operation === 3">
          <template #title>
            <label>委托人</label>
          </template>
          <template #default>
            <!-- <vxe-select v-model="dynuser" placeholder="请选择委托人" :option-groups="delegations" size="small"></vxe-select> -->
            <vxe-select v-model="dynuser" placeholder="请选择委托人">
              <vxe-option
                v-for="item in bindDelegations"
                :key="item.value"
                :value="item.value"
                :label="`${item.label} ${item.billNum}份/${item.detailNum}条`"
              ></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>

        <vxe-form-item :span="12" v-if="operation !== 4" >
          <template #title>
            <!-- <vxe-checkbox v-model="hasCirculation" @change="onCheckboxChange"> -->
              <span>传阅人</span>
            <!-- </vxe-checkbox> -->
          </template>
          <template #default>
            <!-- <vxe-select
              v-model="userIds"
              placeholder="请选择传阅人"
              multiple
              :option-groups="circulations"
              size="small"
              :disabled="!hasCirculation"
            ></vxe-select> -->
            <vxe-select
              v-model="userIds"
              placeholder="请选择传阅人"
              multiple
              
            >
            <!-- :disabled="!hasCirculation" -->
              <vxe-option
                v-for="item in bindCirculations"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>
      </vxe-form>
    </div>
    <div class="approval-modal-view-footer">
      <page-button @click="onOkClick">{{ btnText }}</page-button>
      <page-button theme="default" @click="onCloseClick">取消</page-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VXETable from "vxe-table";
import ApiWorkflow from "../apis";
import { mapState } from "vuex";

const apiWorkflow = new ApiWorkflow();

const BTN_TEXT = {
  1: "通过",
  2: "驳回",
  3: "委托",
  4:"不通过"
};

const OPER_ACTION = {
  1: "pass",
  2: "reject",
  3: "delegate",
  4:"nopass"
};

let timer = null;

export default {
  props: {
    operation: {
      type: Number,
      default: 1,
    },
    nodeParam: {
      type: String,
      default: "",
    },
    billId: {
      type: Number,
      default: -1,
    },
    billNo: {
      type: String,
      default: "",
    },
    controlRejectionFlag: {
      type: Number,
      default: 0,
    },
    rejectNodes: {
      type: Array,
      default: () => [],
    },
    auditors: {
      type: Array,
      default: () => [],
    },
    circulations: {
      type: Array,
      default: () => [],
    },
    // rejects: {
    //   type: Array,
    //   default: () => []
    // },
    delegations: {
      type: Array,
      default: () => [],
    },
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    btnText() {
      return BTN_TEXT[this.operation];
    },
    bindRejectNodes() {
      return this.rejectNodes.map((item) => {
        return {
          label: item.nodeName,
          value: item.nodeId,
          billNum: item.billNum ?? 0,
          detailNum: item.detailNum ?? 0,
        };
      });
    },
    bindRejectNodeUsers() {
      const rejectNode = this.rejectNodes.find(
        (item) => item.nodeId === this.appNode
      );
      return (rejectNode?.rejectUsers ?? []).map((item) => {
        return {
          label: item.nickName,
          value: item.userName,
          billNum: item.billNum ?? 0,
          detailNum: item.detailNum ?? 0,
        };
      });
    },
    bindAuditors() {
      return this.auditors.map((item) => {
        return {
          label: item.nickName,
          value: item.userName,
          billNum: item.billNum ?? 0,
          detailNum: item.detailNum ?? 0,
        };
      });
    },
    bindRejects() {
      const find = this.rejectNodes.find(
        (item) => item.nodeId === this.appNode
      );
      const rejectUsers = find.rejectUsers ?? [];
      return find
        ? rejectUsers.map((item) => {
            return {
              label: item.nickName,
              value: item.userName,
            };
          })
        : [];
    },
    bindDelegations() {
      return this.delegations.map((item) => {
        return {
          label: item.nickName,
          value: item.userName,
          billNum: item.billNum ?? 0,
          detailNum: item.detailNum ?? 0,
        };
      });
    },
    bindCirculations() {
      return this.circulations.map((item) => {
        return {
          label: item.nickName,
          value: item.userId,
        };
      });
    },
    hasDynUser() {
      return /(dyn.*user)/.test(this.nodeParam);
    },
  },

  data() {
    const dict = this.$store.state.Common.dict;
    return {
      infoList: (dict["Common_phrases"] ?? []).map((d) => {
        return { label: d.dictLabel, value: d.dictLabel };
      }),
      approvalPrompt: null,
      infoModal: false,
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      formModel: {},
      opinion: "",

      dynuser: null,
      userIds: [],
      hasCirculation: false,

      appNode: null,
      rejects: [],

      workflowFn: {
        pass: async () => {
          // VXETable.modal.confirm({
          //   title: '提示',
          //   content: '是否通过?',
          // }).then(async type => {
          //   if (type === 'confirm') {
          const { billId, billNo, userIds, nodeParam = "", opinion } = this;
          const conditionParm = {
            isNext: this.toNext ? 1 : 0,
          };
          let dynuserProp = (nodeParam || "").match(/(dyn.*user)/)?.[1];
          if (dynuserProp) {
            conditionParm[dynuserProp] = this.toNext ? this.dynuser || "" : "";
          }
          let isNext = (nodeParam || "").indexOf("isNext") > -1;
          if (!isNext) {
            delete conditionParm.isNext;
          }
          const loading = this.$loading({
            lock: true,
            text: "正在提交",
            spinner: "el-icon-loading",
          });
          const res = await apiWorkflow.pass(
            billId,
            billNo,
            conditionParm,
            userIds,
            opinion
          );
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$emit("ok", {
              operation: this.operation,
            });
          } else {
            this.$message.error(res.message || "操作失败!");
          }
          loading.close();
          //   }
          // })
        },
        reject: async () => {
          const { billId, billNo, userIds, opinion } = this;
          const rejectNode = this.rejectNodes.find(
            (item) => item.nodeId === this.appNode
          );
          if (!rejectNode) {
            console.error("没有找到驳回节点");
            return;
          }
          let nodeParam = rejectNode.nodeParam || "";
          const dynuserProp = nodeParam.match(/(dyn.*user)/)?.[1] ?? "";
          if (dynuserProp && !this.dynuser) {
            this.$message.error("请选择驳回人");
            return;
          }
          const conditionParm = {
            nodeId: this.appNode,
          };
          if (dynuserProp) {
            conditionParm[dynuserProp] = this.dynuser;
          }

          const loading = this.$loading({
            lock: true,
            text: "正在提交",
            spinner: "el-icon-loading",
          });
          const res = await apiWorkflow.reject(
            billId,
            billNo,
            conditionParm,
            userIds,
            opinion
          );
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$emit("ok", {
              operation: this.operation,
            });
          } else {
            this.$message.error(res.message || "操作失败!");
          }
          loading.close();
        },
        delegate: async () => {
          // VXETable.modal.confirm({
          //   title: '提示',
          //   content: '是否委托?',
          // }).then(async type => {
          //   if (type === 'confirm') {
          const { billId, billNo, userIds, nodeParam = "", opinion } = this;
          const loading = this.$loading({
            lock: true,
            text: "正在提交",
            spinner: "el-icon-loading",
          });
          const res = await apiWorkflow.delegateAssginee({
            billId,
            billNo,
            userName: this.dynuser,
            userIds,
            entrustOpinion: opinion,
          });
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$emit("ok", {
              operation: this.operation,
            });
          } else {
            this.$message.error(res.message || "操作失败!");
          }
          loading.close();
          //   }
          // })
        },
        nopass: async () => {
          console.log("nopass");
          const { billId, billNo, userIds, nodeParam = "", opinion } = this;
          const conditionParm = {
            isNext: this.toNext ? 1 : 0,
          };
          let dynuserProp = (nodeParam || "").match(/(dyn.*user)/)?.[1];
          if (dynuserProp) {
            conditionParm[dynuserProp] = this.toNext ? this.dynuser || "" : "";
          }
          let isNext = (nodeParam || "").indexOf("isNext") > -1;
          if (!isNext) {
            delete conditionParm.isNext;
          }
          const loading = this.$loading({
            lock: true,
            text: "正在提交",
            spinner: "el-icon-loading",
          });
          const res = await apiWorkflow.nopass(
            billId,
            billNo,
            conditionParm,
            userIds,
            opinion
          );
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$emit("ok", {
              operation: this.operation,
            });
          } else {
            this.$message.error(res.message || "操作失败!");
          }
          loading.close();
        }
      },

      nextNodeVisible: true,
      toNext: true,
    };
  },
  created() {
    if (this.rejectNodes && this.rejectNodes.length > 0) {
      this.appNode = this.rejectNodes[0].nodeId;
    }

    if (this.operation === 1) {
      const auditorDefault = this.auditors.find((x) => x.tag === 1);
      if (auditorDefault) this.dynuser = auditorDefault.userName;
    }
    if (this.operation === 2) {
      const firstAppNode = this.appNode[0];
      if (
        firstAppNode &&
        firstAppNode.rejectUsers &&
        firstAppNode.rejectUsers.length > 0
      ) {
        this.rejects = firstAppNode.rejectUsers;
      }
    }
    if (this.operation === 3) {
      const delegationDefault = this.delegations.find((x) => x.tag === 1);
      if (delegationDefault) this.dynuser = delegationDefault.userName;
    }

    const cirDefault = this.circulations.filter((x) => x.tag === 1);
    //const rejectDefault = this.rejects.filter(x => x.tag === 1)
    if (cirDefault.length > 0) {
      this.hasCirculation = true;
      this.userIds = cirDefault.map((item) => item.userId);
    }

    const nodeParam = this.nodeParam || "";
    if (!nodeParam) {
      this.nextNodeVisible = false;
      this.toNext = false;
    } else {
      this.nextNodeVisible = false;
      if (/(dyn.*user)/.test(nodeParam)) {
        this.toNext = true;
      }
      if (nodeParam.indexOf("isNext") > -1) {
        this.nextNodeVisible = true;
        this.toNext = false;
      }
    }
    console.log(this.auditors, "this.auditors");

    timer = setInterval(() => {
      this.now = moment().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
  },
  destroyed() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  },
  methods: {
    iconsClick() {
      this.infoModal = true;
    },
    infoModalChange(label) {
      this.opinion = this.opinion + '' + label;
      this.infoModal = false;
    },
    onCloseClick() {
      this.$emit("close");
    },
    onOkClick() {
      if (this.operation === 1) {
        if (
          !this.dynuser &&
          this.toNext &&
          /(dyn.*user)/.test(this.nodeParam)
        ) {
          this.$message.error("请选择上级审批!");
          return;
        }
      } else if (this.operation === 2) {
        if (!this.appNode) {
          this.$message.error("请选择驳回节点!");
          return;
        }
        if (this.rejects.length > 0 && !this.dynuser) {
          this.$message.error("请选择节点成员!");
          return;
        }
        let opinionStr = this.opinion.trim();
        if(!opinionStr && this.controlRejectionFlag){
          this.$message.error("请填写审批意见!");
          return;
        }
      } else if (this.operation === 3) {
        if (!this.dynuser) {
          this.$message.error("请选择委托人!");
          return;
        }
      }else if (this.operation === 4) {
        let opinionStr = this.opinion.trim();
        if(!opinionStr){
          this.$message.error("请填写审批意见!");
          return;
        }
      }
      const fn = this.workflowFn[OPER_ACTION[this.operation]];
      fn && fn();
    },
    onCheckboxChange(e) {
      const { value } = e;
      if (!value) {
        this.userIds = [];
      }
    },
    onToNextChange(e) {
      const { value } = e;
      if (!value) {
        this.dynuser = null;
      }
    },

    onRejectNodeChange({ value }) {
      // const find = this.rejects.find(x => x.nodeId === value)
      // if (find) {
      //   this.rejects = find.rejectUsers ?? []
      // }
      this.dynuser = null;
    },
  },
};
</script>

<style lang="less">
.approval-modal {
  .approval-modal-view {
    .approval-opinion {
      display: flex;
      .el-icon-circle-plus-outline {
        position: relative;
        font-size: 20px;
        .info-select {
          width: 200px;
          height: 200px;
          background-color: #fff;
          overflow: auto;
          position: absolute;
          right: -230px;
          border-radius: 10px;
          .info-item {
            font-size: 15px;
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .vxe-form--item-title {
        margin-bottom: auto;
      }
    }
    .vxe-form .vxe-form--item-inner {
      min-height: 0;
    }
    .vxe-form--item-content {
      flex: 1;
      width: 0;
      textarea {
        max-width: 100%;
      }
    }
  }
}
.approval-modal-view-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  height: 36px;
  > button {
    width: 72px;
    margin: 0 30px;
  }
}
.dynuser-vxeoption {
  font-size: 15px;
}
</style>

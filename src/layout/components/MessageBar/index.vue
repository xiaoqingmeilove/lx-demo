<template>
  <div class="message-cont">
    <div class="message-tab-btn">
      <el-tooltip effect="dark" content="标记为全部已读" placement="bottom-end">
        <i
          class="el-icon-brush"
          style="transform: rotate(180deg)"
          @click="readall = true"
        />
      </el-tooltip>
      <el-tooltip effect="dark" content="关闭" placement="bottom-end">
        <i class="el-icon-close" @click="$emit('close')" />
      </el-tooltip>
    </div>
    <el-tabs v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane :name="i.value" v-for="(i, j) in tabsTitle" :key="j">
        <span slot="label">{{ i.name }}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="message-card">
      <div
        v-for="(i, j) in msgCard"
        :key="j"
        style="position: relative"
        @click="moduleDetail(i)"
      >
        <div style="float: left">
          <el-tooltip
            effect="dark"
            :content="i.readflag ? '已读' : '未读'"
            placement="top-start"
          >
            <span
              class="title-dot"
              :style="{
                background: i.readflag ? 'rgb(200,200,200)' : 'var(--base-color)',
              }"
            />
          </el-tooltip>
          <span
            class="message-title-text"
            :style="{ color: i.readflag ? '#A3A3A3' : 'black' }"
            >{{ i.title }}</span
          >
          <!-- <el-tag v-if="!i.readflag" style="float:right" size="small" effect="plain">未读</el-tag> -->
        </div>
        <div style="clear: both" />
        <div class="right-tags">
          <div
            class="triangle-tags"
            :style="{
              'border-top':
                i.module.split('-')[0] == '日程组件'
                  ? '40px solid #52C41A'
                  : '40px solid var(--base-color)',
            }"
          ></div>
          <div
            class="text-tags"
            :style="{
              background:
                i.module.split('-')[0] == '日程组件' ? '#52C41A' : 'var(--base-color)',
            }"
          >
            {{ i.module.split("-")[0] }}
          </div>
        </div>
        <div
          class="message-box"
          :ref="'msgb' + i.id"
          :style="{ 'line-clamp': i.showall ? 1000 : 3 }"
        >
          {{ i.remark }}
        </div>
        <div class="message-base">
          <span>{{ i.senderName}}  ({{ i.senderCode  }})</span>
          <el-divider direction="vertical" />
          <span>{{ i.createTime }}</span>
          <page-button
            class="message-show"
            type="text"
            v-if="i.ellipsis"
            @click.stop="i.showall = !i.showall"
            :loading="loading"
            @click="readMessage(i)"
            >{{ i.showall ? "收起" : "展开" }}
          </page-button>
        </div>
      </div>
    </div>
    <div class="message-bottom">
      <div style="float: left">
        <el-switch
          style="margin-right: 8px"
          v-model="unread"
          @change="
            (v) => {
              unread = v;
              getMessageList(v);
            }
          "
        />只显示未读
        <el-switch style="margin-right: 8px"  v-model="info" @change="infoChange" />是否开启提醒
      </div>
     
      <div style="float: right; margin-right: 18px">
        <el-tooltip effect="dark" content="消息设置" placement="bottom-end">
          <i class="el-icon-setting" />
        </el-tooltip>
        <el-tooltip effect="dark" content="消息中心" placement="bottom-end">
          <i class="el-icon-chat-line-square" @click="toMessage()" />
        </el-tooltip>
      </div>
    </div>
    <el-dialog
      title="全部已读"
      :visible.sync="readall"
      :append-to-body="true"
      :modal-append-to-body="false"
      width="350px"
      @close="readall = false"
    >
      <span>确认全部消息已读</span>
      <span slot="footer" class="dialog-footer">
        <page-button @click="readall = false">取 消</page-button>
        <page-button type="primary" @click="readAllMessage()"
          >确 定</page-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ApiMessage } from "@/apis";
const apiMessage = new ApiMessage();
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      info:localStorage.getItem("rnable_reminder") === "false" ? false:true,
      currentTab: "-1",
      unread: false,
      readall: false,
      tabsTitle: [
        { name: "最新", value: "-1" },
        { name: "待处理", value: "10" },
        { name: "@我的", value: "7" },
        { name: "我关注的", value: "9" },
      ],
      msgCard: [],
      type: -1,
      messageData: [],
      loading: false,
    };
  },
  methods: {
    infoChange(e){
      localStorage.setItem("rnable_reminder", this.info);
    },
    ...mapMutations("Message", ["updateCalId"]),
    moduleDetail(obj) {
      this.readMessage(obj);
      this.$emit("close");
      if (/calendar/.test(obj.url)) {
        if (/calendar/.test(location.hash)) {
          this.updateCalId(/.*id=(\d+)/.exec(obj.url)[1]);
        } else {
          this.$router.replace({
            name: "myTodo_calendar",
            params: { id: obj.url.replace(/^.*id=/, "") },
          });
        }
      } else {
        this.$router.push({ path: obj.url });
      }
    },
    handleClick(obj) {
      this.type = this.tabsTitle[obj.index].value - 0;
      this.getMessageList(this.unread);
    },
    getStrLen(str) {
      // let num = 0
      // for (let i=0; i<str.split('').length; i++) {
      //     str[i].charCodeAt(0)<=255?num++:num+=2
      // }
      // return num
      let context = document.createElement("canvas").getContext("2d");
      return context.measureText(str).width;
    },
    getMessageList(isread = false) {
      let data = {
        noticeType: this.type,
        page: 1,
        size: 20,
      };
      isread ? (data.readFlag = 0) : "";
      apiMessage
        .getInnerMessage(data)
        .then((res) => {
          if (res.code === 200) {
            console.log(res.data,'消息卡片');
            this.messageData = res.data.records;
            this.msgCard = res.data.records.map((i) => {
              return Object.assign(
                JSON.parse(
                  i.content.replace(/\r\n/g, "\\n").replace(/\n/g, "\\n")
                ),
                {
                  readflag: i.readFlag,
                  module: i.moduleName + (i.funcEvent ? "-" + i.funcEvent : ""),
                  showall: false,
                  id: i.id,
                  createTime: i.createTime,
                  senderCode:i.senderCode,
                  senderName:i.senderName
                }
              );
            });
            setTimeout(() => {
              this.getMsgDom();
            }, 300);
          }else{
            this.$message.error("获取数据异常");
          }
        })
        // .catch((err) => {
        //   this.$message.error("获取数据异常");
        // });
    },
    readAllMessage() {
      if (
        this.messageData.length &&
        this.messageData.some((i) => !i.readFlag)
      ) {
        // this.messageData.map(i=>i.id)  //无参数
        apiMessage.updateAllMessageStatus().then((res) => {
          this.$message[res.code == 200 ? "success" : "warning"](res.message);
          this.getMessageList(this.unread);
        });
      } else {
        this.$message.warning("无未读消息");
      }
      this.readall = false;
    },
    readMessage(obj) {
      if (!obj.readflag) {
        this.loading = true;
        apiMessage.updateMessageStatus([obj.id]).then((res) => {
          this.loading = false;
          // this.$message[res.code==200?'success':'warning'](res.message)
          this.getMessageList(this.unread);
        });
      }
    },
    toMessage() {
      this.$router.push("/myTodo/message");
      this.$emit("close");
    },
    getMsgDom() {
      this.msgCard.forEach((i) => {
        let dom = this.$refs["msgb" + i.id][0];
        i.ellipsis = (dom?.clientHeight || 0) + 1 < (dom?.scrollHeight || 0);
        this.$forceUpdate();
      });
    },
  },
  created() {
    this.getMessageList();
  },
  mounted() {
    setTimeout(() => {
      this.getMsgDom();
    }, 600);
  },
};
</script>
<style lang="less">
.message-cont {
  position: relative;
  padding: 15px 20px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  .message-card {
    height: calc(100% - 85px);
    overflow: auto;
    padding: 0 6px;
    box-sizing: border-box;
    > div {
      cursor: pointer;
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
      height: auto;
      border: 1px solid #e6e6e6;
      margin-bottom: 10px;
      border-radius: 10px;
      box-shadow: 10px 0px 5px -5px #eef3fc, -10px 0px 5px -5px #eef3fc;
    }
    .message-title {
      margin-top: 5px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-button {
        padding: 0;
      }
    }
    .message-base {
      display: flex;
      color: rgb(193, 193, 193);
      margin-top: 4px;
      // font-size:14px
      padding-left: 12px;
      span {
        font-size: 13px;
      }
    }
    .message-box {
      padding-left: 11px;
      width: calc(100% - 120px);
      min-height: 66px;
      white-space: pre-line;
      margin-top: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      font-size: 16px !important;
      color: #797979;
      line-height: 22px;
      word-break: break-all;
    }
    .message-show {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
  .message-bottom {
    width: calc(100% - 20px);
    height: 36px;
    position: absolute;
    bottom: 0;
    i {
      margin-left: 15px;
      font-size: 20px;
      cursor: pointer;
      background: var(--base-color);
      color: white;
      border-radius: 12px;
      padding: 3px;
      box-sizing: border-box;
    }
  }
}
.message-tab-btn {
  position: absolute;
  top: 18px;
  right: 15px;
  z-index: 99;
  i {
    margin-left: 18px;
    font-size: 24px;
    cursor: pointer;
  }
}
.title-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  vertical-align: 5px;
}
.message-title-text {
  margin-left: 4px;
  font-size: 19px;
  font-weight: auto;
  font-family: "Source Han Sans SC-Regular", "Source Han Sans SC";
}
.right-tags {
  position: absolute;
  right: 0;
  top: 0;
  width: 112px;
  height: 40px;
  display: flex;
  .triangle-tags {
    width: 0;
    height: 0;
    border-left: 18px solid transparent;
    border-radius: 5px 0 0 0;
    position: relative;
    left: 1.4px;
  }
  .text-tags {
    width: 102px;
    height: 40px;
    line-height: 40px;
    color: white;
    text-align: center;
    padding-right: 5px;
    box-sizing: border-box;
    font-size: 19px;
    border-radius: 0 5px 5px 5px;
  }
}
</style>

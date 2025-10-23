<template>
  <div class="navbar">
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <div class="quick-menus">
          <ul>
            <li v-if="dict['consult_tel']">
              <div class="quick-menu-item">
                <svg-icon
                  slot="reference"
                  class="quick-menu-item-icon"
                  icon-class="consult"
                  size="24"
                  title="咨询电话"
                  v-model="zxValue"
                  @click="zxClick"
                ></svg-icon>
              </div>
            </li>
            <li>
              <div class="quick-menu-item">
                <svg-icon
                  class="quick-menu-item-icon"
                  icon-class="memo"
                  fill="#a3a3a3"
                  size="24"
                  title="抄写板"
                  @click="cxValue = true"
                ></svg-icon>
              </div>
            </li>
            <li>
              <div class="quick-menu-item">
                <template v-if="!isFullscreen">
                  
                  <svg-icon
                    class="quick-menu-item-icon"
                    icon-class="fullscreen"
                    fill="#a3a3a3"
                    size="24"
                    title="全屏"
                    @click="onQuickMeniItemClick('fullscreen')"
                  ></svg-icon>
                </template>
                <template v-else>
                  <svg-icon
                    class="quick-menu-item-icon"
                    icon-class="fullscreen-exit"
                    fill="#a3a3a3"
                    size="24"
                    title="还原"
                    @click="onQuickMeniItemClick('fullscreen')"
                  ></svg-icon>
                </template>
              </div>
            </li>
            <li>
              <div class="quick-menu-item">
                <svg-icon
                  class="quick-menu-item-icon"
                  icon-class="info"
                  fill="#a3a3a3"
                  size="24"
                  title="更新日志"
                  @click="$router.push({ path: '/system/historicalVersion' })"
                ></svg-icon>
              </div>
            </li>
            <li>
              <div class="quick-menu-item">
                <svg-icon
                  class="quick-menu-item-icon"
                  :class="unreadnum ? 'blink' : ''"
                  icon-class="bell"
                  fill="#a3a3a3"
                  size="24"
                  title="消息列表"
                  @click="onQuickMeniItemClick('msg')"
                ></svg-icon>
                <el-badge
                  class="quick-menu-badge"
                  :value="unreadnum"
                ></el-badge>
              </div>
            </li>
            
          </ul>
        </div>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
      >
        <div class="avatar-wrapper">
          <!-- <img src="../assets/default_avatar.png" class="user-avatar" /> -->
          <div class="user-avatar-icon"></div>
          <span class="user-name">{{ userInfo.nickName }}</span>
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="avatar-dropdown">
          <el-dropdown-item
            v-for="(item, index) in dropdownList"
            :key="index"
            class="avatar-dropdown-item"
            :disabled="item.disabled"
            :divided="item.divided"
            @click.native="onDropdownItemClick(item)"
          >
            <span>{{ item.title }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <adjust-price></adjust-price>

    <vxe-modal
      v-model="colorModalVisible"
      title="修改基础色"
      width="500px"
      height="240px"
      :show-close="false"
      :destroy-on-close="true"
      :z-index="1001"
    >
      <template #default>
        <base-color-picker
          @close="colorModalVisible = false"
        ></base-color-picker>
      </template>
    </vxe-modal>

    <vxe-modal
      v-model="passwdModalVisable"
      title="修改密码"
      width="500px"
      height="auto"
      :show-close="false"
      :destroy-on-close="true"
      :z-index="1001"
    >
      <template #default>
        <ModifyPassword @close="passwdModalVisable = false" />
      </template>
    </vxe-modal>
    <vxe-modal
      title="抄写板"
      v-model="cxValue"
      :mask="false"
      :resize="true"
      :lock-view="false"
      destroy-on-close
      :position="{ top: 10, left: '60vw' }"
      width="376"
      height="418"
    >
      <transcribed-version></transcribed-version>
    </vxe-modal>
    <vxe-modal
      v-if="dict['consult_tel']"
      title="咨询电话"
      v-model="zxValue"
      :mask="false"
      :resize="true"
      :lock-view="false"
      :show-close="false"
      destroy-on-close
      :position="{ top: 1, left: '65vw' }"
      width="260"
      className="zx-modal"
    >
      <div class="zx-tel">
        <div v-for="item in dict['consult_tel']">
          <span v-html="item.dictValue"></span>: 
          <span v-html="item.dictLabel"></span>
        </div>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import screenfull from "screenfull";
import Hamburger from "./Hamburger";
import Screenfull from "./Screenfull";
import BaseColorPicker from "./BaseColorPicker";
import ModifyPassword from "./ModifyPassword";
import transcribedVersion from "./TranscribedVersion/index.vue";

export default {
  components: {
    Hamburger,
    Screenfull,
    BaseColorPicker,
    ModifyPassword,
    transcribedVersion,
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.User.userInfo ?? {},
      unreadnum: (state) => state.Message.unread || "",
      dict: (state) => state.Common.dict,
    }),
    ...mapGetters(["sidebar", "device"]),
    showOaIcon(){
      let item = (this.dict['sys_config'] ?? []).find((x) => x.dictValue == "ty_account_opening" && x.dictLabel == 'true')
      return item ?? false;
    },
  },
  data() {
    return {
      oaValue: false,
      zxValue: localStorage.getItem("telephone_show") === "true" ? true:false,
      cxValue: false,
      dropdownList: [
        { title: "个人资料", disabled: true, divided: false, event: null },
        {
          title: "修改密码",
          disabled: false,
          divided: true,
          event: "password",
        },
        { title: "修改基础色", disabled: false, divided: true, event: "color" },
        { title: "退出", disabled: false, divided: true, event: "logout" },
      ],

      colorModalVisible: false,
      passwdModalVisable: false,

      dropdownEvents: {
        password: (item) => {
          this.passwdModalVisable = true;
        },
        color: (item) => {
          this.colorModalVisible = true;
        },
        logout: async (item) => {
          // const currentComponent = this.getCurrentComponent()
          // const { closePage } = currentComponent ?? {}
          // console.log(currentComponent,'currentComponent');
          // if (closePage) {
          //   closePage(this.logout)
          // } else {
          //   this.logout()
          // }
          //   const result = currentComponent.closePage()
          //   if (!result) return
          this.$confirm("是否退出系统?", "提示", {
            closeOnClickModal: false,
          }).then((res) => {
            this.logout();
          });
        },
      },
      blinkClass: "blink",
      isFullscreen: false,
    };
  },
  created(){
    let list = [undefined,null,'']
    if(list.includes(localStorage.getItem("telephone_show"))){
      this.zxValue = true;
    }
  },
  methods: {
    zxClick(){
      this.zxValue = !this.zxValue;
      localStorage.setItem("telephone_show", this.zxValue);
    },
    ...mapActions("User", ["userLogout"]),
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },

    onDropdownItemClick(item) {
      this.dropdownEvents[item.event] && this.dropdownEvents[item.event]();
    },

    logout() {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.userLogout();
    },

    screenfullChange() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    quickMethods() {
      return {
        fullscreen: () => {
          if (screenfull.enabled) {
            screenfull.toggle();
          }
        },
        msg: () => {
          this.$emit("togMsg");
        },
      };
    },
    onQuickMeniItemClick(command) {
      const fn = this.quickMethods()[command];
      fn && fn();
    },
  },
  mounted() {
    if (screenfull.enabled) {
      screenfull.on("change", this.screenfullChange);
    }
    //webSocketInit(this,window)
  },
  beforeDestroy() {},
  destroyed() {
    if (screenfull.enabled) {
      screenfull.off("change", this.screenfullChange);
    }
  },
};
</script>

<style lang="scss" scoped>
.zx-modal {
  ::v-deep .vxe-modal--box {
    background-color: var(--base-color);
    .vxe-modal--header {
      height: 25px;
      .vxe-modal--header-title {
        text-align: center;
        padding: 0;
        color: #fff;
        font-size: 16px;
      }
      .vxe-modal--header-right {
        padding: 0;
      }
    }
    .vxe-modal--content {
      padding: 0;
      .zx-tel {
        height: 100%;
        font-size: 15px;
        color: #fff;
        text-align: center;
      }
    }
  }
}
.navbar {
  height: 54px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #595959;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;
      height: 100%;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        height: 100%;

        .user-avatar {
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 10px;
        }
        .user-name {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          max-width: 112px;
          font-size: 14px;
          line-height: 18px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .todo-message-bell {
      display: inline-block;
      cursor: pointer;
      .todo-message-count {
        position: relative;
        left: 45px;
        bottom: 25px;
        transform: scale(0.8);
        z-index: 10;
      }
      .todo-message-icon {
        font-size: 25px;
        position: relative;
        bottom: 11px;
      }
    }
  }

  .right-menu {
    .quick-menus {
      display: flex;
      align-items: center;
      > ul {
        height: 36px;
        > li {
          float: left;
          margin: 0 3px;
          width: 36px;
          height: 36px;
        }
      }
      .quick-menu-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: relative;
        .svg-icon {
          color: var(--base-color);
        }
      }
      .quick-menu-item-icon {
        cursor: pointer;
      }
      .quick-menu-badge {
        position: absolute;
        right: -6px;
        top: -12px;
        pointer-events: none;
      }
    }
  }
}
.avatar-dropdown {
  .avatar-dropdown-item {
    text-align: center;
    .el-color-picker {
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 定义blink类*/
.blink {
  color: #dd4814;
  animation: blink 1s linear 6;
}
</style>
<style lang="scss">
.user-avatar-icon {
  position: relative;
  width: 36px;
  height: 36px;
  margin-right: 3px;
  border-radius: 50%;
  background: var(--base-color);
  &::before {
    content: "";
    position: absolute;
    inset: 5px 0 0;
    margin: 0 auto;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
  }
  &::after {
    content: "";
    position: absolute;
    inset: auto 0 5px;
    margin: 0 auto;
    width: 20px;
    height: 10px;
    border-radius: 16px;
    background: #fff;
  }
}
</style>

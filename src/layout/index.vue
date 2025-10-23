<template>
  <div :class="[classObj]" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">

      <navbar @togMsg="opmsg = true" />
      <router-tab
        class="app-router-tab"
        :restore="true"
        :dragsort="false"
        :tabs="tabs"
        v-if="baseDataLoaded"
        ref="currentPage"
      >
        <template #default="tab">

          <el-tooltip class="item" effect="dark" :content="tab.tips" placement="top">
            <span class="router-tab__item-title">{{tab.title}}</span>
          </el-tooltip>
          <i
            v-if="tab.closable"
            class="router-tab__item-close"
            @click.prevent="tab.close"
          />
        </template>
      </router-tab>
    </div>

    <page-drawer
      v-model="opmsg"
      direction="rtl"
      class="message-bar"
      width="540px"
      destroy-on-close
      :z-index="1000"
      @closed="opmsg = false"
    >
      <MessageBar @close="opmsg = false" />
    </page-drawer>
  </div>
</template>

<script>
import {
  AppMain,
  Navbar,
  Sidebar,
  RightPanel,
  Settings,
  MessageBar,
} from "./components";
//import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapMutations, mapActions } from "vuex";
import { MsgClient, UnreadClient } from "@/utils/message-clients";

import { ApiUser, ApiBasic } from "@/apis";
const apiUser = new ApiUser();
const apiBasic = new ApiBasic();

let timer = null;

export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    Sidebar,
    RightPanel,
    Settings,
    MessageBar,
  },
  //mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
      theme: state => state.Theme.theme ?? {},
      userInfo: state => state.User.userInfo ?? {}
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  data() {
    return {
      tabs: [{ to: "/homePage", title: "首页", closable: false }],
      baseDataLoaded: false,
      opmsg: false,

      msgClient: null,
      unreadClient: null,
    };
  },
  created() {
    console.log("layout created");
    this.getBaseData();

    // apiUser.userMenu().then(res => {
    //   console.log('res', res)
    // })
  },
  mounted() {
    this.init();
    this.toSupplierRegister();
  },
  destroyed() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    this.msgClient && this.msgClient.close();
    this.unreadClient && this.unreadClient.close();
    console.log("layout destroyed");
  },
  methods: {
    ...mapMutations('Theme', ['changeBaseColor', 'setTheme', 'setBaseColor']),
    ...mapActions("Common", ["getDicts", "getPCAData"]),
    ...mapActions("Theme", ['getTheme']),
    toSupplierRegister(){
      this.$nextTick(async ()=>{
        const {userType, roleKeys} = this.userInfo;
        if(userType === "03" && roleKeys && roleKeys.length === 1 && roleKeys[0] === "default_supplier" ){
          const res = await apiBasic.getSupplierList();
          if(res.code === 200 && res.data && res.data.records && res.data.records.length){
            const obj = res.data.records[0];
            const {id, authStatus} = obj;
            if(id && authStatus === "DATA_INCOMPLETE"){
              this.$router.push({ path: `/supplier/supplierRegister-detail/detail/${id}` });
            }
          }
        }
      })
    },
    init() {
      this.initMessageServer();
    },
    initMessageServer() {
      const { token } = this.$store.state.User;
      if (!token) return;
      this.msgClient = new MsgClient(this, token?.value);
      this.unreadClient = new UnreadClient(this, token?.value);
      this.msgClient.init();
      this.unreadClient.init();
    },
    getBaseData() {
      Promise.all([
        this.getDicts(),
        this.getTheme()
      ]).then(res => {
        this.baseDataLoaded = true
        const theme = localStorage.getItem(`${this.userInfo.userName}_local_theme`)
        if (theme) {
          this.setBaseColor(JSON.parse(theme))
        }
      })
      //this.getPCAData();
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.app-router-tab {
  flex: 1;
  height: 0;
}
.message-bar ::v-deep .el-drawer__header {
  display: none;
}
.app-layout-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 28px;
  padding: 0 15px;
  background: none;
  font-size: 14px;
  color: #a3a3a3;
  span {
    + span {
      margin-left: 100px;
    }
  }
}
</style>

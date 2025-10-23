<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img :src="theme.sidebarLogoIcon" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img :src="theme.sidebarLogo" class="sidebar-logo" />
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState({
      theme: state => state.Theme.theme || {}
    }),
  },
  data() {
    return {
      title: '营销管控平台',
      //logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
      showLogo: false,
      logo: '',
      logo2: ''
    }
  },
  created() {
    const showLogo = eval(process.env.VUE_APP_SHOWLOGO)
    this.showLogo = showLogo
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 76px;
  line-height: 76px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      // width: 32px;
      // height: 32px;
      // height: 100%;
      width: 100%;
      vertical-align: middle;
      border-bottom: solid 1px #f2f2f2;
    }

    & .sidebar-title {
      display: inline-block;
      height: 100%;
      width: 100%;
      margin: 0;
      color: #fff;
      background: var(--base-color);
      font-weight: 600;
      line-height: 76px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>

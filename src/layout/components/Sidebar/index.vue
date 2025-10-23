<template>
  <div :class="{'has-logo':showLogo}">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        @open="onOpen"
      >
        <sidebar-item v-for="route in menus" :key="route.menuId" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>

    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import Hamburger from '../Hamburger/index.vue'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo, Hamburger },
  computed: {
    ...mapState({
      menus: state => state.User.menus ?? [],
    }),
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    onOpen(index) {
      const find = this.menus.find(item => item.menuId === Number(index))
      if (find && find.path) {
        this.$router.push({
          path: find.path
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>

.hamburger-container {
  margin: 10px 0;
  cursor: pointer;
}
</style>
<style lang="less">
.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  transform: rotateZ(-90deg);
}
</style>

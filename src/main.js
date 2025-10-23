import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementUI from 'element-ui'
import './styles/element-variables.scss'
import ElSelectTree from 'el-select-tree'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VueLazyLoad from 'vue-lazyload'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import { SetupVXETable } from '@/config/vxetable.config'

import './icons' // icon
import './permission' // permission control

import $web_config from '@/config/web.config'

import components from '@/components'
import Controls from '@/Controls'

import vue2NumberInput from 'vue2-number-input'
import 'vue2-number-input/dist/style.css'

import RouterTab from 'vue-router-tab'
import 'vue-router-tab/dist/lib/vue-router-tab.css'
import 'vue-image-lightbox/dist/vue-image-lightbox.min.css'

import '@wangeditor/editor/dist/css/style.css'

import './styles.js'
//import './static/page-font/iconfont.js'
import directives from './directives'
import { setupMicro } from './micro'
import PortalVue from 'portal-vue'



Vue.use(ElementUI)
Vue.use(ElSelectTree)
Vue.use(VXETable)
Vue.use(components)
Vue.use(Controls)
Vue.use(RouterTab)
Vue.use(VueLazyLoad)
Vue.use(vue2NumberInput)
Vue.use(directives)
Vue.use(PortalVue)

SetupVXETable(VXETable)

Vue.config.productionTip = false



Vue.prototype.getCurrentComponent = function() {
  return this.$tabs.$children[1].$children.find(item => item.$route.fullPath === this.$route.fullPath)
}


const ctor = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

console.log($web_config.Version)

export default ctor

// 启动 qiankun 微前端
setupMicro({ store, router })

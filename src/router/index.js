import Vue from 'vue'
import Router from 'vue-router'
import { beforeEach, afterEach } from './handles'

import ROUTE_INDEX from './modules/index'

import ROUTE_DEFAULT from './modules/default'
import ROUTE_UI from './modules/ui'
import ROUTE_SYSTEM from './modules/system'
import ROUTE_SERVICE from './modules/service'

import ROUTE_BUYINGLEAD from './modules/buyingLead'
import ROUTE_SUPPLIER from './modules/supplier'
import ROUTE_MATERIAL from './modules/material'
import ROUTE_SEEK from './modules/seek'
import ROUTE_BID from './modules/bid'
import ROUTE_CONTRACT from './modules/contract'
import ROUTE_PURCHASEORDER from './modules/purchaseOrder'
import ROUTE_BIDDINGMANAGEMENT from './modules/biddingManagement'
import ROUTE_SRM from './modules/srm'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export const constantRoutes = [
  ...ROUTE_INDEX,
  ...ROUTE_UI,
  ...ROUTE_DEFAULT,
  ...ROUTE_SYSTEM,
  ...ROUTE_SERVICE,
  ...ROUTE_BUYINGLEAD,
  ...ROUTE_SUPPLIER,
  ...ROUTE_MATERIAL,
  ...ROUTE_SEEK,
  ...ROUTE_BID,
  ...ROUTE_CONTRACT,
  ...ROUTE_PURCHASEORDER,
  ...ROUTE_BIDDINGMANAGEMENT,
  ...ROUTE_SRM
]

const createRouter = () => new Router({
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

beforeEach(router)
afterEach(router)

export default router


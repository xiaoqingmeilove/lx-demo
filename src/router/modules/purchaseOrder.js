import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/enquiryPlan',
        name: 'purchaseOrder_enquiryPlan',
        component: () => import('@/pages-view/purchaseOrder/enquiryPlan/index.vue'),
        meta: { title: '要货计划' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/orderApply',
        name: 'purchaseOrder_orderApply',
        component: () => import('@/pages-view/purchaseOrder/orderApply/index.vue'),
        meta: { title: '采购订单' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/orderApply-detail/:id?',
        name: 'purchaseOrder_orderApply_detail',
        component: () => import('@/pages-view/purchaseOrder/orderApply-detail/index.vue'),
        meta: { title: '采购订单详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/createOrder',
        name: 'purchaseOrder_createOrder',
        component: () => import('@/pages-view/purchaseOrder/create-order/index.vue'),
        meta: { title: '创建采购订单' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/orderConfim',
        name: 'purchaseOrder_orderConfim',
        component: () => import('@/pages-view/purchaseOrder/orderConfim/index.vue'),
        meta: { title: '采购订单确认' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/orderConfim-detail/detail/:id?',
        name: 'purchaseOrder_orderConfim_detail',
        component: () => import('@/pages-view/purchaseOrder/orderConfim-detail/index.vue'),
        meta: { title: '采购订单确认详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/delivery',
        name: 'purchaseOrder_delivery',
        component: () => import('@/pages-view/purchaseOrder/delivery/index.vue'),
        meta: { title: '发货单' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/delivery-detail/detail/:id?',
        name: 'purchaseOrder_delivery_detail',
        component: () => import('@/pages-view/purchaseOrder/delivery-detail/index.vue'),
        meta: { title: '发货单详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/takeDelivery',
        name: 'purchaseOrder_takeDelivery',
        component: () => import('@/pages-view/purchaseOrder/takeDelivery/index.vue'),
        meta: { title: '收货单' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/purchaseOrder/takeDelivery-detail/detail/:id?',
        name: 'purchaseOrder_takeDelivery_detail',
        component: () => import('@/pages-view/purchaseOrder/takeDelivery-detail/index.vue'),
        meta: { title: '收货单详情', key: 'fullPath' },
      },
    ]
  },
]

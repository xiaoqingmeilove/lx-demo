import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/purchaseNeedNotice',
        name: 'buyingLead_purchaseNeedNotice',
        component: () => import('@/pages-view/buying-leads/purchaseNeedNotice/index.vue'),
        meta: { title: '采购需求看板' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/seekNotice',
        name: 'buyingLead_rseekNotice',
        component: () => import('@/pages-view/buying-leads/seekNotice/index.vue'),
        meta: { title: '寻源统计看板' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/purchaseApply',
        name: 'buyingLead_purchaseApply',
        component: () => import('@/pages-view/buying-leads/purchaseApply/index.vue'),
        meta: { title: '采购申请' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/purchaseApply-detail/:id?',
        name: 'buyingLead_purchaseApply_detail',
        component: () => import('@/pages-view/buying-leads/purchaseApply-detail/index.vue'),
        meta: { title: '采购申请详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/purchaseProject',
        name: 'buyingLead_purchaseProject',
        component: () => import('@/pages-view/buying-leads/purchaseProject/index.vue'),
        meta: { title: '项目申请' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/purchaseProject-detail/:id?',
        name: 'buyingLead_purchaseProject_detail',
        component: () => import('@/pages-view/buying-leads/purchaseProject-detail/index.vue'),
        meta: { title: '项目申请详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/purchaseNeedPool',
        name: 'buyingLead_purchaseNeedPool',
        component: () => import('@/pages-view/buying-leads/purchaseNeedPool/index.vue'),
        meta: { title: '采购需求池' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/purchaseNeedPool-detail/:id?',
        name: 'buyingLead_purchaseNeedPool_detail',
        component: () => import('@/pages-view/buying-leads/purchaseNeedPool-detail/index.vue'),
        meta: { title: '采购需求池详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/buyingLead/demandSource',
        name: 'buyingLead_demandSource',
        component: () => import('@/pages-view/buying-leads/demandSource/index.vue'),
        meta: { title: '需求溯源' },
      },
    ]
  },
]

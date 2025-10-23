import Layout from '@/layout'

export default [

  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/enquiryApply',
        name: 'seekContrast_enquiryApply',
        component: () => import('@/pages-view/seekContrast/enquiryApply/index.vue'),
        meta: { title: '询价申请' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/enquiryApply-detail/:id?',
        name: 'seekContrast_enquiryApply_detail',
        component: () => import('@/pages-view/seekContrast/enquiryApply-detail/index.vue'),
        meta: { title: '询价申请详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/enquiryHall',
        name: 'seekContrast_enquiryHall',
        component: () => import('@/pages-view/seekContrast/enquiryHall/index.vue'),
        meta: { title: '询价邀请' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/enquiryHall-detail/:id?',
        name: 'seekContrast_enquiryHall_detail',
        component: () => import('@/pages-view/seekContrast/enquiryHall-detail/index.vue'),
        meta: { title: '询价邀请详情', key: 'fullPath' },
      },
    ]
  }
  ,
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/resultConfim',
        name: 'seekContrast_resultConfim',
        component: () => import('@/pages-view/seekContrast/resultConfim/index.vue'),
        meta: { title: '比价' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/resultConfim-detail/:id?',
        name: 'seekContrast_resultConfim_detail',
        component: () => import('@/pages-view/seekContrast/resultConfim-detail/index.vue'),
        meta: { title: '比价详情', key: 'fullPath' },
      },
    ]
  }
  ,
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/supplierApply',
        name: 'seekContrast_supplierApply',
        component: () => import('@/pages-view/seekContrast/supplierApply/index.vue'),
        meta: { title: '供应商报价单' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/supplierApply-detail/:id?',
        name: 'seekContrast_supplierApply_detail',
        component: () => import('@/pages-view/seekContrast/supplierApply-detail/index.vue'),
        meta: { title: '供应商报价单详情', key: 'fullPath' },
      },
    ]
  }
  ,
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/winBidList',
        name: 'seekContrast_winBidList',
        component: () => import('@/pages-view/seekContrast/winBidList/index.vue'),
        meta: { title: '询价结果中标明细' },
      },
    ]
  }
  ,
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/supplierQuoteList',
        name: 'seekContrast_supplierQuoteList',
        component: () => import('@/pages-view/seekContrast/supplierQuoteList/index.vue'),
        meta: { title: '供应商报价明细' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/seekWinBid',
        name: 'seekContrast_seekWinBid',
        component: () => import('@/pages-view/seekContrast/seekWinBid/index.vue'),
        meta: { title: '询价中标查询' },
      },
    ]
  }
  ,
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/seekContrast/seekWinBid-detail/:id?',
        name: 'seekContrast_seekWinBid_detail',
        component: () => import('@/pages-view/seekContrast/seekWinBid-detail/index.vue'),
        meta: { title: '询价中标详情', key: 'fullPath' },
      },
    ]
  }
]

import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/bidInvite',
        name: 'bidding_bidInvite',
        component: () => import('@/pages-view/bidding/bidInvite/index.vue'),
        meta: { title: '竞价邀请' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/bidInvite-detail/detail/:id?',
        name: 'bidding_bidInvite_detail',
        component: () => import('@/pages-view/bidding/bidInvite-detail/index.vue'),
        meta: { title: '竞价邀请详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/bidApply',
        name: 'bidding_bidApply',
        component: () => import('@/pages-view/bidding/bidApply/index.vue'),
        meta: { title: '竞价报名' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/bidApply-detail/detail/:id?',
        name: 'bidding_bidApply_detail',
        component: () => import('@/pages-view/bidding/bidApply-detail/index.vue'),
        meta: { title: '竞价报名详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/biddingHall',
        name: 'bidding_biddingHall',
        component: () => import('@/pages-view/bidding/biddingHall/index.vue'),
        meta: { title: '竞价大厅' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/biddingHall-detail/detail/:id?',
        name: 'bidding_biddingHall_detail',
        component: () => import('@/pages-view/bidding/biddingHall-detail/index.vue'),
        meta: { title: '竞价大厅详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/biddingHallBack',
        name: 'bidding_biddingHallBack',
        component: () => import('@/pages-view/bidding/biddingHallBack/index.vue'),
        meta: { title: '竞价大厅(后台)' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/bidPricing',
        name: 'bidding_bidPricing',
        component: () => import('@/pages-view/bidding/bidPricing/index.vue'),
        meta: { title: '核价' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/bidPricing-detail/detail/:id?',
        name: 'bidding_bidPricing_detail',
        component: () => import('@/pages-view/bidding/bidPricing-detail/index.vue'),
        meta: { title: '核价详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/supplierApply',
        name: 'bidding_supplierApply',
        component: () => import('@/pages-view/bidding/supplierApply/index.vue'),
        meta: { title: '供应商竞价报价单' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/supplierApply-detail/detail/:id?',
        name: 'bidding_supplierApply_detail',
        component: () => import('@/pages-view/bidding/supplierApply-detail/index.vue'),
        meta: { title: '供应商竞价报价单详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/supplierQuoteList',
        name: 'bidding_supplierQuoteList',
        component: () => import('@/pages-view/bidding/supplierQuoteList/index.vue'),
        meta: { title: '供应商竞价报价明细' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/winBidList',
        name: 'bidding_winBidList',
        component: () => import('@/pages-view/bidding/winBidList/index.vue'),
        meta: { title: '竞价中标明细' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/winBidPricing',
        name: 'bidding_winBidPricing',
        component: () => import('@/pages-view/bidding/winBidPricing/index.vue'),
        meta: { title: '竞价中标查询' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/bidding/winBidPricing-detail/detail/:id?',
        name: 'bidding_winBidPricing_detail',
        component: () => import('@/pages-view/bidding/winBidPricing-detail/index.vue'),
        meta: { title: '竞价中标查询详情', key: 'fullPath' },
      },
    ]
  },
]

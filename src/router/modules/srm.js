import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/finance/purchase-order-management',
        name: 'finance_modal_1',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '采购订单管理', keepAlive: false }
      },
      {
        path: '/finance/estimated-payable-orders',
        name: 'finance_modal_2',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '暂估应付单管理', keepAlive: false }
      },
      {
        path: '/finance/reconciliation-statements',
        name: 'finance_modal_3',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '对账单管理', keepAlive: false }
      },
      {
        path: '/finance/reconciliation-statements/:id',
        name: 'finance_modal_4',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '对账单管理详情', keepAlive: false }
      },
      {
        path: '/finance/invoice-list',
        name: 'finance_modal_5',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '发票列表', keepAlive: false }
      },
      {
        path: '/finance/invoice-list/:id',
        name: 'finance_modal_6',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '发票详情', keepAlive: false }
      },
      {
        path: '/finance/expense-bills',
        name: 'finance_modal_7',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '费用单列表', keepAlive: false }
      },
      {
        path: '/finance/expense-bills/:id',
        name: 'finance_modal_8',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '费用单详情', keepAlive: false }
      },
      {
        path: '/finance/expense-bills/new',
        name: 'finance_modal_9',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '新增费用单', keepAlive: false }
      },
      {
        path: '/finance/payment-applications',
        name: 'finance_modal_10',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '付款申请一览表', keepAlive: false }
      },
      {
        path: '/finance/payment-applications/new',
        name: 'finance_modal_11',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '新增付款申请', keepAlive: false }
      },
      {
        path: '/finance/payment-applications/:id',
        name: 'finance_modal_12',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '付款申请详情', keepAlive: false }
      },
      {
        path: '/finance/prepayment-applications',
        name: 'finance_modal_13',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '预付款申请一览表', keepAlive: false }
      },
      {
        path: '/finance/prepayment-applications/new',
        name: 'finance_modal_14',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '新增预付款申请', keepAlive: false }
      },
      {
        path: '/finance/prepayment-applications/:id',
        name: 'finance_modal_15',
        component: () => import('@/pages-view/micro/container/index.vue'),
        meta: { title: '预付款申请详情', keepAlive: false }
      }
    ]
  }
]


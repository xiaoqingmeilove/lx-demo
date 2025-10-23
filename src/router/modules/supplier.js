import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierNotice',
        name: 'supplier_supplierNotice',
        component: () => import('@/pages-view/supplier/supplier-notice/index.vue'),
        meta: { title: '供应商看板' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierRegister',
        name: 'supplier_supplierRegister',
        component: () => import('@/pages-view/supplier/supplier-register/index.vue'),
        meta: { title: '供应商管理' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierAccess',
        name: 'supplier_supplierAccess',
        component: () => import('@/pages-view/supplier/supplier-access/index.vue'),
        meta: { title: '供应商准入' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierQuality',
        name: 'supplier_supplierQuality',
        component: () => import('@/pages-view/supplier/supplier-quality/index.vue'),
        meta: { title: '供应商资质' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierProduct',
        name: 'supplier_supplierProduct',
        component: () => import('@/pages-view/supplier/supplier-product/index.vue'),
        meta: { title: '供应商产品管理' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierType',
        name: 'supplier_supplierType',
        component: () => import('@/pages-view/supplier/supplier-type/index.vue'),
        meta: { title: '供应商类型' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierRegister-detail/detail/:id?',
        name: 'supplier_supplierRegister_detail',
        component: () => import('@/pages-view/supplier/supplier-register-detail/index.vue'),
        meta: { title: '供应商管理详情', key: 'fullPath' }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierAccess-detail/detail/:id?',
        name: 'supplier_supplierAccess_detail',
        component: () => import('@/pages-view/supplier/supplier-access-detail/index.vue'),
        meta: { title: '供应商准入详情', key: 'fullPath' }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/invitedSupplier',
        name: 'supplier_invitedSupplier',
        component: () => import('@/pages-view/supplier/invitedSupplier/index.vue'),
        meta: { title: '供应商邀请', key: 'fullPath' }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierChange',
        name: 'supplier_supplierChange',
        component: () => import('@/pages-view/supplier/supplier-change/index.vue'),
        meta: { title: '供应商变更' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/supplier/supplierChange-detail/detail/:id?',
        name: 'supplier_supplierChange_detail',
        component: () => import('@/pages-view/supplier/supplier-change-detail/index.vue'),
        meta: { title: '供应商变更详情', key: 'fullPath' },
      },
    ]
  },
]

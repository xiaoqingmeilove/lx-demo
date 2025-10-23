import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/contract/contractTemplate',
        name: 'contract_contractTemplate',
        component: () => import('@/pages-view/contract/contractTemplate/index.vue'),
        meta: { title: '合同模板' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/contract/contractTemplate-detail/detail/:id?',
        name: 'contract_contractTemplate_detail',
        component: () => import('@/pages-view/contract/contractTemplate-detail/index.vue'),
        meta: { title: '合同模板详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/contract/contractApply',
        name: 'contract_contractApply',
        component: () => import('@/pages-view/contract/contractApply/index.vue'),
        meta: { title: '合同列表' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/contract/contractApply-detail/detail/:id?',
        name: 'contract_contractApply_detail',
        component: () => import('@/pages-view/contract/contractApply-detail/index.vue'),
        meta: { title: '合同列表详情', key: 'fullPath' },
      },
    ]
  },
]

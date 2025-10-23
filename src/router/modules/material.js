import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/material-list',
        name: 'material_list',
        component: () => import('@/pages-view/material/material-list/index.vue'),
        // component: () => import('@/pages-view/material/material-list copy/index.vue'),
        meta: { title: '物料分类' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/material-detail',
        name: 'material_detail',
        component: () => import('@/pages-view/material/material-detail/index.vue'),
        meta: { title: '物料档案' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/material-content/detail/:id?',
        name: 'material_content',
        component: () => import('@/pages-view/material/material-content/index.vue'),
        meta: { title: '物料明细', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/priceList',
        name: 'material_priceList',
        component: () => import('@/pages-view/material/priceList/index.vue'),
        meta: { title: '价目表', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/priceList-detail/detail/:id?',
        name: 'material_priceList_detail',
        component: () => import('@/pages-view/material/priceList-detail/index.vue'),
        meta: { title: '价目表详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/sourceList',
        name: 'material_sourceList',
        component: () => import('@/pages-view/material/sourceList/index.vue'),
        meta: { title: '货源清单', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/sourceList-detail/detail/:id?',
        name: 'material_sourceList_detail',
        component: () => import('@/pages-view/material/sourceList-detail/index.vue'),
        meta: { title: '货源清单详情', key: 'fullPath' },
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/material/materielInventory',
        name: 'material_materielInventory',
        component: () => import('@/pages-view/material/materielInventory/index.vue'),
        meta: { title: '物料库存管理', key: 'fullPath' },
      },
    ]
  },
]
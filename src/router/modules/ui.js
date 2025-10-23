import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    isDebug: true,
    children: [
      {
        path: '/ui',
        name: 'ui',
        component: () => import('@/pages-ui/UI/index.vue'),
        meta: { title: 'UI' }
      },
      {
        path: '/ui/controls',
        name: 'ui_controls',
        component: () => import('@/pages-ui/Controls/index.vue'),
        meta: { title: '控件' }
      },
      {
        path: '/ui/icons',
        name: 'ui_icons',
        component: () => import('@/pages-ui/Icons/index.vue'),
        meta: { title: '图标' }
      },
      {
        path: '/ui/pagelist',
        name: 'ui_pagelist',
        component: () => import('@/pages-ui/PageList/index.vue'),
        meta: { title: '一览表' }
      },
      {
        path: '/ui/detailtest/:id',
        name: 'ui_detailtest',
        component: () => import('@/pages-ui/DetailTest/index.vue'),
        meta: { title: '详情', key: 'fullPath' }
      }
    ]
  },
]

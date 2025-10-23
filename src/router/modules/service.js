import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
        {
            path: '/service/serviceRate',
            name: 'service_rate',
            component: () => import('@/pages-view/service/serviceRate/index.vue'),        
            meta: { title: '报价服务评价' },
        },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/service/serviceTable',
        name: 'service_table',
        component: () => import('@/pages-view/service/serviceTable/index.vue'),
        meta: { title: '售后服务'}
      }, 
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/service/serviceTable-detail/detail/:id',
        name: 'service_table_detail',
        component: () => import('@/pages-view/service/serviceTable-detail/index.vue'),
        meta: { title: '售后服务详情', key: 'fullPath' }
      },
    ]
  },
]

import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/notfound',
        name: 'notfound',
        component: () => import('@/pages/NotFound/index.vue'),        
        meta: { title: '页面找不到' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/notfound'
  }
]
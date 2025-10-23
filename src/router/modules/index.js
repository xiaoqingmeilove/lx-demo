

import Layout from '@/layout'

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/external/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/pages/Redirect/index')
      }
    ]
  },
  {
    path: '/default',
    name: 'default',
    component: () => import('@/pages/Default/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login/index.vue'),
    meta: { title: '用户登录' }
  },
  {
    path: '/login/register',
    name: 'register',
    component: () => import('@/pages/Login/register.vue'),
    meta: { title: '供应商注册' }
  },
  {
    path: '/login/resetpassword',
    name: 'resetpassword',
    component: () => import('@/pages/Login/resetpassword.vue'),
    meta: { title: '重置密码' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/default',
    children: [      
      {
        path: '/homePage',
        name: 'homePage',
        component: () => import('@/pages-view/Home/index.vue'),        
        meta: { title: '首页', closable: false }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/default',
    children: [      
      {
        path: '/template',
        name: 'template',
        component: () => import('@/pages-view/template/index.vue'),        
        meta: { title: 'UI模板一览表'}
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/default',
    children: [      
      {
        path: '/template/detail',
        name: 'template_detail',
        component: () => import('@/pages-view/template-detail/index.vue'),        
        meta: { title: 'UI模板详情' }
      }
    ]
  },
]
import Layout from '@/layout'

export default [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/department',
        name: 'department',
        component: () => import('@/pages-view/system/department/index.vue'),
        meta: { title: '部门维护' }
      },
      {
        path: '/system/organization',
        name: 'organization',
        component: () => import('@/pages-view/system/organization/index.vue'),
        meta: { title: '组织维护' }
      },
      {
        path: '/system/post',
        name: 'post',
        component: () => import('@/pages-view/system/post/index.vue'),
        meta: { title: '岗位维护' }
      },
      {
        path: '/system/dictionary',
        name: 'dictionary',
        component: () => import('@/pages-view/system/dictionary/index.vue'),
        meta: { title: '字典维护' }
      },
      {
        path: '/system/appEnable',
        name: 'appEnable',
        component: () => import('@/pages-view/system/appEnable/index.vue'),
        meta: { title: '应用维护' }
      },
      {
        path: '/system/application',
        name: 'application',
        component: () => import('@/pages-view/system/application/index.vue'),
        meta: { title: '系统维护' }
      },
      {
        path: '/system/userPerm',
        name: 'userPerm',
        component: () => import('@/pages-view/system/userPerm/index.vue'),
        meta: { title: '个人权限' }
      },
      {
        path: '/system/enterprise',
        name: 'enterprise',
        component: () => import('@/pages-view/system/enterprise/index.vue'),
        meta: { title: '企业维护' }
      },
      {
        path: '/system/role',
        name: 'role',
        component: () => import('@/pages-view/system/role/index.vue'),
        meta: { title: '角色维护' }
      },
      {
        path: '/system/menu',
        name: 'menus',
        component: () => import('@/pages-view/system/menu/index.vue'),
        meta: { title: '菜单维护' }
      },
      {
        path: '/system/region',
        name: 'region',
        component: () => import('@/pages-view/system/region/index.vue'),
        meta: { title: '项目区域维护' }
      },
      {
        path: '/system/btnConfig',
        name: 'btnConfig',
        component: () => import('@/pages-view/system/btnConfig/index.vue'),
        meta: { title: '按钮配置' }
      },
      {
        path: '/system/tableHeaderConfig',
        name: 'tableHeaderConfig',
        component: () => import('@/pages-view/system/tableHeaderConfig/index.vue'),
        meta: { title: '前端配置' }
      },
      {
        path: '/system/tableHeaderConfig-detail/detail/:id?',
        name: 'tableHeaderConfig-detail',
        component: () => import('@/pages-view/system/tableHeaderConfig-detail/index.vue'),
        meta: { title: '前端配置详情', key: 'fullPath' }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/user',
        name: 'user',
        component: () => import('@/pages-view/system/user/index.vue'),
        meta: { title: '用户维护' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/user/:id',
        name: 'user_detail',
        component: () => import('@/pages-view/system/user/detail.vue'),
        meta: { title: '用户详情', key: 'fullPath' }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/loginLog',
        name: 'loginLog',
        component: () => import('@/pages-view/system/loginLog/index.vue'),
        meta: { title: '登录日志' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/operationLog',
        name: 'operationLog',
        component: () => import('@/pages-view/system/operationLog/index.vue'),
        meta: { title: '操作日志' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/employee',
        name: 'employee',
        component: () => import('@/pages-view/system/employee/index.vue'),
        meta: { title: '职员维护' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/employee/:id',
        name: 'employee_detail',
        component: () => import('@/pages-view/system/employee/detail.vue'),
        meta: { title: '职员详情', key: 'fullPath' }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/workflow',
        name: 'workflow',
        component: () => import('@/pages-view/system/workflow/index.vue'),
        meta: { title: '工作流维护' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/workflow/:id',
        name: 'workflow_detail',
        component: () => import('@/pages-view/system/workflow/detail.vue'),
        meta: { title: '工作流详情', key: 'fullPath' }
      },
    ]
  },
  

  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/versioning',
        name: 'versioning',
        component: () => import('@/pages-view/system/versioning/index.vue'),
        meta: { title: '版本维护' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/versioning-detail/detail/:id?',
        name: 'versioning_detail',
        component: () => import('@/pages-view/system/versioning-detail/index.vue'),
        meta: { title: '版本详情', key: 'fullPath' }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/historicalVersion',
        name: 'historicalVersion',
        component: () => import('@/pages-view/system/historicalVersion/index.vue'),
        meta: { title: '历史版本' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/salesPersonnel',
        name: 'system_salesPersonnel',
        component: () => import('@/pages-view/system/salesPersonnel/index.vue'),
        meta: { title: '业务员维护' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/system/proclamation',
        name: 'system_proclamation',
        component: () => import('@/pages-view/system/proclamation/index.vue'),
        meta: { title: '公告管理' }
      }
    ]
  },
]

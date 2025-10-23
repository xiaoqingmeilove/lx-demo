import type { MenuItem, UserInfo } from '@/types/app';

export const defaultMenus: MenuItem[] = [
  {
    menuId: 'template',
    title: '模板管理',
    path: '/template',
    menuCode: 'template',
    children: [
      {
        menuId: 'template_list',
        title: '模板一览',
        path: '/template',
        menuCode: 'template',
      },
      {
        menuId: 'template_detail',
        title: '模板详情',
        path: '/template/detail',
        menuCode: 'template',
      },
    ],
  },
];

export const defaultUser: UserInfo = {
  userId: 'demo',
  name: '演示用户',
  corpCode: 'LX',
};

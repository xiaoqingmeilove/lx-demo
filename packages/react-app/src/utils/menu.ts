import type { MenuItem } from '@/types/app';

export const normalizeMenus = (menus: MenuItem[] = []): MenuItem[] =>
  menus.map((menu) => ({
    ...menu,
    children: menu.children ? normalizeMenus(menu.children) : [],
  }));

export const findMenuByKey = (menus: MenuItem[], key: keyof MenuItem, value: string) => {
  for (const menu of menus) {
    if (menu[key] === value) {
      return menu;
    }
    if (menu.children?.length) {
      const target = findMenuByKey(menu.children, key, value);
      if (target) return target;
    }
  }
  return undefined;
};

export const findMenuByCode = (menus: MenuItem[], menuCode?: string) => {
  if (!menuCode) return undefined;
  return findMenuByKey(menus, 'menuCode', menuCode);
};

export const findMenuByPath = (menus: MenuItem[], path: string) => findMenuByKey(menus, 'path', path);

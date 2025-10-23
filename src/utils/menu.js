import store from '@/store'

const handleMenus = (menus = []) => {
  return menus.map(item => {
    const { menuId, title, path, icon, subMenu,menuCode } = item
    return {
      menuId,
      title,
      path,
      icon,
      menuCode:menuCode ?? '',
      children: handleMenus(subMenu ?? [])
    }
  })
}

const getFirstMenu = (menus = []) => {
  const first = menus[0]
  if (first) {
    const children = first.children ?? []
    if (children.length > 0) {
      return getFirstMenu(children)
    } else {
      return first
    }
  }
  return null
}

const findMenuByKeyAndValue = (menus, key, value) => {
  for (const menu of menus) {
    if (menu[key] === value) {
      return menu
    }
    if (menu.children && menu.children.length) {
      const find = findMenuByKeyAndValue(menu.children, key, value)
      if (find) {
        return find
      }
    }
  }
  return null
}

const findMenu = (key, value) => {
  const menus = store.state.User?.menus ?? []
  for (const menu of menus) {
    if (menu[key] === value) {
      return menu
    }
    if (menu.children && menu.children.length) {
      const find = findMenuByKeyAndValue(menu.children, key, value)
      if (find) {
        return find
      }
    }
  }
  return null
}

const findMenuByTitle = title => {
  return findMenu('title', title)
}
const findMenuByCode = menuCode => {
  return findMenu('menuCode', menuCode)
}

export {
  handleMenus,
  getFirstMenu,
  findMenu,
  findMenuByKeyAndValue,
  findMenuByTitle,
  findMenuByCode
}

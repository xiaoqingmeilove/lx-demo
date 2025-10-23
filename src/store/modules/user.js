import moment from 'moment'
import { ApiUser } from '@/apis'
import Vue from 'vue'
import { handleMenus, findMenuByKeyAndValue } from '@/utils/menu'

const getUser = () => {
  let user = localStorage.getItem('userInfo')
  if (user) {
    let token = getToken()
    if (token) {
      let obj = JSON.parse(user)
      return obj
    } else {
      localStorage.removeItem('userInfo')
    }
  }
  return null
}

const getToken = () => {
  let token = localStorage.getItem('token')
  if (token) {
    return JSON.parse(token)
  }
  return null
}

const getMenus = () => {
  const storageItem = localStorage.getItem('menus')
  if (storageItem) {
    return JSON.parse(storageItem)
  }
  return []
}

const getCommonList = (info) => {
  const user = getUser() ?? {}
  const list = localStorage.getItem(`common_list_v1_${user.userId}`)
  if (list) {
    return JSON.parse(list)
  }
  return []
}

const STORE_MODULE = {
  namespaced: true,
  state: {
    userInfo: getUser(),
    token: getToken(),
    menus: getMenus(),
    common_list: getCommonList()
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', JSON.stringify(token))
    },
    setMenus(state, menus) {
      state.menus = menus
      localStorage.setItem('menus', JSON.stringify(menus))
    },
    updateCommonList(state, route) {
      const { name, path, meta } = route
      const findMenu = findMenuByKeyAndValue(state.menus, 'path', path)
      if (!findMenu) return

      const list = [...state.common_list]
      const findIndex = list.findIndex(item => item.path === path)
      if (findIndex > -1) {
        list[findIndex].count++
        list[findIndex].icon = findMenu.icon
        list[findIndex].title = findMenu.title
      } else {
        list.push({
          name,
          path,
          title: findMenu.title,
          icon: findMenu.icon,
          count: 1
        })
      }
      state.common_list = list
      const user = state.userInfo ?? {}
      localStorage.setItem(`common_list_v1_${user.userId}`, JSON.stringify(list))
    }
  },
  getters: {
    isLogin: state => () => {
      if (state.user === null) return false
      if (state.token === null) return false
      const { expire } = state.token
      let diff = moment().diff(moment(expire), 'seconds')
      return diff < 0
    }
  },
  actions: {
    async userLogin({
      commit,
      state,
      dispatch
    }, data) {
      const apiUser = new ApiUser()

      let menus = []
      let errMsg = '登录失败'
      const res = await apiUser.login(data)

      let success = res.code === 200
      if (success) {
        const { token } = res.data
        commit('setToken', {
          value: token,
          expire: moment().add(60 * 60 * 2, 'seconds').valueOf()
        })

        const resData = await apiUser.userInfo()
        if (resData.code === 200) {
          commit('setUserInfo', resData.data)
        } else {
          success = false
          errMsg = '获取用户信息失败'
        }

        const menuData = await apiUser.userMenu()
        if (menuData.code === 200) {
          menus = handleMenus(menuData.data ?? [])
          commit('setMenus', menus)
        } else {
          success = false
          errMsg = '获取用户菜单失败'
        }
        if (!success) {
          commit('userLogout')
        }
      } if(res.code === 1001) {
        return {
          ...res
        }
      } else {
        errMsg = res.message || '登录失败'
      }
      return {
        code: success ? 0 : 1,
        msg: success ? '登录成功' : errMsg,
        menus
      }

      // return new Promise(async (resolve, reject) => {
      //   const res = await apiUser.login(data)
      //   const success = res.code === 200
      //   if (success) {
      //     const { token } = res.data
      //     commit('setUserInfo', {
      //       username: 'admin',
      //     })
      //     commit('setToken', {
      //       value: token,
      //       expire: moment().add(60 * 60 * 2, 'seconds').valueOf()
      //     })
      //   }
      //   resolve({
      //     code: success ? 0 : 1,
      //     msg: success ? '登录成功' : res.message || '登录失败'
      //   })
      // })
    },
    userLogout({
      commit,
      state,
      dispatch,
      rootState
    }) {
      state.userInfo = null
      state.token = null
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('menus')
      sessionStorage.clear()
      //const vm = this._vm
      //vm.$tabs && vm.$tabs.clearTabsStore()
      this.dispatch('tagsView/delAllVisitedViews')
      this.dispatch('tagsView/delAllCachedViews')
    }
  }
}

export default STORE_MODULE

import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
  login: resolveUrl('sys/login'),
  captcha: resolveUrl('sys/captcha/image'),
  userInfo: resolveUrl('sys/system-user-management/search-current-user'),
  userMenu: resolveUrl('sys/getRoutersVue'),
}

class ApiInstance {
  login(data) {
    return request({
    	method: 'POST',
    	url: URLs.login,
      data,
      extra: {
        auth: false
      }
    })
  }
  captcha(codeSign) {
    return request({
    	method: 'get',
    	url: URLs.captcha,
      params: {
        codeSign
      },
      extra: {
        auth: false
      }
    })
  }
  userInfo() {
    return request({
    	method: 'get',
      url: URLs.userInfo,
    })
  }
  userMenu() {
    return request({
    	method: 'get',
      url: URLs.userMenu,
    })
  }
}

export default ApiInstance

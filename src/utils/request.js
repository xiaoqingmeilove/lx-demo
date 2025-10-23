import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
// import qs from 'qs'
import store from '@/store'
//import router from '@/router'
import ctor from '@/main'

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'

const CancelToken = axios.CancelToken
let source = CancelToken.source()

const instance = axios.create({
  //baseURL: '',
  timeout: 60000,
})

instance.interceptors.request.use(config => {
  //TODO
  if (config.extra?.auth !== false) {
    const { User } = store.state
    const { token } = User
    config.headers.Authorization = token?.value
    config.cancelToken = source.token
  }  
  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use(response => {
  //TODO
  if (response.data.code === 401) {
    source.cancel('401')
    Message({
      message: '登录状态已过期',
      type: 'error',
      duration: 5 * 1000
    })
    source = CancelToken.source()
    store.dispatch('User/userLogout')
    ctor.$router.push({
      name: 'login'
    })
  }
  if (response.data.code === 99404) {
    const data = {...response.data?.data, message: response.data?.message ?? '该单据已被删除,无法继续操作。若有疑问，请联系管理员！'}
    ctor.$tabs.close(null, {
      name: 'quotation_notFound',
      params: {
        data
      }
    })
  }
  return response.data ?? {}
}, err => {
  return err
});

export default instance

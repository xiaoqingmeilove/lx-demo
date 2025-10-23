import { initGlobalState } from 'qiankun'

export const actions = initGlobalState({
  token: localStorage.getItem('token') || null,
  // baseURL: 'http://localhost:36655/api'
  // baseURL: 'http://192.168.3.145:8096/api'
  baseURL: `${window.location.origin}/api`
})

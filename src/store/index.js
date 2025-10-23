import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import Common from './modules/common.js'
import Theme from './modules/theme.js'
import User from './modules/user.js'
import Message from './modules/message.js'

Vue.use(Vuex)

const appModulesFiles = require.context('./app-modules', true, /\.js$/)
const appModules = appModulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = appModulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const getLatestUser = () => {
  return localStorage.getItem('latestUser') || ''
}

const store = new Vuex.Store({
  state: {
    latestUser: getLatestUser()
  },
  mutations: {
    setLatestUser(state, name) {
      state.latestUser = name
      localStorage.setItem('latestUser', name)
    }
  },
  modules: {
    ...appModules,
    Common,
    Theme,
    User,
    Message
  },
  getters
})

export default store

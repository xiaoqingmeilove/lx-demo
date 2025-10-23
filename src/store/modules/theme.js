import { ApiPublic } from '@/apis'
import Color from 'color'
import XEUtils from 'xe-utils'

function setStyleProperty(name, value) {
  const html = document.querySelector('html')
  html.style.setProperty(name, value || '')
}

const DEFAULT_COLOR = '#1890ff'

export const LOCAL_THEME_CONFIG = 'theme_config'
const BASE_COLOR_PROPERTY_NAME = '--base-color'

const STORE_MODULE = {
  namespaced: true,
  state: {
    theme: {},
    themeClone: {},
  },
  mutations: {
    changeBaseColor(state, color) {
      color = color || DEFAULT_COLOR
      const theme = {...state.theme}
      theme['baseColor'] = color
      state.theme = theme
      const lighten = color ? Color(color).lighten(0.7) : ''
      const lighten2 = color ? Color(color).lighten(0.6) : ''

      setStyleProperty(BASE_COLOR_PROPERTY_NAME, color)
      setStyleProperty('--base-color-lighten', lighten)
      setStyleProperty('--base-color-lighten2', lighten2)
    },
    setTheme(state, theme) {
      theme = theme || {}
      const themeConfig = {
        ...state.theme,
        ...theme,
      }
      state.theme = themeConfig
      this.commit('Theme/changeBaseColor', themeConfig.baseColor)

      const {
        baseColor,
        tableHeaderBgColor, tableHeaderTextColor, tableCurrentRowHighlight, tableBorderColor,
        loginBaseColor, loginTextColor, loginButtonColor,tableCrosswalkBgColor,tableOptionBorderColor, specialButtonBg,tabsColor,formItemEditColor,
      } = themeConfig
      setStyleProperty('--base-color', baseColor)
      setStyleProperty('--base-color-lighten', baseColor ? Color(baseColor).lighten(0.7) : '')
      setStyleProperty('--base-color-lighten2', baseColor ? Color(baseColor).lighten(0.6) : '')
      setStyleProperty('--table-header-bg-color', tableHeaderBgColor)
      setStyleProperty('--table-header-text-color', tableHeaderTextColor)
      setStyleProperty('--table-row-optionbordercolor', tableOptionBorderColor)
      setStyleProperty('--table-border-color', tableBorderColor)
      setStyleProperty('--table-current-row-highlight', tableCurrentRowHighlight)
      setStyleProperty('--table-current-row-crosswalkbgcolor', tableCrosswalkBgColor)
      setStyleProperty('--login-base-color', loginBaseColor)
      setStyleProperty('--login-text-color', loginTextColor)
      setStyleProperty('--login-button-color', loginButtonColor)
      setStyleProperty('--special-button-bg', specialButtonBg)
      setStyleProperty('--tabs-color', tabsColor)
      setStyleProperty('--form-item-edit-color', formItemEditColor)
    },
    setBaseColor(state, data) {
      const { baseColor } = data
      this.commit('Theme/changeBaseColor', baseColor)
    },
    resetTheme(state) {
      const theme = state.themeClone
      this.commit('Theme/setTheme', theme.themeClone)
    },
    saveTheme() {

    }
  },
  getters: {

  },
  actions: {
    async getTheme({ commit, state }) {
      const res = await ApiPublic.getTheme()
      const theme = (res.data ?? []).reduce((data, item) => {
        const { dictValue, dictLabel } = item
        data[dictValue] = dictLabel
        return data
      }, {})
      state.themeClone = XEUtils.clone(theme, true)
      commit('setTheme', theme)
    }
  }
}

export default STORE_MODULE

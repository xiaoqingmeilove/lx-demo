import Vue from 'vue'
import SvgIcon from './SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const SVG_ICONS = req.keys().map(key => {
  const regex = /\.\/(.+)\.svg/;
  const match = key.match(regex);
  return match[1]
})

export {
  SVG_ICONS
}

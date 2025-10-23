// src/directives/qiankunAnchor.js
import Vue from 'vue'

function parkHost() {
  const host = document.getElementById('react-micro-host')
  const park = document.getElementById('micro-host-park')
  if (host && park && host.parentNode !== park) {
    park.appendChild(host)
    host.style.display = 'none'
    host.style.width = host.style.height = ''
  }
}

Vue.directive('qiankun-anchor', {
  inserted(el) {
    const host = document.getElementById('react-micro-host')
    if (!host) return console.error('[qiankun] host not found')

    // 占位区要有尺寸，避免内部 0 高度
    if (!el.style.height) el.style.minHeight = '300px'

    el.appendChild(host)
    host.style.display = ''
    host.style.width = '100%'
    host.style.height = '100%'
  },
  unbind() {
    parkHost()
  }
})

export { parkHost }

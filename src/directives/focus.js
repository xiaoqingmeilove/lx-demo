import Vue from 'vue'

export default {
  componentUpdated(el, binding, vnode) {
    if (['INPUT', 'TEXTAREA'].includes(el.tagName)) {
      el.focus()
    } else {
      let element = el.querySelector('input') || el.querySelector('textarea')
      if (!element) return
      element.focus()
    }
  },
}

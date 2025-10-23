<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else class="svg-icon" :class="className" aria-hidden="true" v-on="$listeners" :style="svgStyle">
    <use :xlink:href="iconName" />
    <title v-if="title">{{title}}</title>
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: [String, Array],
      default: ''
    },
    title: {
      type: String,
      default: null
    },
    size: {
      type: [String, Number],
      default: '1em'
    },
    fontSize: {
      type: [String, Number],
      default: ''
    },
    fill: {
      type: String,
      default: '' // '#a3a3a3'  //#0D6CE4
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    },
    svgStyle() {
      let { size, fontSize, fill } = this
      if (/\d+/.test(String(size))) {
        size = `${size}px`
      }
      return {
        width: size,
        height: size,
        fontSize,
        fill
      }
    }
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  font-size: 14px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>

<template>
  <svg class="page-icon" aria-hidden="true" :style="bindStyle" @click.stop="$emit('click')">
    <use :xlink:href="xLinkHref"></use>
    <title v-if="title">{{title}}</title>
  </svg>
</template>

<script>
  export default {
    name: 'pageIcon',
    props: {
      name: {
        type: String,
        default: ''
      },
      iconName: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: null
      },
      size: {
        type: [String, Number],
        default: null
      },
      title: {
        type: String,
        default: null
      }
    },
    computed: {
      xLinkHref() {
        if (this.name) {
          return `#page-icon-${this.name}`
        }
        return `#${this.iconName}`
      },
      bindStyle() {
        const { color, size } = this
        const style = {}
        let iconSize = null
        if (this.size) {
          iconSize = typeof this.size === 'number' ? `${this.size}px` : this.size
        }
        style.fill = color
        style.width = iconSize
        style.height = iconSize
        return style
      }
    }
  }
</script>

<style>
.page-icon {
  width: 24px;
  height: 24px;
  fill: #333;
}
</style>

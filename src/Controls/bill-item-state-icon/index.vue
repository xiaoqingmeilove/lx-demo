<template>
  <img class="bill-item-state-icon"
    :src="iconImg"
    :style="imgStyle"
    :title="iconTitle"
  />
</template>

<script>
  const ICON_TITLES = {
    fei: '临时物料',
    aps: 'aps',
    deng: '等效',
    gou: '外购',
    xie: '外协'
  }
  
  export default {
    name: 'billItemStateIcon',
    props: {
      icon: {
        type: String,
        default: ''
      },
      size: {
        type: [String, Number],
        default: 12
      }
    },
    computed: {
      iconImg() {
        return require(`./svg/${this.icon}.svg`)
      },
      iconTitle() {
        return ICON_TITLES[this.icon]
      },
      imgStyle() {
        let { size } = this
        if (/\d+/.test(String(size))) {
          size = `${size}px`
        }
        return {
          width: size,
          height: size
        }
      }
    }

  }
</script>

<style>
</style>

<template>
  <img class="bill-item-state-icon"
    :src="iconImg"
    :style="imgStyle"
    :title="iconTitle"
  />
</template>

<script>
  const ICON_TITLES = {
    fei: '非常规',
    aps: 'aps',
    deng: '等效',
    gou: '外购',
    xie: '外协',
    cai:'人工材耗'
  }
  
  export default {
    name: 'newItemStateIcon',
    props: {
      icon: {
        type: String,
        default: ''
      },
      size: {
        type: [String, Number],
        default: 14
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

<template>
  <div class="adjust-price" v-if="rtpList.length > 0">
    <div v-html="rtpMessage"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'adjustPrice',
    computed: {
      ...mapState({
        rtp: state => state.Common.rtp ?? {},
        rtpMessage: state => state.Common.rtpMessage || '',
      }),
      rtpList() {
        return Object.keys(this.rtp).map(key => {
          return this.rtp[key]
        })
      },
      bindHtml() {
        return this.rtpList.length > 0 ? `<br />(${this.rtpList.map(item => {
          return `${item.conductorCn} <strong>${item.price.toFixed(3)}</strong> ${item.unit}`
        }).join(',')})` : ''
      }
    },
  }
</script>

<style lang="less">
.adjust-price {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  height: 40px;
  font-size: 16px;
  text-align: center;
  color: #595959;
  strong {
    color: #FF4D4F;
    font-weight: normal;
  }
}
</style>

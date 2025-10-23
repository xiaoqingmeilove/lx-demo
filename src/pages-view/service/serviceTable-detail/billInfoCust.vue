<template>
  <data-info-box class="bill-info" :info-list="infoList" :info-value="infoValue" :show-value="showValue"></data-info-box>
</template>

<script>
  export default {
    name: 'billInfo',
    props: {
      infoValue: {
        type: Object,
        default: () => ({})
      },
      showValue: {
        type: Boolean,
        default: true
      }
    },
    data() {
      console.log(this.$store)
      const userInfo = this.$store.state.User?.userInfo ?? {}
      return {
        infoList: [
          { label: '组织架构', field: 'clientName', placeholder: userInfo.clientName, icon: 'el-icon-share' },
          { label: '单据编号', field: 'billNo', placeholder: '系统自动生成', icon: 'el-icon-document' },
          { label: '单据状态', field: 'billStateName', placeholder: '待受理', icon: 'el-icon-s-data' },
          { label: '制单人', field: 'createUser', placeholder: userInfo.nickName, icon: 'el-icon-user' },
          { label: '单据时间', field: 'createTime', placeholder: '系统自动生成', icon: 'el-icon-date' },
          { label: '申请时间', field: 'createTime', placeholder: '系统自动生成', icon: 'el-icon-timer' },
          { label: '审核时间', field: 'updateTime', placeholder: '系统自动生成', icon: 'el-icon-finished' },
        ],
      }
    }
  }
</script>

<style lang="less">
.bill-info {
  .data-info-item {
    &:nth-child(1) {
      flex: 1;
      width: 0;
    }
    &:nth-child(2) {
      flex: 1;
      width: 0;
    }
    &:nth-child(3) {

    }
    &:nth-child(4) {

    }
    &:nth-child(5) {

    }
    &:nth-child(6) {

    }
    &:nth-child(7) {

    }
  }
  @media screen and (min-width: 1500px) {
    .data-info-item {
      flex: 1;
      width: 0;
    }
  }
}
</style>

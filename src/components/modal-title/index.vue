<template>
  <div class="modal-title">
    <h4>{{title}}</h4>
  </div>
</template>

<script>
  export default {
    name: 'modalTitle',
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="less">
.modal-title {
  line-height: 22px;
  font-size: 16px;
  color: #595959;
  > h4 {
    display: inline-block;
    position: relative;
    font-weight: normal;
    padding-left: 6px;
    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 3px;
      height: 11px;
      border-radius: 4px;
      background: #1890FF;
    }
  }
}
</style>

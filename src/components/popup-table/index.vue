<template>
  <vxe-modal v-model="modalVisible"
    class="popup-table-modal"
    :title="title"
    :width="width"
    :position="{ top: '12vh' }"
    v-bind="modalOptions"
    destroy-on-close
    @hide="onHide"
  >
    <popup-table-view
      :columns="columns"
      :data="data"
      :editable="editable"
      :data-list="dataList"
      :ok-text="okText"
      :cancel-text="cancelText"
      :add-text="addText"
      :show-footer="showFooter"
      :click-select-all="clickSelectAll"
      @close="onClose"
      :deleteBtn="deleteBtn"
      @ok="onOk"
    ></popup-table-view>
  </vxe-modal>
</template>

<script>
  import popupTableView from './coms/popup-table-view/index.vue'

  export default {
    name: 'popupTable',
    model: {
    	prop: 'visible',
    	event: 'change'
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ' '
      },
      width: {
        type: [String, Number],
        default: 800
      },
      modalOptions: {
        type: Object,
        default: () => ({})
      },
      dataList: {
        type: Object,
        default: () => { return {} }
      },
      columns: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      editable: {
        type: Boolean,
        default: true
      },
      okText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      addText: {
        type: String,
        default: '新增'
      },
      showFooter: {
        type: Boolean,
        default: true
      },
      clickSelectAll: {
        type: Boolean,
        default: true
      },
      deleteBtn:{
        type: Boolean,
        default: true
      }
    },
    components: {
      popupTableView
    },
    watch: {
      visible(newVal) {
        this.modalVisible = newVal
      }
    },
    data() {
      return {
        modalVisible: false
      }
    },
    created() {
      this.modalVisible = this.visible
    },
    methods: {
      close() {
        this.$emit('change', false)
      },
      onHide() {
        this.$emit('change', false)
        this.$emit('hide')
      },
      onClose() {
        this.close()
        this.$emit('close')
      },
      onOk(data) {
        this.$emit('ok', {
          data
        })
      }
    }
  }
</script>

<style lang="less">
.popup-table-modal {
  .vxe-modal--box {
    max-height: 85%;
  }
  .vxe-modal--content {
    padding: 0;
  }
}
</style>

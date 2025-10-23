<template>
  <vxe-modal v-model="modalVisible"
    :class="computedClassName"
    :title="title"
    :width="width"
    :position="{ top: '12vh' }"
    v-bind="modalOptions"
    destroy-on-close
    @hide="onHide"
  >
    <template #title v-if="$scopedSlots.popup_title">
      <slot name="popup_title"></slot>
    </template>
    <popup-form-view
      :form-data="formData"
      :data-list="dataList"
      :data-gather="dataGather"
      :rules="rules"
      :span="span"
      :auto-scroll="autoScroll"
      :ok-text="okText"
      :cancel-text="cancelText"
      :btn-align="btnAlign"
      :title-align="titleAlign"
      :title-width="titleWidth"
      :title-colon="titleColon"
      :read-only="readOnly"
      @close="onClose"
      @ok="onOk"
      @events="onEvents"
    >
      <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="scope">
        <slot :name="slotName" v-bind="scope"></slot>
      </template>
    </popup-form-view>
  </vxe-modal>
</template>

<script>
  import popupFormView from './coms/popup-form-view/index.vue'

  export default {
    name: 'popupForm',
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
      formData: {
        type: Object,
        default: () => { return {} }
      },
      dataGather: {
        type: Array,
        default: () => { return [] }
      },
      dataList: {
        type: Object,
        default: () => { return {} }
      },
      modalOptions: {
        type: Object,
        default: () => { return {} }
      },
      rules: {
        type: Object,
        default: () => { return {} }
      },
      autoScroll: {
        type: Boolean,
        default: false
      },
      span: {
        type: Number,
        default: 24
      },
      okText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      btnAlign: {
        type: String,
        default: ''
      },
      titleAlign: {
        type: String,
        default: 'right'
      },
      titleWidth: {
        type: [Number, String],
        default: 100
      },
      titleColon: {
        type: Boolean,
        default: false
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      popupFormView
    },
    computed: {
      computedClassName() {
        const { autoScroll } = this
        return {
          ['popup-form-modal']: true,
          ['popup-form-modal--scroll']: !!autoScroll
        }
      }
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
    mounted() {

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
        this.$emit('ok', data)
      },
      onEvents({ eventName, data }) {
        this.$emit(eventName, data)
      }
    }
  }
</script>

<style lang="less">
.popup-form-modal {
  .vxe-modal--box {
    display: flex;
    flex-direction: column;
    .vxe-modal--body {
      flex: 1;
      height: 0;
    }
  }
}
.popup-form--custom-title.vxe-modal--wrapper .vxe-modal--header .vxe-modal--header-title {
  padding-left: 16px;
  &::before {
    display: none;
  }
}
.popup-form-modal.type--modal {
  .vxe-modal--box {
    .vxe-modal--body,
    .vxe-modal--content {
      overflow: unset;
    }
  }
}
.popup-form-modal.popup-form-modal--scroll {
  .vxe-modal--box {
    max-height: 80%;
  }
  .vxe-modal--content {
    padding: 0;
  }
  .popup-form-view-body {
    overflow: auto;
  }
}
</style>

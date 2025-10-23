<template>
  <vxe-modal v-model="modalVisible"
    type="confirm"
    title="筛选(数字类型请使用大于等于小于等于比较)"
    width="600"
    show-footer
    destroy-on-close
    @confirm="onConfirm"
    @hide="onHide"
  >
    <filter-main
      :filter-list="filterList"
      :fields="fields"
      :cache-name="cacheName"
      ref="main"
    ></filter-main>
  </vxe-modal>
</template>

<script>
  import filterMain from './filter-main/index.vue'
  import { OPERATORS } from '../filter.js'

  export default {
    components: {
      filterMain
    },
    model: {
    	prop: 'visible',
    	event: 'change'
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      fields: {
        type: Array,
        default: () => []
      },
      filterList: {
        type: Array,
        default: () => []
      },
      cacheName: {
        type: String,
        default: ''
      }
    },
    watch: {
      visible(newVal) {
        this.modalVisible = newVal
      }
    },
    data() {
      return {
        modalVisible: false,
      }
    },
    created() {

    },
    methods: {
      onConfirm() {
        const { main } = this.$refs
        const data = [...main.filters].filter(item =>
          !!item.field && (
            [OPERATORS.NULL, OPERATORS.NOTNULL].includes(item.where)
            || Object.values(item).every(v => !!v)
          )
        )
        this.$emit('confirm', data)
        if (this.cacheName) {
          localStorage.setItem(this.cacheName, JSON.stringify(data))
        }
      },
      onHide() {
        this.$emit('change', false)
      }
    }
  }
</script>

<style>
</style>

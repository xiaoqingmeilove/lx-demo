<template>
  <div class="filter-data-button">
    <page-button @click="filterVisible = true;"
      :theme="filterList.length ? '' : 'default'"
    >{{btnText}}</page-button>
    <filter-modal v-model="filterVisible"
      :fields="fields"
      :filter-list="filterList"
      :cache-name="cacheName"
      @confirm="onFilterConfirm"
    ></filter-modal>
  </div>
</template>

<script>
  import filterModal from './filter-modal/index.vue'

  export default {
    name: 'filterDataButton',
    components: {      
      filterModal
    },
    props: {
      btnText: {
        type: String,
        default: '筛选'
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
    data() {
      return {
        filterVisible: false
      }
    },
    methods: {
      onFilterConfirm(data) {
        this.$emit('confirm', data)
      }
    }
  }
</script>

<style lang="scss">
.filter-data-button {
  display: inline-flex;
  margin-right: 12px;
}
</style>

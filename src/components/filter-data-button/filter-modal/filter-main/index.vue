<template>
  <div class="filter-main">
    <div v-for="(item, index) in filters" :key="index" class="filter-item">
      <!-- <vxe-select v-model="item.field" class="filter-item--select" transfer>
        <vxe-option v-for="_field in fields" :key="_field.value" :value="_field.value" :label="_field.label"></vxe-option>
      </vxe-select> -->

      <!-- <vxe-pulldown v-model="showPull" transfer>
        <template #default>
          <vxe-input v-model="item.label" placeholder="请选择字段" @focus="showPull = true;" @keyup="showPull = false;"></vxe-input>
        </template>
        <template #dropdown>
          <div class="fields-dropdown">
            <div class="fields-item" v-for="fieldItem in fields" :key="fieldItem.value" @click="selectEvent(item, fieldItem)">
              <span>{{fieldItem.label}}</span>
            </div>
          </div>
        </template>
      </vxe-pulldown> -->

      <vxe-select v-model="item.field" class="filter-item--select" transfer
        placeholder="请选择字段"
        :options="fields"
        filterable
      ></vxe-select>

      <vxe-select v-model="item.where" transfer class="filter-item--select">
        <vxe-option v-for="op in opList"
          :key="op.value"
          :value="op.value"
          :label="op.label"
        ></vxe-option>
      </vxe-select>
      <vxe-input v-model="item.value" class="filter-item--input" :style="{
        visibility: ['null', 'notnull'].includes(item.where) ? 'hidden' : ''
      }"></vxe-input>
      <svg-icon icon-class="error-fill" size="20" fill="#999" @click="onDeleteClick(item, index)"></svg-icon>
    </div>
    <page-button type="text" @click="filters.push({ field: '', where: 'eq', value: ''})">+ 增加条件</page-button>
    <page-button theme="danger" size="small" type="text" @click="filters = []">重置</page-button>
  </div>
</template>

<script>
  import XEUtils from 'xe-utils'
  import { OPERATORS, OPERATOR_LIST } from '../../filter.js'

  export default {
    props: {
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
        opList: [...OPERATOR_LIST],
        filters: [],
        showPull: false
      }
    },
    mounted() {
      if (this.cacheName) {
        const filters = localStorage.getItem(this.cacheName) || '[]'
        this.filters = JSON.parse(filters)
      } else {
        this.filters = XEUtils.clone(this.filterList, true)
      }
    },
    methods: {
      onDeleteClick(item, index) {
        this.filters.splice(index, 1)
      },
      selectEvent(item, fieldItem) {
        item.label = fieldItem.label
        item.field = this.fields.find(i => i.value === fieldItem.value)?.value
        this.showPull = false
      }
    }
  }
</script>

<style lang="scss">
.filter-main {
  .filter-item {
    display: flex;
    height: 40px;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    .filter-item--select {
      width: 160px;
    }
    .filter-item--input {
      flex: 1;
      width: 0;
    }
  }
}
.fields-dropdown {
  max-height: 250px;
  overflow-y: auto;
  .fields-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 32px;
    &:hover {
      background: #e8ffff;
    }
  }
}
</style>

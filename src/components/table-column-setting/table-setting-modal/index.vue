<template>
  <div class="table-setting-modal">
    <div class="table-setting-view" :class="[hasScrollClass]">
      <div class="table-setting-view-header">
        <div class="ts-row">
          <div class="ts-row-item">显示</div>
          <div class="ts-row-item" auto>列名</div>
          <div class="ts-row-item" auto>拖动调整顺序</div>
          <div class="ts-row-item">左固定</div>
          <div class="ts-row-item">右固定</div>
        </div>
      </div>
      <div class="table-setting-view-body">
        <div class="table-column-list" ref="el">
          <div class="ts-row" v-for="(item, index) in columns" :key="item.__row_x_id__">
            <div class="ts-row-item">
              <vxe-checkbox v-model="item.visible"></vxe-checkbox>
            </div>
            <div class="ts-row-item" auto>{{item.title || '#'}}</div>
            <div class="ts-row-item" auto>
              <i class="vxe-icon-sort-numeric-desc ts-drag"></i>
              <page-button type="text" theme="default" @click.stop="moveItem(item, index, 'top')">置顶</page-button>
              <page-button type="text" theme="default" @click.stop="moveItem(item, index, 'bottom')">置底</page-button>
            </div>
            <div class="ts-row-item">
              <vxe-checkbox :value="fixedCheck(item, 'left')" @change="onFixedCheckboxChange($event, item, 'left')"></vxe-checkbox>
            </div>
            <div class="ts-row-item">
              <vxe-checkbox :value="fixedCheck(item, 'right')" @change="onFixedCheckboxChange($event, item, 'right')"></vxe-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import XEUtils from 'xe-utils'

  export default {
    props: {
      table: {
        type: Object,
        default: null
      },
      defaultColumns: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      fixedCheck() {
        return (item, fixed) => {
          return item.fixed === fixed
        }
      }
    },
    data() {
      return {
        hasScrollClass: '',
        columns: [],
      }
    },
    created() {
      this.loadColumns()
    },
    mounted() {
      const sortable = new Sortable(this.$refs.el, {
        animation: 150,
        handle: '.ts-drag',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          const columns = [...this.columns]
          const item = columns.splice(oldIndex, 1)[0]
          columns.splice(newIndex, 0, item)
          this.columns = [...columns]
        },
      })

      this.checkScrollBar()
    },
    methods: {
      loadColumns() {
        if (this.table) {
          this.columns = XEUtils.clone(this.table.getTableColumn().collectColumn, true).map((item, index) => {
            item.__row_x_id__ = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')
            return item
          })
        }
      },
      resetColumns(columns) {
        this.columns = columns.map((item, index) => {
          item.__row_x_id__ = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')
          return item
        })
      },
      checkScrollBar() {
        this.$nextTick(() => {
          const el = this.$refs.el
          if (!el) return
          const hasScrollbar = el.scrollHeight > el.clientHeight
          this.hasScrollClass = hasScrollbar ? 'table-setting-view--scroll' : ''
        })
      },
      moveItem(item, index, position) {
        const columns = [...this.columns]
        const col = columns.splice(index, 1)[0]
        if (position === 'top') {
          columns.unshift(col)
        } else if (position === 'bottom') {
          columns.push(col)
        }
        this.columns = [...columns]
        this.scrollToPosition(position)
      },
      changePosition(arr, index, targetIndex) {
        const temp = arr[index]
        arr.splice(index, 1, arr[targetIndex])
        arr.splice(targetIndex, 1, temp)
        this.columns = [...arr]
      },
      scrollToPosition(position) {
        const el = this.$refs.el
        this.$nextTick(() => {
          const scrollHeight = position === 'top' ? 0 : el.scrollHeight
          el.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
          })
        })
      },
      onFixedCheckboxChange($event, item, fixed) {
        const { checked } = $event
        item.fixed = checked ? fixed : null
      }
    }
  }
</script>

<style lang="less">
.table-setting-modal {
  height: 100%;
  .table-setting-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #595959;
    font-size: 14px;
    .table-setting-view-header {
      background: #d1e9ff;
      .ts-row {
        border-bottom: none;
      }
      .ts-row-item {
        border-right: solid 1px #cadde8;
        &:last-child {
          border-right: none;
        }
      }
    }
    .table-setting-view-body {
      flex: 1;
      height: 0;
      overflow: auto;
      .table-column-list {
        height: 100%;
        overflow: auto;
        scroll-behavior: smooth;
      }
    }
  }
  .ts-row {
    display: flex;
    height: 36px;
    border-bottom: solid 1px #d1e9ff;
    .ts-row-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90px;
      height: 100%;
      border-right: solid 1px #cbdee9;
      &:last-child {
        border-right: none;
      }
    }
    .ts-row-item[auto] {
      flex: 1;
      width: 0;
    }
  }
  .table-setting-view--scroll {
    .table-setting-view-header {
      padding-right: 17px;
    }
  }
  .ts-drag {
    cursor: move;
    margin-right: 10px;
  }
}
</style>

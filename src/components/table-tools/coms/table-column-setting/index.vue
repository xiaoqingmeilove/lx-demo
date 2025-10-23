<template>
  <div class="table-tools-item">
    <el-tooltip class="item" effect="dark" content="表格设置" placement="top">
    <table-tools-icon @click="onBtnClick">
      <template #path>
        <path d="M411.4 112H202c-50.3 0-87.9 37.2-87.9 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7h213.6c46.1 0 83.8-37.2 83.8-82.7V192.6c-4.3-43.4-42-80.6-83.9-80.6zM828.2 112H618.8c-46.1 0-83.8 37.2-83.8 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7h209.4c46.1 0 83.8-37.2 83.8-82.7V192.6c2-43.4-35.7-80.6-83.8-80.6zM405.9 539.9H196.5c-50.3 0-87.9 37.2-87.9 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7H406c46.1 0 83.8-37.2 83.8-82.7V620.5c-4.3-43.4-42-80.6-83.9-80.6zM827.8 539.9H618.4c-46.1 0-83.8 37.2-83.8 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7h209.4c46.1 0 83.8-37.2 83.8-82.7V620.5c2-43.4-35.7-80.6-83.8-80.6z"></path>
      </template>
    </table-tools-icon>
  </el-tooltip>

    <vxe-modal
      v-model="modalVisible"
      v-bind="modalProps"
      @close="onClose"
      @hide="onHide"
      resize
      destroy-on-close
    >
      <template #default>
        <table-setting-modal
          :table="table"
          ref="setting"
        ></table-setting-modal>
      </template>
      <template #footer>
        <page-button v-if="defaultColumns && defaultColumns.length > 0"
          type="text"
          class="reset-to-default"
          @click="resetToDefault"
        >恢复默认</page-button>
        <page-button @click="onOkClick">确定</page-button>
        <page-button @click="onCancelClick">取消</page-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
  import VXETable from 'vxe-table'
  import XEUtils from 'xe-utils'
  import tableSettingModal from './table-setting-modal/index.vue'
  import tableToolsIcon from '../../table-tools-icon/index.vue'

  const CACHE_NAME = 'VXE_TABLE_CUSTOM_COLUMN_ORDERLIST'
  const CACHE_WIDTH = 'VXE_TABLE_CUSTOM_COLUMN_WIDTH'

  export default {
    name: 'tableColumnSetting',
    props: {
      storage: {
        type: Boolean,
        default: true
      },
      defaultColumns: {
        type: Array,
        default: () => []
      }
    },
    components: {
      tableSettingModal,
      tableToolsIcon
    },
    data() {
      return {
        modalVisible: false,
        table: null,

        modalProps: {
          title: '表格设置',
          //type: 'confirm',
          width: 630,
          height: 500,
          position: {
            top: 180
          },
          showFooter: true,
          resize: false
        },
      }
    },
    methods: {
      onBtnClick() {
        const table = this.$parent?.$parent?.$xetable
        if (table) {
          this.table = table
          this.modalVisible = true
        }
      },

      onClose() {
        console.log('onClose')
      },
      onHide() {
        console.log('onHide')
      },

      cancel() {
        this.modalVisible = false
      },
      onCancelClick() {
        this.cancel()
      },
      onOkClick() {
        if (!this.table) return
        const { setting } = this.$refs
        if (!setting) return
        const columns = setting.columns
        this.table.reloadColumn(columns)
        this.setTableStorage(columns)
        this.$emit('ok', {
          type: 'set_column',
          data: {
            columns
          }
        })
        this.cancel()
      },

      setTableStorage(columns) {
        const tableId = this.table.id
        if (this.storage && tableId) {
          let cacheData = columns.map((item, index) => {
            return this.handleCacheData(item)
          })
          let storageObj = localStorage.getItem(CACHE_NAME) || '{}'
          storageObj = JSON.parse(storageObj)
          storageObj[tableId] = cacheData
          localStorage.setItem(CACHE_NAME, JSON.stringify(storageObj))
        }
      },
      handleCacheData(item) {
        return {
          title: item.title,
          field: item.field,
          fixed: item.fixed,
          visible: item.visible !== false
        }
      },

      clearStorage() {
        this.clearStorageColumn()
        this.clearStorageWidth()
      },
      clearStorageColumn() {
        const tableId = this.table.id
        let storageObj = localStorage.getItem(CACHE_NAME) || '{}'
        storageObj = JSON.parse(storageObj)
        delete storageObj[tableId]
        localStorage.setItem(CACHE_NAME, JSON.stringify(storageObj))
      },
      clearStorageWidth() {
        const tableId = this.table.id
        let storageObj = localStorage.getItem(CACHE_WIDTH) || '{}'
        storageObj = JSON.parse(storageObj)
        delete storageObj[tableId]
        localStorage.setItem(CACHE_WIDTH, JSON.stringify(storageObj))
      },

      resetToDefault() {
        VXETable.modal.confirm({
          title: '提示',
          content: '是否恢复默认?',
          mask: true,
        }).then(async type => {
          if (type === 'confirm') {
            this.clearStorage()
            const defaults = this.defaultColumns.map(item => {
              if (!('visible' in item)) {
                item.visible = true
              }
              return item
            })
            this.table.reloadColumn(defaults).then(() => {
              const { setting } = this.$refs
              const columns = XEUtils.clone(defaults, true)
              setting.resetColumns(columns)
              this.$emit('ok', {
                type: 'set_column',
                data: {
                  columns
                }
              })
            })
            this.$message.success('操作成功!')
          }
        })
      }
    }
  }
</script>

<style>
.table-tools-item {
  display: flex;
}
</style>
<style scoped>
.reset-to-default {
  float: left;
  margin-left: 12px;
  font-size: 12px;
  margin-top: 7px;
}
</style>

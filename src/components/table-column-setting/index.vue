<template>
  <div class="table-column-setting">
    <setting-icon-btn @click="onBtnClick"></setting-icon-btn>

    <vxe-modal
      v-model="modalVisible"
      v-bind="modalProps"
      @close="onClose"
      @hide="onHide"
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
        <page-button theme="default" @click="onCancelClick">取消</page-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
  import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
  import settingIconBtn from './setting-icon-btn/index.vue'
  import tableSettingModal from './table-setting-modal/index.vue'

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
      settingIconBtn,
      tableSettingModal
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
        if (this.$parent.$xetable) {
          this.table = this.$parent.$xetable
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
        this.$emit('ok', columns)
        this.cancel()
      },

      setTableStorage(columns) {
        const tableId = this.table.id
        if (this.storage && tableId) {
          console.log('columnscolumns', columns)
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
          fixed: item.fixed
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
            this.table.reloadColumn(this.defaultColumns).then(() => {
              const { setting } = this.$refs
              setting.resetColumns(XEUtils.clone(this.defaultColumns, true))
            })
            this.$message.success('操作成功!')
          }
        })
      }
    }
  }
</script>

<style>
.table-column-setting {
  display: flex;
}
</style>
<style scoped>
.reset-to-default {
  float: left;
  margin-left: 12px;
  color: #69C0FF;
  font-size: 12px;
  margin-top: 7px;
}
</style>

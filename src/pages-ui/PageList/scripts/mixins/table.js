import XEUtils from 'xe-utils'
import { rowDown, rowUp } from '../table-utils'
import { handleStorageColumns, MaximizeTable, getColumnFilters } from '@/utils/vxe-table'
import { TABLE_COLUMNS, TABLE_COLUMNS_2 } from '../data/columns'
import { debounce } from '@/utils'

let maximizeTable = null

export default {
  computed: {

  },
  watch: {
    // tableData: {
    //   handler(newVal) {
    //     const { tableInfo } = this
    //     if (tableInfo) {
    //       const { container, sectionHeight, tableMinHeight } = tableInfo
    //       this.tableHeight = 0
    //       setTimeout(() => {
    //         if (container.clientHeight < sectionHeight) {
    //           this.tableHeight = tableMinHeight
    //         }
    //       }, 0)
    //     }
    //   },
    //   immediate: true
    // }
  },
  data() {
    return {
      tableData: [],
      tableColumns: [],
      defaultColumns: [],
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        
        showTotal: () => `共${this.pagination.total}条`,
        
      },
      editable: false,

      loaded: false,
      tableHeight: 'auto',
      tableInfo: null,

      tableFilters: {
        customerName: [
          { label: '客户名称', value: '客户名称' },
          { label: '测试', value: '测试' },
        ]
      },

      toLine: null,
      tableActions: {
        copy: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.tableData]
          const copyList = XEUtils.clone(list.filter((i, idx) => rows.includes(idx)), true).map(item => {
            delete item['id']
            delete item['_X_ROW_KEY']
            return item
          })
          const data = list.concat(copyList)
          this.tableData = data
          table.clearCheckboxRow()
          this.$nextTick(() => {
            table.setCheckboxRow(copyList.map((i, idx) => data[data.length - copyList.length + idx]), true)
          })
        },
        reverse: (table, selectedRows) => {
          const list = table.getTableData().tableData
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          list.forEach((item, index) => {
            let checked = rows.includes(index)
            table.setCheckboxRow(item, !checked)
          })
        },
        moveUp: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          }).sort((a, b) => a - b);
          const list = [...this.tableData]
          let frozen = []
          let newKeys = []
          rows.forEach((i) => {
            let idx = rowUp(list, i, frozen)
            newKeys.push(idx)
          })
          table.clearCheckboxRow()
          table.setCheckboxRow(newKeys.map(i => list[i]), true)
          this.tableData = list
        },
        moveDown: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          }).sort((a, b) => b - a)
          const list = [...this.tableData]
          let frozen = []
          let newKeys = []
          rows.forEach((i) => {
            let idx = rowDown(list, i, frozen)
            newKeys.push(idx)
          })
          table.clearCheckboxRow()
          table.setCheckboxRow(newKeys.map(i => list[i]), true)
          this.tableData = list
        },
        toTop: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.tableData]
          const arr1 = list.filter((i, idx) => rows.includes(idx))
          const arr2 = list.filter((i, idx) => !rows.includes(idx))
          const data = arr1.concat(arr2)
          table.clearCheckboxRow()
          table.setCheckboxRow(arr1.map((i, idx) => data[idx]), true)
          this.tableData = data
        },
        toBottom: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.tableData]
          const arr1 = list.filter((i, idx) => rows.includes(idx))
          const arr2 = list.filter((i, idx) => !rows.includes(idx))
          const data = arr2.concat(arr1)
          table.clearCheckboxRow()
          table.setCheckboxRow(arr1.map((i, idx) => data[data.length - arr1.length + idx]), true)
          this.tableData = data
        },
        delete: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.tableData]
          const data = list.filter((i, idx) => !rows.includes(idx))
          this.tableData = data
        },
        toLine: (table, selectedRows) => {
          let toLine = Number(this.toLine || 0)
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.tableData]

          const max = list.length - rows.length
          let targetIndex = toLine - 1
          targetIndex = targetIndex < 0 ? 0 : targetIndex
          targetIndex = targetIndex > max ? max : targetIndex

          const arr1 = list.filter((i, idx) => rows.includes(idx))
          let data = list.filter((i, idx) => !rows.includes(idx))
          data.splice(targetIndex, 0, ...arr1)
          table.clearCheckboxRow()
          table.setCheckboxRow(arr1.map((i, idx) => data[targetIndex + idx]), true)
          this.tableData = data
        }
      }
    }
  },
  mounted() {
    //this.tableInit(this.$refs.table)
    const { table, toolbar } = this.$refs
    if (table) {
      table.connect(toolbar)
    }

    let columns = this.handleColumns(TABLE_COLUMNS_2)
    columns = handleStorageColumns(columns, table.id)
    this.tableColumns = columns
    this.defaultColumns = XEUtils.clone(TABLE_COLUMNS_2, true)


    maximizeTable = new MaximizeTable(this.$refs.tableSection.$el)
    /**
     * @param {HTMLElement} tableContainer    表格容器
     * @param {HTMLElement} parentContainer   父容器
     */
    //maximizeTable = new MaximizeTable(this.$refs.tableSection.$el, document.querySelector('#app'))
  },
  methods: {
    onTableActionBtnClick(event) {
      const table = this.$refs.table
      const selectedRows = this.$refs.table.getCheckboxRecords()
      if (selectedRows.length === 0) return
      const fn = this.tableActions[event]
      fn && fn(table, selectedRows)
    },

    tableInit(table, data = [], callback = null) {
      this.loaded = false
      this.tableData = []
      this.$nextTick(() => {
        const tableEl = table.$el
        const body = tableEl.parentNode
        const container = body.parentNode
        const section = container.parentNode
        this.tableInfo = {
          body,
          container,
          section,
          sectionHeight: section.clientHeight,
          tableMinHeight: body.clientHeight
        }
        this.tableHeight = body.clientHeight
        this.loaded = true
        setTimeout(() => {
          this.tableData = [...data]
          this.handleColumnFilters()
          typeof callback === 'function' && callback()
        }, 0)
      })
    },

    handleColumns(columns) {
      //columns = [{ type: 'checkbox', fixed: 'left', width: 70, resizable: false, align: 'center' }].concat(columns)
      return columns.map(item => {
        if (item.digits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.digits)
          }
        }

        return item
      })
    },

    handleColumnFilters() {
      const { table } = this.$refs
      this.tableColumns.forEach(item => {
        if (item.filters && this.tableFilters[item.field]) {
          const filters = getColumnFilters(item, this.tableData)
          table.setFilter(item.field, filters)
        }
      })
    },

    onExpand() {
      //this.tableInit(this.$refs.table, this.tableData)
    },

    onToolOk(e) {
      const { type, data } = e
      const fn = this.toolMethods()[type]
      fn && fn(data)
    },
    toolMethods() {
      return {
        maximize: data => {
          const { maximize } = data
          if (maximize) {
            maximizeTable.maximize()
          } else {
            maximizeTable.restoreTable()
          }
        }
      }
    },

    onPriceChange(e, rowIndex, columnIndex, column) {
      debounce(this.freshColumnFilters)(column)
    },
    freshColumnFilters(column) {
      console.log('freshColumnFilters', column)
      const { table } = this.$refs
      const { field } = column
      const filters = getColumnFilters(column, this.tableData)
      table.setFilter(field, filters)
    }

  }
}

import { handleNextFocus } from './focus-helper'

const CACHE_NAME = 'VXE_TABLE_CUSTOM_COLUMN_ORDERLIST'
const VXE_TABLE_CUSTOM_COLUMN_WIDTH = 'VXE_TABLE_CUSTOM_COLUMN_WIDTH'
const VXE_TABLE_CUSTOM_COLUMN_AUTOWIDTH = 'VXE_TABLE_CUSTOM_COLUMN_AUTOWIDTH'
const handleStorageColumns = (tableColumns, id) => {
  let storage = localStorage.getItem(CACHE_NAME) ?? '{}'
  storage = JSON.parse(storage)
  let list = storage[id] || []
  let columns = []
  let columnList = [...tableColumns]
  list.forEach(item => {
    let findIndex = columnList.findIndex(x => x.title === item.title)
    if (findIndex > -1) {
      let find = columnList.splice(findIndex, 1)[0]
      find.fixed = item.fixed
      find.visible = item.visible
      columns.push(find)
    }
  })
  columns = columns.concat(columnList)
  // columns = columns.map(item => {
  //   let storage = localStorage.getItem(VXE_TABLE_CUSTOM_COLUMN_WIDTH) ?? '{}'
  //   let storage2 = localStorage.getItem(VXE_TABLE_CUSTOM_COLUMN_AUTOWIDTH) ?? '{}'
  //   storage = JSON.parse(storage)
  //   storage2 = JSON.parse(storage2)
  //   let obj = storage[`${id}`] ?? {}
  //   let obj2 = storage2[`${id}`] ?? []
  //   if (obj[item.field] !== undefined) {
  //     item.width = obj[item.field]
  //   } else {
  //     if (obj2.includes(item.field)) {
  //       item.width = undefined
  //     }
  //   }
  //   return item
  // })
  return columns
}

const maximizeTable = (tableContainer, parentContainer) => {
  if (!parentContainer) return
  const { tableDIV } = this.$refs
  this.movedTable = {
    prev: tableContainer.previousElementSibling,
    parent: tableContainer.parentElement
  }
  parentContainer.appendChild(tableContainer)
}
const restoreTable = (tableContainer, parentContainer) => {
  const container = this.getContainer()
  if (!container) return
  const { tableDIV } = this.$refs
  if (this.movedTable.prev) {
    this.movedTable.parent.insertBefore(tableDIV, this.movedTable.prev.nextSibling)
  } else {
    this.movedTable.parent.appendChild(tableDIV)
  }
}

const getColumnFilters = (column, tableData, sourceList = null) => {
  const { field } = column
  const dataList = tableData.map(item => String(item[field] ?? ''))
  const list = Array.from(new Set(dataList)).map(value => {
    let label = value
    if (sourceList) {
      label = sourceList.find(x => x.value == value)?.label || ''
    }
    return {
      label,
      value
    }
  })
  return list
}

class MaximizeTable {
  table = null
  parent = null
  store = {}
  /**
   * @param {HTMLElement} tableContainer    表格容器
   * @param {HTMLElement} parentContainer   父容器
   */
  constructor(tableContainer, parentContainer) {
    this.table = tableContainer
    this.parent = parentContainer
  }
  maximize() {
    if (this.table) {
      this.table.classList.add('table--maximize')
    }
    if (!this.parent) return
    this.store = {
      prev: this.table.previousElementSibling,
      parent: this.table.parentElement
    }
    this.parent.appendChild(this.table)
  }
  restoreTable() {
    if (this.table) {
      this.table.classList.remove('table--maximize')
    }
    if (!this.parent) return
    if (this.store.prev) {
      this.store.parent.insertBefore(this.table, this.store.prev.nextSibling)
    } else {
      this.store.parent.appendChild(this.table)
    }
  }
}

export {
  handleStorageColumns,
  MaximizeTable,
  handleNextFocus,
  getColumnFilters
}

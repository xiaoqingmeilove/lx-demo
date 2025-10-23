const fn = {
  null: (item, field, value) => {
    return (item[field] ?? '') == ''
  },  
  notnull: (item, field, value) => {
    return (item[field] ?? '') != ''
  },  
  eq: (item, field, value) => {
    // const val = String(item[field] ?? '')
    // const regex = new RegExp(`^(${value})$`)
    // return regex.test(val)
    if (item[field] == value) return true
    const val = item[field] ?? ''
    if (val === '') return false
    return Number(val) == Number(value)
  },
  neq: (item, field, value) => {
    return item[field] != value
  },
  gt: (item, field, value) => {
    if (/^(-)?\d+(\.\d+)?$/.test(value)) {
      value = Number(value)
    }
    let val = item[field] ?? 0
    if (/^(-)?\d+(\.\d+)?$/.test(val)) {
      val = Number(val)
    }
    return val > value
  },
  lt: (item, field, value) => {
    if (/^(-)?\d+(\.\d+)?$/.test(value)) {
      value = Number(value)
    }
    let val = item[field] ?? 0
    if (/^(-)?\d+(\.\d+)?$/.test(val)) {
      val = Number(val)
    }
    return val < value
  },
  gte: (item, field, value) => {
    if (/^(-)?\d+(\.\d+)?$/.test(value)) {
      value = Number(value)
    }
    let val = item[field] ?? 0
    if (/^(-)?\d+(\.\d+)?$/.test(val)) {
      val = Number(val)
    }
    return val > value || val == value
  },
  lte: (item, field, value) => {
    if (/^(-)?\d+(\.\d+)?$/.test(value)) {
      value = Number(value)
    }
    let val = item[field] ?? 0
    if (/^(-)?\d+(\.\d+)?$/.test(val)) {
      val = Number(val)
    }
    return val < value || val == value
  },
  like: (item, field, value) => {
    if (!value) return false
    return String(item[field] ?? '').indexOf(value) > -1
  },
  nlike: (item, field, value) => {
    const val = String(item[field] ?? '')
    const regex = new RegExp(`^(?!.*${value}).*$`)
    return regex.test(val)
  },
  start: (item, field, value) => {
    const val = String(item[field] ?? '')
    const regex = new RegExp(`^${value}`)
    return regex.test(val)
  },
  end: (item, field, value) => {
    const val = String(item[field] ?? '')
    const regex = new RegExp(`${value}$`)
    return regex.test(val)
  },
}

export const OPERATORS = {
  NULL: 'null',
  NOTNULL: 'notnull',
  EQ: 'eq',
  NEQ: 'neq',
  GT: 'gt',
  LT: 'lt',
  GTE: 'gte',
  LTE: 'lte',
  LIKE: 'like',
  NLIKE: 'nlike',
  START: 'start',
  END: 'end'
}

export const OPERATOR_LIST = [
  { label: '空值', value: 'null', },
  { label: '非空值', value: 'notnull', },
  { label: '等于', value: 'eq', },
  { label: '不等于', value: 'neq', },
  { label: '大于', value: 'gt', },
  { label: '小于', value: 'lt', },
  { label: '大于等于', value: 'gte', },
  { label: '小于等于', value: 'lte', },
  { label: '包含', value: 'like', },
  { label: '不包含', value: 'nlike' },
  { label: '开始', value: 'start' },
  { label: '结尾', value: 'end' }
]

export function handleFilterItem(item, filters) {
  return filters.every(filter => {
    const filterFn = fn[filter.where]
    return filterFn(item, filter.field, filter.value)
  })
}

export function handleFilterData(data, filters) {
  filters = filters.filter(item => !!item.where)
  if (filters.length) {
    return data.filter(item => handleFilterItem(item, filters))
  }
  return data
}

export const FILTER_ITEM_CLASSNAME = 'filter-item--hidden'

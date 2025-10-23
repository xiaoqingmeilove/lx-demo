const descItems = [
  { label: '竞价项目编号', field: 'projectBillNo', type: '', width: '33%'  },
  { label: '竞价项目名称', field: 'projectName', type: '', width: '33%'  },
  { label: '竞价申请日期', field: 'applyTime', type: '', width: '33%'  },
  { label: '竞价说明', field: 'describeRemark', type: '', width: '99%'  },
  { label: '项目状态', field: 'projectStatusName', type: '', width: '33%'  },
  { label: '受邀供应商', field: 'supplierList', type: '', width: '66%', slot: 'supplierListObj' },
]

const descItems1 = [
  { label: '报名截止时间', field: 'signUpDeadlineTime', required: true, type: 'datetime', width: '33%'  },
  { label: '竞价开始时间', field: 'beginTime', required: true, type: 'datetime', width: '33%' },
  { label: '竞价结束时间', field: 'endTime', required: true, type: 'datetime', width: '33%'  },
  { label: '核价截止时间', field: 'pricingDeadlineTime', required: true, type: 'datetime', width: '33%'  },
  { label: '中标公示时间', field: 'promulgateTime', required: true, type: 'datetime', width: '33%'  },
]

const descItems2 = [
  { label: '报价说明', field: 'quoteDescription', required: true, type: 'textarea', width: '66%'  },
  { label: '含税总金额', field: 'amount', required: true, type: 'number', disabled: true, digits: 2, precision: 2, formatterName: 'toFixedNumber', width: '33%' },
  { label: '金额大写', field: 'amountName', required: true, type: 'input', disabled: true, width: '33%'  },
  { label: '不含税总价', field: 'untaxAmount', required: true, type: 'number', disabled: true, digits: 2, precision: 2, formatterName: 'toFixedNumber', width: '33%'  },
  { label: '税额', field: 'taxRate', required: true, type: 'number', disabled: true, digits: 2, precision: 2, formatterName: 'toFixedNumber', width: '33%'  },
]

export { descItems, descItems1, descItems2 }
const descItems = [
  { label: '报名资格确认', field: 'involvedFlag', fieldName: 'involvedFlagName', required: true, type: 'radio', width: '99%', source: 'involvedFlagList' },
  { label: '报名说明', field: 'rejectReason', type: 'textarea', width: '99%'  },
]
const descItems1 = [
  { label: '竞价项目编号', field: 'projectBillNo', type: '', width: '33%'  },
  { label: '竞价项目名称', field: 'projectName', type: '', width: '33%'  },
  { label: '竞价申请日期', field: 'applyTime', type: '', width: '33%'  },
  { label: '竞价说明', field: 'describeRemark', type: '', width: '99%'  },
  { label: '项目状态', field: 'projectStatusName', type: '', width: '33%'  },
  { label: '受邀供应商', field: 'supplierList', type: '', width: '66%', slot: 'supplierListObj' },
]

const descItems2 = [
  { label: '报名截止时间', field: 'signUpDeadlineTime', required: true, type: '', width: '33%'  },
  { label: '竞价开始时间', field: 'beginTime', required: true, type: '', width: '33%' },
  { label: '竞价结束时间', field: 'endTime', required: true, type: '', width: '33%'  },
  { label: '核价截止时间', field: 'pricingDeadlineTime', required: true, type: '', width: '33%'  },
  { label: '中标公示时间', field: 'promulgateTime', required: true, type: '', width: '33%'  },
]

export { descItems, descItems1, descItems2 }
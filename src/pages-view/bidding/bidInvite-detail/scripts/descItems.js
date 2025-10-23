const descItems = [
  { label: '竞价项目编号', field: 'projectBillNo', required: true, type: 'input', width: '33%' },
  { label: '竞价项目名称', field: 'projectName', required: true, type: 'input', width: '33%'  },
  { label: '竞价申请日期', field: 'applyTime', required: true, type: 'datetime', width: '33%'  },
  { label: '竞价说明', field: 'describeRemark', type: 'textarea', width: '99%'  },
  { label: '项目状态', field: 'projectStatusName', type: '', width: '33%', },
  { label: '供应商', field: 'supplierList', required: true, type: '', width: '66%', slot: 'supplierListObj'  },
]
const descItems1 = [
  { label: '是否需要资格预审', field: 'reviewFlag', required: true, type: 'radio', width: '33%', source: 'flagList'  },
  { label: '竞价方向', field: 'biddingDirectionCode', fieldName: 'biddingDirectionName', type: 'radio', source: 'biddingDirectionList', width: '66%' },
  { label: '询价员', field: 'inquiryUser', fieldName: 'inquiryUserName', type: 'select', width: '33%', source: 'inquiryUserList'  },
  { label: '联系电话', field: 'linkerTel',required: true, type: 'input', width: '33%'  },
  { label: '联系邮箱', field: 'linkerEmail', type: 'input', width: '33%'  },

  { label: '每次出价间隔', field: '', type: '', width: '99%', slot: 'bid_interval'  },
  { label: '截止时间', field: '', type: '', width: '99%', slot: 'deadline'  },

  { label: '投标人报价查看范围', field: 'buddingViewFlag', fieldName: 'buddingViewFlagName', type: 'radio', width: '99%', source: 'buddingViewList'  },
  { label: '允许提交相同报价', field: 'sameQuotationFlag', fieldName: 'sameQuotationFlagName', required: true, type: 'radio', width: '99%', source: 'sameQuotationList' },
  { label: '拒绝投标是否需要说明原因', field: 'rejectReasonFlag', type: 'radio', width: '33%', source: 'rejectReasonFlagList' },
  // { label: '拒绝投标是否需要说明原因', field: 'rejectReason', type: 'textarea', width: '66%' },
]
const descItems2 = [
  { label: '报名截止时间', field: 'signUpDeadlineTime', required: true, type: 'datetime', width: '33%'  },
  { label: '竞价开始时间', field: 'beginTime', required: true, type: 'datetime', width: '33%' },
  { label: '竞价结束时间', field: 'endTime', required: true, type: 'datetime', width: '33%'  },
  { label: '核价截止时间', field: 'pricingDeadlineTime', required: true, type: 'datetime', width: '33%'  },
  { label: '中标公示时间', field: 'promulgateTime', required: true, type: 'datetime', width: '33%'  },
]

export { descItems, descItems1, descItems2 }

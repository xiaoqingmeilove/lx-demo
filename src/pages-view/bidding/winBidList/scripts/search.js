const searchOptions = [
  {
    "label": "竞价核价单号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入竞价核价单号",
    "isDefault": true
  },
  {
    "label": "提交时间",
    "fields": [
      "beginSubmissionTime",
      "endSubmissionTime"
    ],
    "type": "datePicker",
    "isDefault": true
  },
  {
    "label": "审核时间",
    "fields": [
      "beginAuditDate",
      "endAuditDate"
    ],
    "type": "datePicker",
    "isDefault": true
  },
  {
    "label": "中标数量",
    "fields": ['beginQty', 'endQty'],
    "type": 'numberRange',
    "isDefault": true
  },
  {
    "label": "竞价单号",
    "field": "offerBillNo",
    "type": "input",
    "placeholder": "请输入竞价单号",
  },
  {
    "label": "报价时间",
    "fields": [
      "beginCreateTime",
      "endCreateTime"
    ],
    "type": "datePicker",
  },
  {
    "label": "竞价项目名称",
    "field": "projectName",
    "type": "input",
    "placeholder": "请输入竞价项目名称",
  },
  {
    "label": "供应商名称",
    "field": "businessLicense",
    "type": "input",
    "placeholder": "请输入供应商名称",
  },
  {
    "label": "竞价开始时间",
    "fields": [
      "bidBeginTime",
      "bidEndTime"
    ],
    "type": "datePicker",
  },
  {
    "label": "竞价截止时间",
    "fields": [
      "beginOffTime",
      "endOffTime"
    ],
    "type": "datePicker",
  },
  {
    "label": "型号",
    "field": "model",
    "type": "input",
    "placeholder": "请输入型号",
  },
  {
    "label": "规格",
    "field": "standard",
    "type": "input",
    "placeholder": "请输入规格",
  },
  {
    "label": "电压",
    "field": "voltageLevel",
    "type": "input",
    "placeholder": "请输入电压",
  },
]
export { searchOptions }
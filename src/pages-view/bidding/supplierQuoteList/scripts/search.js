const searchOptions = [
  {
    "label": "竞价单号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入竞价单号",
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
    "label": "竞价项目名称",
    "field": "projectName",
    "type": "input",
    "placeholder": "请输入竞价项目名称",
    "isDefault": true
  },
  {
    "label": "供应商名称",
    "field": "businessLicense",
    "type": "input",
    "placeholder": "请输入供应商名称",
    "isDefault": true
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
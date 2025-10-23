const searchOptions = [
  {
    "label": "报价单号",
    "field": "offerBillNo",
    "type": "input",
    "placeholder": "请输入报价单号",
    "isDefault": true
  },
  {
    "label": "报价时间",
    "fields": [
      "beginOfferTime",
      "endOfferTime"
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
    "label": "含税总金额",
    "fields": ['beginAmount', 'endAmount'],
    "type": 'numberRange',
  },
  {
    "label": "竞价单号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入竞价单号",
  },
]
export { searchOptions }
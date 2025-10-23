const searchOptions = [
  {
    "label": "流水号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入流水号",
    "isDefault": true
  },
  {
    "label": "类型名称",
    "field": "parcelBillNo",
    "type": "input",
    "placeholder": "请输入类型名称",
    "isDefault": true
  },
  {
    "label": "提交人",
    "field": "carNo",
    "type": "input",
    "placeholder": "请输入提交人",
    "isDefault": true
  },
  {
    "label": "提交时间",
    "fields": [
      "beginSignTime",
      "endSignTime"
    ],
    "type": "datePicker",
    "isDefault": true
  },
  {
    "label": "更新时间",
    "fields": [
      "beginSupplementDate",
      "endSupplementDate"
    ],
    "type": "datePicker"
  },
]
export { searchOptions }
const searchOptions = [
  {
    "label": "单据状态",
    "field": "billStateList",
    "type": "selectmulti",
    "output": "string",
    "placeholder": "请选择单据状态",
    "source": "billStatelist",
    "isDefault": true
  },
  {
    "label": "竞价开始时间",
    "fields": [
      "bidBeginTime",
      "bidEndTime"
    ],
    "type": "datePicker",
    "isDefault": true
  },
  {
    "label": "竞价截止时间",
    "fields": [
      "beginOffTime",
      "endOffTime"
    ],
    "type": "datePicker",
    "isDefault": true
  },
  {
    "label": "项目名称",
    "field": "projectName",
    "type": "input",
    "placeholder": "请输入项目名称",
    "isDefault": true
  },
  {
    "label": "被邀请供应商",
    "field": "businessLicense",
    "type": "input",
    "placeholder": "请输入被邀请供应商"
  },
]
export { searchOptions }
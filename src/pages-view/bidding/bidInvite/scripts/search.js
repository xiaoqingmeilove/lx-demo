const searchOptions = [
  {
    "label": "竞价单号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入竞价单号",
    "isDefault": true
  },
  {
    "label": "单据状态",
    "field": "billStateList",
    "type": "selectmulti",
    "output": "string",
    "placeholder": "请选择单据状态",
    "source": "billStateList",
    "isDefault": true
  },
  {
    "label": "单据时间",
    "fields": [
      "beginCreateTime",
      "endCreateTime"
    ],
    "type": "datePicker",
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
    "label": "项目编号",
    "field": "projectBillNo",
    "type": "input",
    "placeholder": "请输入项目编号",
  },
  {
    "label": "审核时间",
    "fields": [
      "beginAuditDate",
      "endAuditDate"
    ],
    "type": "datePicker",
  },
 
  {
    "label": "申请人",
    "field": "createUserName",
    "type": "input",
    "placeholder": "请输入申请人",
  },
  {
    "label": "审核人",
    "field": "auditorName",
    "type": "input",
    "placeholder": "请输入审核人",
  },
  {
    "label": "竞价项目",
    "field": "projectName",
    "type": "input",
    "placeholder": "请输入竞价项目"
  },
  {
    "label": "竞价申请日期",
    "fields": [
      "beginApplyTime",
      "endApplyTime"
    ],
    "type": "datePicker",
  },
  {
    "label": "报名截止时间",
    "fields": [
      "beginSignUpDeadlineTime",
      "endSignUpDeadlineTime"
    ],
    "type": "datePicker",
  },
]
export { searchOptions }
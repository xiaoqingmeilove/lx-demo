const searchOptions = [
  {
    "label": "邀请单号",
    "field": "businessBillNo",
    "type": "input",
    "placeholder": "请输入邀请单号",
    "isDefault": true
  },
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
    "label": "项目名称",
    "field": "projectName",
    "type": "input",
    "placeholder": "请输入项目名称"
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
  {
    "label": "竞价项目编号",
    "field": "projectBillNo",
    "type": "input",
    "placeholder": "请输入竞价项目编号"
  },
]
export { searchOptions }
[
  {
    "label": "企业名称",
    "field": "supplierName",
    "type": "input",
    "isDefault": true
  },
  {
    "label": "变更单号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入变更单号",
    "isDefault": true
  },
  {
    "label": "供应商单号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入供应商单号",
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
    "label": "申请时间",
    "fields": [
      "beginSubmissionTime",
      "endSubmissionTime"
    ],
    "type": "datePicker"
  },
  {
    "label": "审核时间",
    "fields": [
      "beginAuditDate",
      "endAuditDate"
    ],
    "type": "datePicker"
  }
]

[
  { "label": "比价单号", "field": "billNo", "type": "input", "isDefault": true },
  { "label": "单据状态", "field": "billStateList", "type": "selectmulti", "isDefault": true, "source": "statelist", "output": "string" },
  { "label": "单据时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker", "isDefault": true },
  { "label": "提交时间", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker", "isDefault": true },
  { "label": "审核时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker", "isDefault": false },
  { "label": "申请人", "field": "createUserName", "type": "input", "isDefault": false },
  { "label": "审核人", "field": "auditorName", "type": "input", "isDefault": false },
  { "label": "询价项目", "field": "projectName", "type": "input", "isDefault": false },
  { "label": "询价日期", "fields": ["beginEnquiryDate", "endEnquiryDate"], "type": "datePicker", "isDefault": false },
  { "label": "报价截止时间", "fields": ["beginDeadlineQuoteDate", "endDeadlineQuoteDate"], "type": "datePicker", "isDefault": false },
  { "label": "询价轮数", "fields": ["beginCurrentEnquiryTimes", "endCurrentEnquiryTimes"], "type": "numberRange", "isDefault": false },
  { "label": "询价单号", "field": "fromBillNo", "type": "input", "isDefault": false }
]



[
  { "field": "billNo", "title": "比价单号", "width": 190, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true },
  { "field": "projectName", "title": "询价项目名称", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryDate", "title": "询价日期", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryDescription", "title": "询价说明", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryStateName", "title": "询价状态", "minWidth": 70, "align": "left", "sortable": true, "visible": false },
  { "field": "currentEnquiryTimes", "title": "询价轮数", "minWidth": 70, "align": "right", "sortable": true, "visible": true },
  { "field": "deadlineQuoteDate", "title": "报价截止时间", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "quotedSupplierNum", "title": "参与供应商数", "minWidth": 70, "align": "right", "sortable": true, "visible": true },
  { "field": "enquiryApplyBillNo", "title": "询价单号", "width": 190, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "billStateName", "title": "单据状态", "minWidth": 100, "resizable": false, "fixed": "right", "align": "left", "sortable": true, "slots": { "default": "billState" }, "visible": true },
  { "field": "createTime", "title": "单据时间", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "createUserName", "title": "创建人", "minWidth": 70, "align": "left", "sortable": true },
  { "field": "submissionTime", "title": "提交时间", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditDate", "title": "审核时间", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditorName", "title": "审核人", "minWidth": 70, "align": "left", "sortable": true, "visible": true }
]

[
  { "label": "询价项目", "field": "projectName", "required": true, "type": "", "width": "33%" },
  { "label": "询价日期", "field": "enquiryDate", "type": "", "width": "33%", "required": true },
  { "label": "询价说明", "field": "enquiryDescription", "required": true, "type": "", "width": "33%" },
  { "label": "报价截止时间", "field": "deadlineQuoteDate", "type": "", "width": "33%", "required": true },
  { "label": "询价方式", "field": "enquiryTypeName", "required": true, "type": "", "width": "33%" },
  { "label": "提醒方式", "field": "remindMethodName", "required": true, "type": "", "width": "33%" },
  { "label": "中标方式", "field": "bidWinMethodName", "required": true, "type": "", "width": "33%" },
  { "label": "关联询价单号", "field": "enquiryApplyBillId", "type": "", "width": "33%" },
  { "label": "询价轮数", "field": "currentEnquiryTimes", "type": "", "width": "33%" },
  { "label": "授标方式", "field": "awardMethod", "required": true, "type": "select", "source": "awardMethodList", "width": "33%" },
  { "label": "中标供应商", "field": "supplierId", "required": true, "type": "select", "source": "supplierList", "width": "33%" }
]



[
  {
    label: "结果确认单号",
    field: "billNo",
    type: "input",
    isDefault: true,
  },
  {
    label: "单据状态",
    field: "billStateList",
    type: "selectmulti",
    isDefault: true,
    source: "statelist",
    output: "string",
  },
  {
    label: '单据时间',
    fields: ['beginCreateTime', 'endCreateTime'],
    type: 'datePicker',
    isDefault: true,
  },
  {
    label: '提交时间',
    fields: ['beginSubmissionTime', 'endSubmissionTime'],
    type: 'datePicker',
    isDefault: true,
  },
  {
    label: '审核时间',
    fields: ['beginAuditDate', 'endAuditDate'],
    type: 'datePicker',
    isDefault: false,
  },
  {
    label: "申请人",
    field: "createUserName",
    type: "input",
    isDefault: false,
  },
  {
    label: "审核人",
    field: "auditorName",
    type: "input",
    isDefault: false,
  },
  {
    label: "询价项目",
    field: "projectName",
    type: "input",
    isDefault: false,
  },
  {
    label: '询价日期',
    fields: ['beginEnquiryDate', 'endEnquiryDate'],
    type: 'datePicker',
    isDefault: false,
  },
  {
    label: '报价截止时间',
    fields: ['beginDeadlineQuoteDate', 'endDeadlineQuoteDate'],
    type: 'datePicker',
    isDefault: false,
  },
  {
    label: "报价轮数",
    fields: ["beginCurrentEnquiryTimes", "endCurrentEnquiryTimes"],
    type: "numberRange",
    isDefault: false,
  },
  {
    label: "询价单号",
    field: "fromBillNo",
    type: "input",
    isDefault: false,
  },
]
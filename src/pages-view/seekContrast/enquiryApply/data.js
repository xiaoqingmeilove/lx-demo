[
  { "label": "询价单号", "field": "billNo", "type": "input", "isDefault": true },
  { "label": "单据状态", "field": "billStateList", "type": "selectmulti", "isDefault": true, "source": "statelist", "output": "string" },
  { "label": "单据时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker", "isDefault": true },
  { "label": "项目状态", "field": "enquiryStateList", "type": "selectmulti", "source": "enquiryState", "output": "string", "isDefault": true },
  { "label": "提交时间", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker" },
  { "label": "审核时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker" },
  { "label": "申请人", "field": "createUserName", "type": "input" },
  { "label": "审核人", "field": "auditorName", "type": "input" },
  { "label": "询价项目", "field": "projectName", "type": "input" },
  { "label": "询价日期", "fields": ["beginEnquiryDate", "endEnquiryDate"], "type": "datePicker" },
  { "label": "报价截止时间", "fields": ["beginQuoteTime", "endQuoteTime"], "type": "datePicker" },
  { "label": "询价轮数", "fields": ["beginCurrentEnquiryTimes", "endCurrentEnquiryTimes"], "type": "numberRange" }
]

[
  { "field": "billNo", "title": "询价单号", "width": 190, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true },
  { "field": "projectName", "title": "询价项目名称", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryDate", "title": "询价日期", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "currentEnquiryTimes", "title": "询价轮数", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "endQuoteTime", "title": "报价截止时间", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryStateName", "title": "项目状态", "width": 100, "minWidth": 100, "resizable": false, "fixed": "right", "align": "left", "sortable": true, "slots": { "default": "enquiryState" }, "visible": true },
  { "field": "billStateName", "title": "单据状态", "width": 100, "minWidth": 100, "resizable": false, "fixed": "right", "align": "left", "sortable": true, "slots": { "default": "billState" }, "visible": true },
  { "field": "createTime", "title": "单据时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "createUserName", "title": "创建人", "width": 160, "minWidth": 70, "align": "left", "sortable": true },
  { "field": "submissionTime", "title": "提交时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditDate", "title": "审核时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditorName", "title": "审核人", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true }
]










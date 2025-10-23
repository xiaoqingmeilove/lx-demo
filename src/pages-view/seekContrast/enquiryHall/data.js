// [{"field":"billNo","title":"询价单号","width":190,"minWidth":70,"resizable":false,"fixed":"left","align":"left","sortable":true,"visible":true},{"field":"projectName","title":"询价项目名称","width":160,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"enquiryDate","title":"询价日期","width":160,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"enquiryDescription","title":"询价说明","width":160,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"enquiryStateName","title":"询价状态","width":160,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"currentEnquiryTimes","title":"询价轮数","width":160,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"deadlineQuoteDate","title":"报价截止时间","width":160,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"quotedSupplierNum","title":"参与供应商数","width":160,"minWidth":70,"align":"right","sortable":true,"visible":true},{"field":"billStateName","title":"单据状态","width":180,"minWidth":100,"resizable":false,"align":"left","sortable":true,"slots":{"default":"billState"},"visible":true},{"field":"createTime","title":"单据时间","width":170,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"createUserName","title":"创建人","width":160,"minWidth":70,"align":"left","sortable":true},{"field":"submissionTime","title":"提交时间","width":170,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"auditDate","title":"审核时间","width":170,"minWidth":70,"align":"left","sortable":true,"visible":true},{"field":"auditorName","title":"审核人","width":160,"minWidth":70,"align":"left","sortable":true,"visible":true}]

[
  { "field": "billNo", "title": "询价单号", "width": 190, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true },
  { "field": "projectName", "title": "询价项目名称", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryDate", "title": "询价日期", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryStateName", "title": "项目状态", "minWidth": 70, "align": "left", "sortable": true, "visible": true, "slots": { "default": "enquiryState" } },
  { "field": "quoteStateName", "title": "报价状态", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "endQuoteTime", "title": "报价截止时间", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "currentEnquiryTimes", "title": "报价轮数", "minWidth": 70, "align": "right", "sortable": true, "visible": true },
  { "field": "quotedSupplierNum", "title": "参与供应商数", "minWidth": 70, "align": "right", "sortable": true, "visible": true }
]

[
  { "label": "询价单号", "field": "billNo", "type": "input", "isDefault": true },
  { "label": "单据时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker", "isDefault": true },
  { "label": "提交时间", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker", "isDefault": true },
  { "label": "审核时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker", "isDefault": false },
  { "label": "申请人", "field": "createUserName", "type": "input", "isDefault": false },
  { "label": "审核人", "field": "auditorName", "type": "input", "isDefault": false },
  { "label": "项目状态", "field": "enquiryStatList", "type": "selectmulti", "source": "enquiryStat", "output": "string" },
  { "label": "询价项目名称", "field": "projectName", "type": "input", "isDefault": true },
  { "label": "询价日期", "fields": ["beginEnquiryDate", "endEnquiryDate"], "type": "datePicker", "isDefault": false },
  { "label": "报价截止时间", "fields": ["beginDeadlineQuoteDate", "endDeadlineQuoteDate"], "type": "datePicker", "isDefault": false },
  { "label": "询价轮数", "fields": ["beginCurrentEnquiryTimes", "endCurrentEnquiryTimes"], "type": "numberRange", "isDefault": false }
]


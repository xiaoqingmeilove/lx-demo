[
    { "label": "项目编号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "项目名称", "field": "projectName", "type": "input", "isDefault": true },
    { "label": "定标时间", "fields": ["beginBidReleaseTime", "endBidReleaseTime"], "type": "datePicker", "isDefault": true },
    { "label": "提交时间", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker", "isDefault": true },
    { "label": "审核状态", "field": "billStateList", "type": "selectmulti", "source": "billStateList", "output": "string" },
    { "label": "审核人", "field": "auditorName", "type": "input"}
]

[
  { "field": "billNo", "title": "项目编号", "width": 200, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "projectName", "title": "项目名称", "width": 200, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "purchaseTypeName", "title": "采购类型", "width": 150, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "amount", "title": "预算金额", "width": 150, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "bidReleaseTime", "title": "定标时间",  "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "submissionTime", "title": "提交时间",  "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "billStateName", "title": "审核状态", "width": 150, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "auditorName", "title": "审核人",  "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "auditDate", "title": "审核时间", "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true}
]


  
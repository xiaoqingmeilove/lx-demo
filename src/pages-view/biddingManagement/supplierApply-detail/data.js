

[
  { "label": "项目名称", "field": "projectName", "type": "input", "isDefault": true },
  { "label": "发布日期", "fields": ["beginReleaseTime", "endReleaseTime"], "type": "datePicker", "isDefault": true },
  { "label": "确认截止日期", "fields": ["beginDeadlineTime", "endDeadlineTime"], "type": "datePicker", "isDefault": true },
  { "label": "招标类型", "field": "purchaseMethodList", "type": "selectmulti", "source": "purchaseMethodList", "output": "string", "isDefault": true },
  { "label": "当前状态", "field": "bizFlowStatusList", "type": "selectmulti", "source": "bizFlowStatusList", "output": "string" },
  { "label": "报名状态", "field": "registrationStatusList", "type": "selectmulti", "source": "registrationStatusList", "output": "string" }
]



[
  { "field": "projectName", "title": "项目名称", "width": 350, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true, "slots": { "default": "projectName" } },
  { "field": "releaseTime", "title": "发布日期", "align": "left", "sortable": true, "visible": true },
  { "field": "deadlineTime", "title": "确认截止日期", "align": "left", "sortable": true, "visible": true },
  { "field": "purchaseMethodName", "title": "招标类型", "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "bizFlowStatusName", "title": "当前状态", "minWidth": 70, "align": "left", "sortable": true, "visible": true }
]










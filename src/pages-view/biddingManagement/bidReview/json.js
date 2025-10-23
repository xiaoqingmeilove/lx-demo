[
    { "label": "项目编号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "项目名称", "field": "projectName", "type": "input", "isDefault": true },
    { "label": "评标截止时间", "fields": ["beginEvaluationDate", "endEvaluationDate"], "type": "datePicker", "isDefault": true },
    { "label": "状态", "field": "scoreStatusList", "type": "selectmulti", "source": "scoreStatusList", "output": "string" , "isDefault": true }
]

[
  { "field": "billNo", "title": "项目编号", "width": 200, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "projectName", "title": "项目名称", "width": 200, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "bizFlowStatusName", "title": "项目状态", "width": 200, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true,"slots": { "default": "bizFlowStatusList" }},
  { "field": "evaluationDate", "title": "评标截止时间", "width": 150, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "purchaseTypeName", "title": "招标类型", "width": 150, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "scoreStatusName", "title": "当前状态", "width": 150, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true},
  { "field": "action", "title": "操作",  "minWidth": 70, "resizable": false, "fixed": "left", "align": "left",  "slots": { "default": "action" }  }
]




  
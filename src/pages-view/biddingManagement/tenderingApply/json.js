const { param } = require("@/utils");

//search
[
    { "label": "招标编号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "项目名称", "field": "projectName", "type": "input", "isDefault": true },
    { "label": "预算金额", "fields": ["beginAmount", "endAmount"], "type": "numberRange", "isDefault": true },
    { "label": "采购类型", "field": "purchaseTypeList", "type": "selectmulti", "source": "purchaseTypeList", "output": "string", "isDefault": true },
    { "label": "状态", "field": "billStateList", "type": "selectmulti", "source": "billStateList", "output": "string" },
    { "label": "创建时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker" },
    { "label": "开标截止时间", "fields": ["beginBidOpeningTime", "endBidOpeningTime"], "type": "datePicker" }
]
// table
[
    { "field": "rowNum", "title": "序号", "width": "60", "minWidth": "60", "align": "left", "slots": { "default": "rowNum" } },
    { "field": "billNo", "title": "招标编号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "projectName", "title": "项目名称", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "purchaseTypeName", "title": "采购类型", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "amount", "title": "预算金额", "width": 190, "minWidth": 100, "align": "left", "params": { "displayDigits": 2 } },
    { "field": "billStateName", "title": "状态", "minWidth": 100, "align": "left", "slots": { "default": "billState" } },
    { "field": "createTime", "title": "创建时间", "minWidth": 190, "align": "left" },
    { "field": "bidOpeningTime", "title": "开标截止时间", "minWidth": 190, "align": "left" },
    { "title": "操作", "field": "action", "align": "center", "width": 150, "slots": { "default": "action" } }
]

[
    {"field":"rowNum","title":"序号","width":"60","minWidth":"60","align":"left","slots":{"default":"rowNum"}},
    {"field":"billNo","title":"招标编号","width":190,"minWidth":100,"align":"left"},
    {"field":"projectName","title":"项目名称","width":190,"minWidth":100,"align":"left"},
    {"field":"purchaseTypeName","title":"采购类型","width":190,"minWidth":100,"align":"left"},
    {"field":"amount","title":"预算金额","width":190,"minWidth":100,"align":"left","params":{"displayDigits":2}},
    {"field":"billStateName","title":"审核状态","minWidth":100,"align":"left","slots":{"default":"billState"}},
    {"field":"bizFlowStatusName","title":"项目状态","minWidth":100,"align":"left","slots":{"default":"bizFlowStatusList"}},
    {"field":"createTime","title":"创建时间","minWidth":190,"align":"left"},
    {"field":"bidOpeningTime","title":"开标截止时间","minWidth":190,"align":"left"},
    {"title":"操作","field":"action","align":"center","width":150,"slots":{"default":"action"}}
]



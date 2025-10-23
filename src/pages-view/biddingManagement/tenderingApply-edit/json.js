
//  基本信息
[
    { "label": "项目名称", "field": "projectName", "required": true, "type": "input", "width": "33%" },
    { "label": "采购员", "field": "purchaseUserName", "fieldName": "purchaseUser","required": true, "fieldUserId": "purchaseUserId", "fieldTel": "purchaseUserTel", "type": "selectinput", "width": "33%", "source": "inviteUserList" },
    { "label": "联系电话", "field": "purchaseUserTel", "type": "input","required": true, "width": "33%", "slot": "purchaseUserTel" },
    { "label": "采购类型", "field": "purchaseType", "fieldName": "purchaseTypeName","required": true, "type": "selectinput", "source": "purchaseTypeList", "width": "33%" },
    { "label": "采购方式", "field": "purchaseMethod", "fieldName": "purchaseMethodName", "type": "selectinput", "source": "purchaseMethodList", "width": "33%" },
    { "label": "招标范围", "field": "bidScope", "fieldName": "bidScopeName", "required": true, "type": "selectinput", "source": "bidScopeList", "width": "33%" },
    { "label": "预算金额", "field": "amount", "type": "input", "width": "33%" ,"slot":"amount"},
    { "label": "招标日期", "field": "bizTime", "width": "33%" },
    { "label": "委托方式", "field": "entrustType", "fieldName": "entrustTypeName", "type": "selectinput", "source": "entrustTypeList", "width": "33%" },
    { "label": "资质要求", "field": "qualifyRemark", "type": "textarea", "rows": 2, "width": "33%" },
    { "label": "采购说明", "field": "purchaseRemark", "type": "textarea", "rows": 2, "width": "33%" }
]


// { "label": "立项状态", "field": "projectStatus", "fieldName": "projectStatusName", "type": "selectinput", "source": "projectStatusList", "width": "33%" },
// { "label": "计价模式", "field": "pricingMethod", "fieldName": "pricingMethodName", "type": "selectinput", "source": "pricingMethodList", "width": "33%" },


// 采购明细
[
    { "title": "选择", "type": "checkbox", "width": "80", "align": "left", "minWidth": "80", "visible": "true"  },
    { "field": "rowNum", "title": "序号", "width": "80", "align": "left", "slots": { "default": "rowNum" }, "minWidth": "80", "visible": "true" },
    { "field": "materialCode", "title": "物料代码", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "materialTypeName", "title": "物料分类", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "model", "title": "型号", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "standard", "title": "规格", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "voltageLevel", "title": "电压", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "attribute", "title": "属性", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "unit", "title": "单位", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "source": "unitList" }, "slots": { "default": "slot_edit_select" } },
    { "field": "price", "title": "参考单价(含税)", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2 }, "slots": { "default": "slot_edit_number" } },
    { "field": "qty", "title": "申请数量", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2, "required": true }, "slots": { "default": "slot_edit_qty", "header": "slot_header" } },
    { "field": "purchaseDate", "title": "需求日期", "width": "150", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "required": true }, "slots": { "default": "slot_edit_date", "header": "slot_header" } },
    { "field": "remark", "title": "备注", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_textarea" } }
]

// 供应商
[
    { "field": "billNo", "title": "供应商编码", "minWidth": "100", "align": "left" },
    { "field": "supplierName", "title": "供应商名称", "minWidth": "100", "align": "left" },
    { "field": "linkerName", "title": "供应商联系人", "minWidth": "100", "align": "left" },
    { "field": "linkerTel", "title": "供应商手机", "minWidth": "100", "align": "left" },
    { "field": "linkerEmail", "title": "供应商邮箱", "minWidth": "100", "align": "left" },
    { "field": "remark", "title": "备注", "minWidth": "100", "align": "left" },
    { "field": "action", "title": "操作", "minWidth": "100", "align": "left", "slots": { "default": "action" } }
]
// { "field": "registrationStatusName", "title": "报名状态", "minWidth": "100", "align": "left", "slots": { "default": "registrationStatusName" } },


// 招标方案
[
    { "label": "评定标方法", "field": "tenderEvaluationMethod", "type": "radio", "width": "33%", "source": "tender_evaluation_method", "slot": "tender_radio" },
    { "label": "技术标权重%", "field": "technologyRatio", "type": "input", "width": "33%" },
    { "label": "商务标权重%", "field": "businessRatio", "type": "input", "width": "33%" },
    { "label": "开标方式", "field": "tenderOpeningType", "type": "radio", "width": "33%", "source": "tender_opening_type", "slot": "tender_radio" },
    { "label": "评标方式", "field": "tenderEvaluationType", "type": "radio", "width": "33%", "source": "tender_evaluation_type", "slot": "tender_radio" },
    { "label": "定标结果审批", "field": "bidResultAuditFlag", "type": "radio", "width": "33%", "source": "bidResultAuditFlag", "slot": "slot_switch" }
]

// 评标专家


// 招标计划时间表
[
    { "label": "报名截止时间", "field": "deadlineTime", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
    { "label": "入围截止时间", "field": "shortlistCompletionTime", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
    { "label": "发标时间", "field": "bidIssuanceDate", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
    { "label": "答疑完成时间", "field": "qaCompletionTime", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
    { "label": "开标时间", "field": "bidOpeningTime", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
    { "label": "评标时间", "field": "evaluationDate", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
    { "label": "谈判截止时间", "field": "businessNegotiationDate", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
    { "label": "定标时间", "field": "awardDate", "type": "date", "width": "25%" , "slot": "slot_edit_date" }
]
// { "label": "答疑截止时间", "field": "qaDeadlineTime", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
// { "label": "编标截止时间", "field": "businessBidCompletionTime", "type": "date", "width": "25%" , "slot": "slot_edit_date" },
 
// 专家组件配置

[
    { "field": "rowNum", "title": "序号", "width": 80, "type": "checkbox", "align": "center", "slots": { "default": "rowNum" } },
    { "field": "nickName", "fieldName": "userName", "title": "姓名", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "sex", "title": "性别", "width": 190, "minWidth": 100, "align": "left", "slots": { "default": "sex" } },
    { "field": "roleName", "title": "专家来源", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "rank", "title": "专业分类", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "phone", "title": "手机号码", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "expertTechnical", "title": "技术标", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "expertBusiness", "title": "商务标", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "remark", "title": "说明", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "action", "title": "操作", "minWidth": "100", "align": "left", "slots": { "default": "action" } }
]
[
    {"field":"nickName","fieldName":"userName","title":"专家姓名","width":190,"minWidth":100,"align":"left"},
    {"field":"sex","title":"性别","width":190,"minWidth":100,"align":"left","slots":{"default":"sex"}},
    {"field":"roleName","title":"专家来源","width":190,"minWidth":100,"align":"left"},
    {"field":"rank","title":"专业分类","width":190,"minWidth":100,"align":"left"},
    {"field":"phone","title":"手机号码","width":190,"minWidth":100,"align":"left"},
    {"field":"expertTechnical","title":"技术标","width":190,"minWidth":100,"align":"left"},
    {"field":"expertBusiness","title":"商务标","width":190,"minWidth":100,"align":"left"},
    {"field":"remark","title":"说明","width":190,"minWidth":100,"align":"left"},
    {"field":"action","title":"操作","minWidth":"100","align":"left","slots":{"default":"action"}}
]
























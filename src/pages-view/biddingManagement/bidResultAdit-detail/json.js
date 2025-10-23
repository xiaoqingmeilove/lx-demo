
//  基本信息
[
    { "label": "项目名称", "field": "projectName", "required": true, "type": "input", "width": "33%" },
    { "label": "采购类型", "field": "purchaseType", "fieldName": "purchaseTypeName", "type": "selectinput", "source": "purchaseTypeList", "width": "33%" },
    { "label": "采购方式", "field": "purchaseMethod", "fieldName": "purchaseMethodName", "type": "selectinput", "source": "purchaseMethodList", "width": "33%" },
    { "label": "招标范围", "field": "bidScope", "fieldName": "purchaseDeptName", "type": "selectinput", "source": "bidScopeList", "width": "33%" },
    { "label": "计价模式", "field": "pricingMethod", "fieldName": "pricingMethodName", "type": "selectinput", "source": "pricingMethodList", "width": "33%" },
    { "label": "立项状态", "field": "projectStatus", "fieldName": "purchaseDeptName", "type": "selectinput", "source": "projectStatusList", "width": "33%" },
    { "label": "预算金额", "field": "amount", "type": "input", "width": "33%" },
    { "label": "业务日期", "field": "bizTime", "width": "33%" },
    { "label": "委托方式", "field": "entrustType", "fieldName": "purchaseDeptName", "type": "selectinput", "source": "entrustTypeList", "width": "33%" },
    { "label": "资质要求", "field": "qualifyRemark", "type": "textarea", "rows": 4, "width": "33%" },
    { "label": "采购说明", "field": "purchaseRemark", "type": "textarea", "rows": 4, "width": "33%" }
]

// 采购明细
[
    { "field": "rowNum", "title": "序号", "width": "80", "align": "left", "minWidth": "80", "visible": "true", "slots": { "default": "rowNum" } },
    { "field": "materialCode", "title": "物料代码", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true },
    { "field": "materialTypeName", "title": "物料分类", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true },
    { "field": "model", "title": "型号", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true },
    { "field": "standard", "title": "规格", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true },
    { "field": "voltageLevel", "title": "电压", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true },
    { "field": "attribute", "title": "属性", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true },
    { "field": "unit", "title": "单位", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "source": "unitList" } },
    { "field": "price", "title": "参考单价(含税)", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2 } },
    { "field": "qty", "title": "申请数量", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2, "required": true } },
    { "field": "purchaseDate", "title": "需求日期", "width": "150", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "required": true } },
    { "field": "remark", "title": "备注", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true }
]

// 供应商
[
    { "field": "billNo", "title": "供应商编码", "minWidth": "100", "align": "left" },
    { "field": "supplierName", "title": "供应商名称", "minWidth": "100", "align": "left" },
    { "field": "linkerName", "title": "供应商联系人", "minWidth": "100", "align": "left" },
    { "field": "linkerTel", "title": "供应商手机", "minWidth": "100", "align": "left" },
    { "field": "linkerEmail", "title": "供应商邮箱", "minWidth": "100", "align": "left" },
    { "field": "registrationStatusName", "title": "报名状态", "minWidth": "100", "align": "left", "slots": { "default": "registrationStatusName" } },
    { "field": "remark", "title": "备注", "minWidth": "100", "align": "left" }
]

// 招标方案
[
    { "label": "开标方式", "field": "tenderOpeningType", "type": "radio", "width": "33%", "source": "tender_opening_type", "slot": "tender_radio" },
    { "label": "评标方式", "field": "tenderEvaluationType", "type": "radio", "width": "33%", "source": "tender_evaluation_type", "slot": "tender_radio" },
    { "label": "评定标方法", "field": "tenderEvaluationMethod", "type": "radio", "width": "33%", "source": "tender_evaluation_method", "slot": "tender_radio" },
    { "label": "技术标权重%", "field": "technologyRatio", "type": "input", "width": "33%" },
    { "label": "商务标权重%", "field": "businessRatio", "type": "input", "width": "33%" }
]

// 评标专家
[
    { "field": "expertName", "title": "专家姓名", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "expertSex", "title": "性别", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "expertSource", "title": "专家来源", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "expertCategory", "title": "专业分类", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "expertPhone", "title": "手机号码", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "expertTechnical", "title": "技术标", "minWidth": "100", "align": "left" },
    { "field": "expertBusiness", "title": "商务标", "minWidth": "100", "align": "left" },
    { "field": "expertRemark", "title": "说明", "minWidth": "100", "align": "left" },
    { "field": "action", "title": "操作", "width": "130", "minWidth": "100", "align": "left" }
]

// 招标计划时间表

[
    { "label": "确认截止时间", "field": "deadlineTime", "type": "datetime", "width": "25%" },
    { "label": "入围完成时间", "field": "shortlistCompletionTime", "type": "datetime", "width": "25%" },
    { "label": "商务标编制完成时间", "field": "businessBidCompletionTime", "type": "datetime", "width": "25%" },
    { "label": "技术标编制完成时间", "field": "technicalBidCompletionTime", "type": "datetime", "width": "25%" },
    { "label": "招标交底完成日期", "field": "biddingBriefingCompletionDate", "type": "datetime", "width": "25%" },
    { "label": "标底编制完成日期", "field": "basePriceCompletionDate", "type": "datetime", "width": "25%" },
    { "label": "发标日期", "field": "bidIssuanceDate", "type": "datetime", "width": "25%" },
    { "label": "答疑截止时间", "field": "qaDeadlineTime", "type": "datetime", "width": "25%" },
    { "label": "答疑完成日期", "field": "qaCompletionTime", "type": "datetime", "width": "25%" },
    { "label": "截标开标时间", "field": "bidOpeningTime", "type": "datetime", "width": "25%" },
    { "label": "评标日期", "field": "evaluationDate", "type": "datetime", "width": "25%" },
    { "label": "商务谈判日期", "field": "businessNegotiationDate", "type": "datetime", "width": "25%" },
    { "label": "定标日期", "field": "awardDate", "type": "datetime", "width": "25%" }
]

// 专家组件配置

[
    { "field": "nickName", "fieldName": "userName", "title": "专家姓名", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "sex", "title": "性别", "width": 190, "minWidth": 100, "align": "left", "slots": { "default": "sex" } },
    { "field": "roleName", "title": "专家来源", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "rank", "title": "专业分类", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "phone", "title": "手机号码", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "expertTechnical", "title": "技术标", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "expertBusiness", "title": "商务标", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "remark", "title": "说明", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "action", "title": "操作", "minWidth": "100", "align": "left", "slots": { "default": "action" } }
]























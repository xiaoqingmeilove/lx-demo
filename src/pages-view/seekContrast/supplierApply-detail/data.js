[
  { "label": "采购员", "field": "purchaseUserName", "width": "33%" },
  { "label": "联系电话", "field": "purchaseUserTel", "width": "33%" },
  { "label": "报价截止时间", "field": "endQuoteTime", "width": "33%" },
  { "label": "报价倒计时", "field": "quotationCountdown", "width": "33%", "slot": "quotationCountdown" }
]

[
  { "field": "rowNum", "title": "序号", "width": "80", "align": "left", "resizable": "true", "slots": { "default": "rowNum" }, "minWidth": "80", "visible": "true" },
  { "field": "materialCode", "title": "物料编码", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "materialName", "title": "物料名称", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "materialTypeName", "title": "物料分类", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "model", "title": "型号", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "standard", "title": "规格", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "voltageLevel", "title": "电压", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "attribute", "title": "属性", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "unit", "title": "单位", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "fromQty", "title": "询价数量", "width": "190", "minWidth": "70", "resizable": "false", "align": "right", "sortable": "true", "visible": "true" },
  { "field": "warrantyDuration", "title": "质保期(天)", "minWidth": "100", "align": "right" },
  { "field": "latestArrivalDate", "title": "最晚到货时间", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true" },
  { "field": "qty", "title": "可供货数量", "width": "190", "minWidth": "70", "resizable": "false", "align": "right", "sortable": "true", "visible": "true", "params": { "displayDigits": 2 }, "slots": { "default": "slot_edit_number", "header": "slot_header" } },
  { "field": "price", "title": "含税单价(元)", "width": "190", "minWidth": "70", "resizable": "false", "align": "right", "sortable": "true", "visible": "true", "params": { "displayDigits": 4 }, "slots": { "default": "slot_edit_number", "header": "slot_header" } },
  { "field": "taxRate", "title": "税率", "width": "190", "minWidth": "70", "resizable": "false", "align": "right", "sortable": "true", "visible": "true", "params": { "displayDigits": 2 }, "slots": { "default": "slot_edit_number", "header": "slot_header" } },
  { "field": "amount", "title": "金额小计", "width": "190", "minWidth": "70", "resizable": "false", "align": "right", "sortable": "true", "visible": "true" },
  { "field": "remark", "title": "备注", "width": "190", "minWidth": "70", "resizable": "false", "align": "left", "sortable": "true", "visible": "true", "slots": { "default": "slot_edit_textarea", "header": "slot_header" } }
]


[
  { "label": "报价说明", "field": "quoteDescription", "required": true, "type": "input", "width": "33%" },
  { "label": "含税总金额", "field": "amount", "type": "", "width": "33%", "digits": 2, "precision": 2, "formatterName": "toFixedNumber" },
  { "label": "金额大写", "field": "amountName", "required": true, "type": "", "width": "33%" },
  { "label": "不含税总价", "field": "untaxAmount", "type": "", "width": "33%", "digits": 2, "precision": 2, "formatterName": "toFixedNumber" },
  { "label": "税额", "field": "taxAmount", "type": "", "width": "33%", "digits": 2, "precision": 2, "formatterName": "toFixedNumber" }
]

// 询价信息-基本信息
[
  { "label": "询价标题", "field": "projectName", "width": "50%" },
  { "label": "项目类型", "field": "projectTypeName", "width": "50%" },
  { "label": "收货地址", "field": "areaCodeList", "width": "50%", "slot": "areaCodeList" },
  { "label": "采购类型", "field": "purchaseTypeName", "width": "50%" },
  { "label": "询价日期", "field": "enquiryDate", "width": "50%" },
  { "label": "报名截止时间", "field": "endInvolveTime", "width": "50%" },
  { "label": "报价截止时间", "field": "endQuoteTime", "width": "50%" },
  { "label": "邀请方式", "field": "enquiryTypeName", "width": "50%" },
  { "label": "采购员", "field": "purchaseUserName", "width": "50%" },
  { "label": "联系电话", "field": "purchaseUserTel", "width": "50%" },
  { "label": "关联单号", "field": "linkPreBillNo", "width": "50%" },
  { "label": "整单询价", "field": "singleFlag", "width": "50%", "slot": "slot_switch" },
  { "label": "提醒方式", "field": "remindMethodName", "width": "50%" },
  { "label": "备注", "field": "remark", "width": "50%" }
]

// 询价信息-物料详情
[
  { "field": "materialCode", "title": "物料代码", "minWidth": "100", "align": "left" },
  { "field": "materialName", "title": "物料名称", "minWidth": "100", "align": "left" },
  { "field": "materialTypeName", "title": "物料分类", "minWidth": "100", "align": "left" },
  { "field": "model", "title": "型号", "minWidth": "100", "align": "left" },
  { "field": "standard", "title": "规格", "minWidth": "100", "align": "left" },
  { "field": "voltageLevel", "title": "电压", "minWidth": "100", "align": "left" },
  { "field": "attribute", "title": "属性", "minWidth": "100", "align": "left" },
  { "field": "unit", "title": "单位", "minWidth": "100", "align": "left" },
  { "field": "qty", "title": "询价数量", "minWidth": "100", "align": "right", "params": { "required": true }, "slots": { "default": "slot_edit_integerNumber", "header": "slot_header" } },
  { "field": "warrantyDuration", "title": "质保期(天)", "minWidth": "100", "align": "right", "params": { "required": true }, "slots": { "default": "slot_edit_integerNumber", "header": "slot_header" } },
  { "field": "latestArrivalDate", "title": "最晚到货时间", "width": "180", "minWidth": "100", "align": "left", "params": { "required": true }, "slots": { "default": "slot_edit_date", "header": "slot_header" } }
]


// 供应商信息
[
  { "field": "billNo", "title": "供应商编码", "minWidth": "100", "align": "left" },
  { "field": "supplierName", "title": "供应商名称", "minWidth": "100", "align": "left" },
  { "field": "linkerName", "title": "供应商联系人", "minWidth": "100", "align": "left" },
  { "field": "linkerTel", "title": "供应商手机", "minWidth": "100", "align": "left" },
  { "field": "linkerEmail", "title": "供应商邮箱", "minWidth": "100", "align": "left" },
  { "field": "quoteStateName", "title": "报价状态", "minWidth": "100", "align": "left" },
  { "field": "action", "title": "操作", "minWidth": "100", "align": "left" }
]




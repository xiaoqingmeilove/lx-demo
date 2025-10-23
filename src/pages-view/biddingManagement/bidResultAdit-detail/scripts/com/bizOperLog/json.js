[
    { "label": "授标方式", "field": "awardMethodCode", "fieldName": "awardMethodName", "required": true, "type": "radio", "source": "awardMethodList", "slot": "tender_radio" , "width": "33%" }
]

[
    { "field": "rowNum", "title": "序号", "width": 80, "type": "checkbox", "align": "center", "slots": { "default": "rowNum" } },
    { "field": "supplierName", "title": "供应商名称", "minWidth": "100", "align": "left" },
    { "field": "registrationStatusName", "title": "中标状态", "minWidth": "100", "align": "left", "slots": { "default": "registrationStatus" } },
    { "field": "bidAmount", "title": "中标金额(元)", "minWidth": "100", "align": "left" },
    { "field": "score", "title": "评分", "minWidth": "100", "align": "left" },
    { "field": "scoreRank", "title": "排名", "minWidth": "100", "align": "left" },
    { "field": "action", "title": "操作", "align": "center", "width": "150", "slots": { "default": "action" } }
]

// 供应商报价信息
[
    { "field": "materialName", "title": "采购商品", "width": 150, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "materialTypeName", "title": "物料类型", "width": 150, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "materialCode", "title": "物料编码", "width": 150, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "model", "title": "型号", "width": 150, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "standard", "title": "规格", "width": 130, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "voltageLevel", "title": "电压", "width": 130, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "attribute", "title": "属性", "width": 130, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "unit", "title": "单位", "width": 130, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "fromQty", "title": "申请数量", "width": 150, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "supplierName", "title": "供应商名称", "width": 150, "minWidth": 70, "align": "left", "sortable": "true", "visible": "true", "params": { "merges": "true" } },
    { "field": "quoteQty", "title": "可供货数量", "width": 150, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true" },
    { "field": "quotePrice", "title": "报价含税单价", "width": 170, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true" },
    { "field": "priceRank", "title": "价格排名", "width": 150, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true" },
    { "field": "price", "title": "中标含税单价", "width": 150, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true", "params": { "displayDigits": 2 }, "slots": { "default": "slot_edit_number" } },
    { "field": "bidResult", "fieldName": "bidResultName", "title": "中标结果", "width": 150, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true", "slots": { "default": "slot_edit_bidResult" } },
    { "field": "qty", "title": "中标数量", "width": 150, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true", "slots": { "default": "slot_edit_integerNumber" } },
    { "field": "amount", "title": "中标金额(含税)", "width": 150, "minWidth": 70, "align": "right", "sortable": "true", "visible": "true" }
]

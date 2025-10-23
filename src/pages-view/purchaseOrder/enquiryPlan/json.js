[
    { "label": "订单编号", "field": "orderBillNo", "type": "input", "isDefault": true },
    { "label": "订单发布时间", "fields": ["beginReleaseTime,endReleaseTime"], "type": "datePicker", "isDefault": true },
    { "label": "业务状态", "field": "bizFlowStatus", "type": "selectmulti", "output": "string", "source": "orderBizFlowStatus" },
    { "label": "计划交货日期", "fields": ["beginConfirmDealDate,endConfirmDealDate"], "type": "datePicker", "isDefault": true },
    { "label": "物料名称", "field": "materialName", "type": "input" },
    { "label": "物料代码", "field": "materialCode", "type": "input" },
    { "label": "供应商", "field": "supplierName", "type": "input" }
]


[
    { "field": "rowNum", "title": "序号", "width": 80, "type": "checkbox", "align": "center", "slots": { "default": "rowNum" } },
    { "field": "orderBillNo", "title": "订单编号", "width": 190, "minWidth": 100, "align": "left", "slots": { "default": "orderBillNo" } },
    { "field": "supplierName", "title": "供应商", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "releaseTime", "title": "订单发布时间", "width": 100, "minWidth": 100, "align": "left" },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
    { "field": "planTypeName", "title": "要货批次类型", "width": 120, "minWidth": 100, "align": "left" },
    { "field": "batchNo", "title": "采购批次", "minWidth": 160, "align": "left" },
    { "field": "materialName", "title": "物料名称", "minWidth": 100, "align": "left" },
    { "field": "materialCode", "title": "物料编码", "minWidth": 100, "align": "left" },
    { "field": "materialTypeName", "title": "物料分类", "minWidth": 100, "align": "left" },
    { "field": "model", "title": "型号", "minWidth": 100, "align": "left" },
    { "field": "standard", "title": "规格", "minWidth": 100, "align": "left" },
    { "field": "voltageLevel", "title": "电压", "minWidth": 100, "align": "left" },
    { "field": "attribute", "title": "属性", "minWidth": 100, "align": "left" },
    { "field": "unit", "title": "单位", "minWidth": 100, "align": "left" },
    { "field": "confirmPrice", "title": "单价(元)", "minWidth": 60, "align": "left" },
    { "field": "confirmQty", "title": "计划数量", "minWidth": 100, "align": "left" },
    { "field": "confirmDealDate", "title": "计划交货日期", "minWidth": 100, "align": "left" },
    { "field": "confirmDealDate", "title": "剩余天数", "minWidth": 60, "align": "left", "slots": { "default": "confirmDealDate" } },
    { "field": "confirmAmount", "title": "订单金额", "minWidth": 100, "align": "right", "params": { "displayDigits": 2 } }
]
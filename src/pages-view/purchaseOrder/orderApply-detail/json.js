[
    { "label": "供应商名称", "field": "supplierId", "fieldName": "businessLicense", "type": "select", "source": "supplierList", "width": "33%" },
    { "label": "合同号", "field": "contractBillNo", "type": "", "width": "33%" },
    { "label": "订单金额", "field": "amount", "type": "number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber", "width": "33%" },
    { "label": "付款方式", "field": "paymentModeName", "type": "input", "width": "33%" },
    { "label": "备注信息", "field": "remark", "type": "textarea", "width": "33%" },
    { "label": "送货地址", "field": "deliveryAddress", "type": "input", "width": "33%" },
    { "label": "收货联系人", "field": "receiveLink", "type": "input", "width": "33%" },
    { "label": "联系电话", "field": "receiveContact", "type": "input", "width": "33%" },
    { "label": "预计到货日期", "field": "arrivalTime", "type": "date", "width": "33%" }
]

[
    { "label": "要货计划类型", "field": "planType", "fieldName": "planTypeName", "type": "radio", "source": "planTypeList", "width": "99%" }
]


[
    { "title": "需求池流水号", "field": "requirementsBillNo", "align": "left", "width": 170 },
    { "title": "采购商品", "field": "materialName", "align": "left", "width": 150 },
    { "title": "物料类型", "field": "materialTypeName", "align": "left", "width": 120 },
    { "title": "物料编码", "field": "materialCode", "align": "left", "width": 150 },
    { "title": "型号", "field": "model", "align": "left", "width": 150 },
    { "title": "规格", "field": "standard", "align": "left", "width": 120 },
    { "title": "电压", "field": "voltageLevel", "align": "left", "width": 150 },
    { "title": "属性", "field": "attribute", "align": "left", "width": 150 },
    { "title": "单位", "field": "unit", "align": "left", "width": 150 },
    { "title": "寻源方式", "field": "sourcingMethodName", "align": "right", "width": 120 },
    { "title": "订单数量", "field": "qty", "align": "right", "width": 120, "slots": { "default": "slot_edit_integerNumber" } },
    { "title": "订单金额", "field": "amount", "align": "right", "width": 120, "params": { "displayDigits": 2, "addFooter": true } },
    { "title": "供应商名称", "field": "supplierName", "align": "right", "width": 120 },
    { "title": "中标/合同数量", "field": "bidQty", "align": "right", "width": 120, "params": { "displayDigits": 2 } },
    { "title": "中标/合同金额(含税)", "field": "bidAmount", "align": "right", "width": 150, "params": { "displayDigits": 2, "addFooter": true } },
    { "title": "中标/合同单价(含税)", "field": "bidPrice", "align": "right", "width": 150, "params": { "displayDigits": 2 } }
]

[
    { "title": "需求池流水号", "field": "requirementsBillNo", "align": "left", "width": 170 },
    { "title": "采购商品", "field": "materialName", "align": "left", "width": 150 },
    { "title": "物料类型", "field": "materialTypeName", "align": "left", "width": 120 },
    { "title": "物料编码", "field": "materialCode", "align": "left", "width": 150 },
    { "title": "型号", "field": "model", "align": "left", "width": 150 },
    { "title": "规格", "field": "standard", "align": "left", "width": 120 },
    { "title": "电压", "field": "voltageLevel", "align": "left", "width": 150 },
    { "title": "属性", "field": "attribute", "align": "left", "width": 150 },
    { "title": "单位", "field": "unit", "align": "left", "width": 150 },
    { "title": "寻源方式", "field": "sourcingMethodName", "align": "right", "width": 120 },
    { "title": "本批订单数量", "field": "orderQty", "align": "right", "width": 120, "params": { "displayDigits": 2 }, "slots": { "default": "slot_edit_number" } },
    { "title": "本批订单金额", "field": "orderAmount", "align": "right", "width": 120, "params": { "displayDigits": 2, "addFooter": true } },
    { "title": "供应商名称", "field": "supplierName", "align": "right", "width": 120 },
    { "title": "中标/合同数量", "field": "bidQty", "align": "right", "width": 120, "params": { "displayDigits": 2 } },
    { "title": "中标/合同金额(含税)", "field": "bidAmount", "align": "right", "width": 150, "params": { "displayDigits": 2, "addFooter": true } },
    { "title": "中标/合同单价(含税)", "field": "bidPrice", "align": "right", "width": 150, "params": { "displayDigits": 2 } }
]

[
    { "title": "批次号", "field": "batchNo", "align": "left", "width": 250, "minWidth": 120 },
    { "title": "采购批次", "field": "batch", "align": "left", "width": 250, "minWidth": 120, "slots": { "default": "slot_edit_input" } },
    { "title": "要求交货日期", "field": "arrivalTime", "align": "left", "width": 250, "minWidth": 120, "slots": { "default": "slot_edit_date" } },
    { "title": "备注", "field": "remark", "align": "left", "minWidth": 150, "slots": { "default": "slot_edit_textarea" } },
    { "title": "操作", "field": "action", "align": "center", "width": 150, "slots": { "default": "action" } }
]








//  基本信息
[
    { "label": "供应商", "field": "supplierId", "fieldName": "supplierName", "slot": "supplierName", "width": "33%" },
    { "label": "确认收货地址", "field": "confirmAddress", "slot": "confirmAddress", "width": "80%" },
    { "label": "申请部门", "field": "purchaseDeptId", "fieldName": "purchaseDeptName", "required": true, "type": "selectinput", "source": "adepartmentList", "width": "33%" },
    { "label": "使用部门", "field": "employDeptId", "fieldName": "employDeptName", "required": true, "type": "selectinput", "source": "adepartmentList", "width": "33%" },
    { "label": "采购类型", "field": "purchaseType", "fieldName": "purchaseTypeName", "required": "true", "source": "contractPurchaseTypeList", "type": "radio", "width": "99%" },
    { "label": "结算方式", "field": "paymentMethod", "fieldName": "paymentMethodName", "required": true, "type": "selectinput", "source": "payment_method", "width": "33%" },
    { "label": "描述", "field": "remark", "type": "textarea", "rows": 4, "width": "99%" },
    { "label": "附件", "field": "fileList", "type": "", "width": "99%", "itemClass": "file-item", "slot": "fileList" }
]

// 产品明细
[
    { "title": "选择", "type": "checkbox", "width": "80", "align": "left", "minWidth": "80", "visible": "true" },
    { "field": "rowNum", "title": "序号", "width": "80", "align": "left", "slots": { "default": "rowNum" }, "minWidth": "80", "visible": "true" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "materialCode", "title": "物料编码", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "model", "title": "型号", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "standard", "title": "规格", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "voltageLevel", "title": "电压", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "attribute", "title": "属性", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "materialTypeName", "title": "物料分类", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "unit", "title": "单位", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "source": "unitList" }, "slots": { "default": "slot_edit_select" } },
    { "field": "untaxPrice", "title": "不含税单价", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2 } },
    { "field": "taxRate", "title": "税率", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true },
    { "field": "price", "title": "含税单价", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2, "required": true }, "slots": { "default": "slot_edit_number", "header": "slot_header" } },
    { "field": "qty", "title": "下单数量", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "required": true }, "slots": { "default": "slot_edit_integerNumber", "header": "slot_header" } },
    { "field": "dealDate", "title": "交货日期", "width": "150", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "required": true }, "slots": { "default": "slot_edit_date", "header": "slot_header" } },
    { "field": "amount", "title": "金额小计", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2, "addFooter": true } },
    { "field": "remark", "title": "备注", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_textarea", "header": "slot_header" } },
    { "field": "action", "title": "操作", "width": "130", "align": "left", "fixed": "right", "slots": { "default": "action" } }
]

// 批次产品清单
[
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "materialCode", "title": "物料编码", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "model", "title": "型号", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "standard", "title": "规格", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "voltageLevel", "title": "电压", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "attribute", "title": "属性", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "materialTypeName", "title": "物料分类", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "unit", "title": "单位", "width": "130", "minWidth": "100", "align": "left", "params": { "source": "unitList" } },
    { "field": "untaxPrice", "title": "不含税单价", "width": "150", "minWidth": "100", "align": "right", "params": { "displayDigits": 2 } },
    { "field": "taxRate", "title": "税率", "width": "150", "minWidth": "100", "align": "right" },
    { "field": "price", "title": "含税单价", "width": "150", "minWidth": "100", "align": "right" },
    { "field": "qty", "title": "下单数量", "width": "150", "minWidth": "100", "align": "right" },
    { "field": "dealDate", "title": "下单日期", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "planQty", "title": "计划数量", "width": "150", "minWidth": "100", "align": "right", "params": { "required": true }, "slots": { "default": "slot_edit_integerNumber", "header": "slot_header" } },
    { "field": "planDealDate", "title": "计划日期", "width": "150", "minWidth": "100", "align": "left", "params": { "required": true }, "slots": { "default": "slot_edit_date", "header": "slot_header" } },
    { "field": "amount", "title": "金额小计", "width": "150", "minWidth": "100", "align": "right", "params": { "displayDigits": 2 } }
]


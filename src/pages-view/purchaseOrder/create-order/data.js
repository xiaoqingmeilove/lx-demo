[
    { "label": "供应商", "field": "supplierName", "slot": "supplierName", "width": "33%" },
    { "label": "确认收货地址", "field": "confirmAddress", "slot": "confirmAddress", "width": "80%" },
    { "label": "申请部门", "field": "purchaseDeptId", "fieldName": "purchaseDeptName", "required": true, "type": "selectinput", "source": "adepartmentList", "width": "33%" },
    { "label": "使用部门", "field": "employDeptId", "fieldName": "employDeptName", "required": true, "type": "selectinput", "source": "adepartmentList", "width": "33%" },
    { "label": "采购类型", "field": "purchaseType", "fieldName": "purchaseTypeName", "required": "true", "source": "purchaseTypeList", "type": "radio", "width": "99%" },
    { "label": "结算方式", "field": "settlementType", "fieldName": "settlementTypeName", "required": true, "type": "selectinput", "source": "payment_method", "width": "33%" },
    { "label": "描述", "field": "remark", "type": "textarea", "rows": 4, "width": "99%" },
    { "label": "附件", "field": "fileList", "type": "", "width": "99%", "itemClass": "file-item", "slot": "fileList" }
]




[
    { "title": "单据号", "field": "billNo", "align": "left", "minWidth": 100 },
    { "title": "申请时间", "field": "applyTime", "align": "left", "minWidth": 100 },
    { "title": "审核时间", "field": "materialTypeName", "align": "left", "minWidth": 100 },
    { "title": "内部审核状态", "field": "model", "align": "left", "minWidth": 100 },
    { "title": "订单来源", "field": "standard", "align": "left", "minWidth": 100 },
    { "title": "业务状态", "field": "voltageLevel", "align": "left", "minWidth": 100 },
    { "title": "供应商", "field": "supplierName", "align": "left", "width": 100 },
    { "title": "申请部门", "field": "purchaseDeptName", "align": "left", "width": 100 },
    { "title": "使用部门", "field": "employDeptName", "align": "left", "width": 100 },
    { "title": "采购类型", "field": "purchaseTypeName", "align": "left", "width": 100 },
    { "title": "结算方式", "field": "settlementTypeName", "align": "left", "width": 100 }
]
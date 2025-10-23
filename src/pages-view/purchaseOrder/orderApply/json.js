

[
    { "label": "单据号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "申请时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker", "isDefault": true },
    { "label": "审核时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker", "isDefault": true },
    { "label": "内部审核状态", "field": "billStateList", "type": "selectmulti", "output": "string", "source": "billStateList", "isDefault": true },
    { "label": "订单来源", "field": "orderSource", "type": "selectmulti", "output": "string", "source": "orderSource" },
    { "label": "业务状态", "field": "bizFlowStatus", "type": "selectmulti", "output": "string", "source": "orderBizFlowStatus" },
    { "label": "供应商", "field": "supplierName", "type": "input" },
    { "label": "区域", "field": "areaCodeListName", "type": "input" },
    { "label": "申请部门", "field": "purchaseDeptId", "type": "selectmulti", "output": "string", "source": "adepartmentList" },
    { "label": "使用部门", "field": "employDeptId", "type": "selectmulti", "output": "string", "source": "adepartmentList" },
    { "label": "采购类型", "field": "purchaseType", "type": "selectmulti", "output": "string", "source": "contractPurchaseTypeList" },
    { "label": "结算方式", "field": "paymentMethod", "type": "selectmulti", "output": "string", "source": "paymentMethod" }
]


[
    { "field": "rowNum", "width": 60, "minWidth": 60, "title": "序号", "align": "center", "slots": { "default": "rowNum" } },
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "createTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "auditDate", "title": "审核时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "orderSource", "title": "订单来源", "minWidth": 100, "align": "left", "slots": { "default": "businessSource" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
    { "field": "supplierName", "title": "供应商", "minWidth": 100, "align": "left" },
    { "field": "confirmAddress", "title": "确认收货地址", "minWidth": 250, "align": "left", "slots": { "default": "confirmAddress" } },
    { "field": "purchaseDeptName", "title": "申请部门", "minWidth": 100, "align": "left" },
    { "field": "employDeptName", "title": "使用部门", "minWidth": 100, "align": "left" },
    { "field": "purchaseTypeName", "title": "采购类型", "minWidth": 100, "align": "left" },
    { "field": "paymentMethod", "title": "结算方式", "minWidth": 100, "align": "left" },
    { "field": "syncApsName", "title": "是否同步", "minWidth": 100, "align": "left", "slots": { "default": "syncAps" } }
]

[
    { "label": "供应商名称", "field": "supplierName", "isDefault": true, "slot": "slot_input" },
    { "label": "物料名称", "field": "materialName", "type": "input", "isDefault": true },
    { "label": "物料代码", "field": "materialCode", "type": "input", "isDefault": true },
    { "label": "单据状态", "field": "billStateList", "type": "selectmulti", "output": "string", "source": "statelist" },
    { "label": "价格来源", "field": "purchaseTypeList", "type": "selectmulti", "output": "string", "source": "purchaseTypeList" },
    { "label": "价格失效日期", "fields": ["validityStartDate", "validityEndDate"], "type": "datePicker" },
    { "label": "单据时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker" },
    { "label": "申请时间", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker" },
    { "label": "审核时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker" }
]


[
    { "field": "rowNum", "title": "序号", "width": 80, "type": "checkbox", "align": "center", "slots": { "default": "rowNum" } },
    { "field": "billNo", "title": "价目表编号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "purchaseTypeName", "title": "价格来源", "minWidth": 100, "align": "left" },
    { "field": "clientName", "title": "采购组织", "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "单据状态", "minWidth": 100, "align": "left", "slots": { "default": "billState" } },
    { "field": "supplierBillNo", "title": "供应商编码", "minWidth": 100, "align": "left" },
    { "field": "supplierName", "title": "供应商名称", "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "minWidth": 100, "align": "left" },
    { "field": "materialCode", "title": "物料代码", "minWidth": 100, "align": "left" },
    { "field": "materialTypeName", "title": "物料分类", "minWidth": 100, "align": "left" },
    { "field": "model", "title": "型号", "minWidth": 100, "align": "left" },
    { "field": "standard", "title": "规格", "minWidth": 100, "align": "left" },
    { "field": "voltageLevel", "title": "电压", "minWidth": 100, "align": "left" },
    { "field": "attribute", "title": "属性", "width": 80, "minWidth": 80, "align": "left" },
    { "field": "unit", "title": "单位", "width": 100, "minWidth": 100, "align": "left" },
    { "field": "validityStartDate", "title": "价格生效日期", "width": 190, "minWidth": 100, "align": "left", "slots": { "default": "slot_date" } },
    { "field": "validityEndDate", "title": "价格失效日期", "width": 190, "minWidth": 100, "align": "left", "slots": { "default": "slot_date" } },
    { "field": "price", "title": "含税单价", "minWidth": 100, "align": "right", "params": { "displayDigits": 2 } },
    { "field": "taxRate", "title": "税率(%)", "width": 100, "align": "right", "params": { "displayDigits": 2 } },
    { "field": "remainDays", "title": "剩余天数", "minWidth": 100, "align": "left", "slots": { "default": "remainDays" } },
    { "field": "createUserName", "title": "创建人", "minWidth": 100, "align": "left" },
    { "field": "createTime", "title": "创建时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "updateTime", "title": "更新时间", "width": 190, "minWidth": 100, "align": "left" }
]

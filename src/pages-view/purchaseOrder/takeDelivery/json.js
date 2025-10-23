[
    { "label": "订单号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "收货单号", "field": "supplierName", "type": "input", "isDefault": true },
    { "label": "收货人", "field": "supplierName", "type": "input", "isDefault": true },
    { "label": "收货时间", "fields": ["beginAmount", "endAmount"], "type": "numberRange", "isDefault": true },
    { "label": "收货区域", "field": "createUserName", "type": "input" },
    { "label": "单据状态", "field": "billStateList", "type": "selectmulti", "output": "string", "source": "billStateList" }
]


[
    { "field": "billNo", "title": "订单号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billNo", "title": "收货单号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "supplierName", "title": "收货人", "minWidth": 100, "align": "left" },
    { "field": "createTime", "title": "收货时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "createUserName", "title": "收货区域", "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "单据状态", "width": 130, "minWidth": 100, "align": "left", "slots": { "default": "billState" } }
]


// 新的
// search
[
    { "label": "订单号", "field": "orderBillNo", "type": "input", "isDefault": true },
    { "label": "收货单号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "发货时间", "fields": ["beginShipDate", "endShipDate"], "type": "datePicker", "isDefault": true },
    { "label": "供应商", "field": "supplierName", "type": "input", "isDefault": true },
    { "label": "业务状态", "field": "bizFlowStatus", "type": "selectmulti", "output": "string", "source": "orderBizFlowStatus" }
]
// table
[
    { "field": "orderBillNo", "title": "订单号", "width": 190, "minWidth": 100, "align": "left", "slots": { "default": "orderBillNo" } },
    { "field": "billNo", "title": "收货单号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "shipDate", "title": "发货时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "receiveDate", "title": "收货时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "supplierName", "title": "供应商", "minWidth": 100, "align": "left" },
    { "field": "auditorName", "title": "收货人", "minWidth": 100, "align": "left" },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
    { "field": "syncApsName", "title": "是否同步", "width": "150", "minWidth": "100", "align": "left", "slots": { "default": "syncAps" } }
]



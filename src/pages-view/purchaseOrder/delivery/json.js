// search
[
    { "label": "订单号", "field": "orderBillNo", "type": "input", "isDefault": true },
    { "label": "发货单号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "发货时间", "fields": ["beginShipDate", "endShipDate"], "type": "datePicker", "isDefault": true },
    { "label": "供应商", "field": "supplierName", "type": "input", "isDefault": true },
    { "label": "业务状态", "field": "bizFlowStatus", "type": "selectmulti", "output": "string", "source": "orderBizFlowStatus" }
]
// table
[
    { "field": "orderBillNo", "title": "订单号", "width": 190, "minWidth": 100, "align": "left", "slots": { "default": "orderBillNo" } },
    { "field": "billNo", "title": "发货单号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "shipDate", "title": "发货时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "supplierName", "title": "供应商", "minWidth": 100, "align": "left" },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } }
]
// { "field": "billStateName", "title": "单据状态", "width": 130, "minWidth": 100, "align": "left" }

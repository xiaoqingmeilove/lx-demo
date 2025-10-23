// 基本信息
[
    { "label": "订单编号", "field": "orderBillNo", "type": "", "width": "33%" },
    { "label": "发货单号", "field": "billNo", "type": "", "width": "33%" },
    { "label": "订单金额", "field": "amount", "type": "", "digits": 2, "precision": 2, "formatterName": "toFixedNumber", "width": "33%" },
    { "label": "结算方式", "field": "paymentMethod", "type": "", "width": "33%" },
    { "label": "备注信息", "field": "remark", "type": "", "width": "33%" },
    { "label": "送货地址", "field": "deliveryAddress", "type": "", "width": "33%" },
    { "label": "收货联系人", "field": "receiveLinkName", "type": "", "width": "33%" },
    { "label": "联系电话", "field": "receiveLinkTel", "type": "", "width": "33%" }
]

// 发货信息 transport
[
    { "label": "运输方式", "field": "shippingMethod", "fieldName": "shippingMethodName", "type": "select", "source": "shippingMethodList", "width": "33%" },
    { "label": "快递公司", "field": "logisticsCompany", "type": "input", "width": "33%" },
    { "label": "快递单号", "field": "trackingNumber", "type": "input", "width": "33%" },
    { "label": "司机姓名", "field": "driverName", "type": "input", "width": "33%" },
    { "label": "司机联系方式", "field": "driverPhone", "type": "input", "width": "33%" },
    { "label": "车牌号", "field": "vehiclePlate", "type": "input", "width": "33%" },
    { "label": "预计送货时间", "field": "expectedArrivalDate", "type": "date", "width": "33%" },
    { "label": "附件", "field": "fileList", "type": "", "width": "99%", "itemClass": "file-item", "slot": "fileList" }
]


// [
//     { "title": "需求池流水号", "field": "requirementsBillNo", "align": "left", "width": 170 },
//     { "title": "采购商品", "field": "materialName", "align": "left", "width": 150 },
//     { "title": "物料类型", "field": "materialTypeName", "align": "left", "width": 120 },
//     { "title": "物料编码", "field": "materialCode", "align": "left", "width": 150 },
//     { "title": "型号", "field": "model", "align": "left", "width": 150 },
//     { "title": "规格", "field": "standard", "align": "left", "width": 120 },
//     { "title": "电压", "field": "voltageLevel", "align": "left", "width": 150 },
//     { "title": "属性", "field": "attribute", "align": "left", "width": 150 },
//     { "title": "单位", "field": "unit", "align": "left", "width": 150 },
//     { "title": "寻源方式", "field": "sourcingMethodName", "align": "right", "width": 120 },
//     { "title": "订单数量", "field": "qty", "align": "right", "width": 120, "params": { "displayDigits": 2 } },
//     { "title": "订单金额", "field": "amount", "align": "right", "width": 120, "params": { "displayDigits": 2, "addFooter": true } },
//     { "title": "本批次数量", "field": "supplierName", "align": "right", "width": 120, "params": { "displayDigits": 2 } },
//     { "title": "已发货数量", "field": "bidQty", "align": "right", "width": 120, "params": { "displayDigits": 2 } },
//     { "title": "已收货数量", "field": "bidAmount", "align": "right", "width": 150, "params": { "displayDigits": 2 } },
//     { "title": "未发货数量", "field": "bidPrice", "align": "right", "width": 150, "params": { "displayDigits": 2 } }
// ]

[
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "materialCode", "title": "物料编码", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "model", "title": "型号", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "standard", "title": "规格", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "voltageLevel", "title": "电压", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "attribute", "title": "属性", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "materialTypeName", "title": "物料分类", "width": "130", "minWidth": "100", "align": "left" },
    { "field": "unit", "title": "单位", "width": "130", "minWidth": "100", "align": "left", "params": { "source": "unitList" } },
    { "field": "untaxPrice", "title": "不含税单价", "width": "150", "minWidth": "100", "align": "left", "params": { "displayDigits": 2 } },
    { "field": "taxRate", "title": "税率", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "price", "title": "含税单价", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "planQty", "title": "计划数量", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "confirmQty", "title": "发货数量", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "amount", "title": "金额小计", "width": "150", "minWidth": "100", "align": "left", "params": { "displayDigits": 2 } }
]
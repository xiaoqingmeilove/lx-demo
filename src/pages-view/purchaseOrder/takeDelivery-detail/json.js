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

// 产品明细 detailList
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
    { "field": "confirmQty", "title": "发货数量", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "confirmQty", "title": "收货数量", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "amount", "title": "金额小计", "width": "150", "minWidth": "100", "align": "left", "params": { "displayDigits": 2 } }
]


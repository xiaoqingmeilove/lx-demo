
// 采购需求数据
export const PROCUREMENT_REQUIREMENT = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
    { "field": "qty", "title": "下单数量", "width": "150", "minWidth": "100", "align": "left" },
    { "field": "confirmQty", "title": "确认数量", "width": "150", "minWidth": "100", "align": "left" }
]

// 采购计划
export const PROCUREMENT_PLAN = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]

// 招投标
export const BIDDING_PROCESS = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]


// 询比价
export const QUOTE_COMPARISON = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]

// 电子竞价
export const ELECTRONIC_BIDDING = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]

// 合同
export const PURCHASE_CONTRACT = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]
//订单
export const PURCHASE_ORDER = [
    { "field": "billNo", "title": "订单编号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "purchaseTypeName", "title": "订单类型", "minWidth": 100, "align": "center" },
    { "field": "submissionTime", "title": "订单时间", "minWidth": 100, "align": "center" },
    { "field": "supplierName", "title": "供应商", "minWidth": 150, "align": "center" },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "center", "slots": { "default": "orderBizFlowStatus" } },
    { "field": "amount", "title": "订单金额", "minWidth": 100, "align": "center" },
    { "field": "productNumber", "title": "订单数量", "minWidth": 100, "align": "center" },
    { "field": "productNumber", "title": "已完成数量", "minWidth": 100, "align": "center" },
]

// 退货单
export const RETURN_ORDER = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]

// 发货单
export const SHIPPING_ORDER = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "shipDate", "title": "发货时间", "minWidth": 100, "align": "center" },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "center", "slots": { "default": "orderBizFlowStatus" } },
    { "field": "productNumber", "title": "订单数量", "minWidth": 100, "align": "center" },
    { "field": "productNumber", "title": "发货数量", "minWidth": 100, "align": "center" },
]

//收货单
export const RECEIVING_DOCUMENT = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "receiveDate", "title": "收货时间", "minWidth": 100, "align": "center" },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "center", "slots": { "default": "orderBizFlowStatus" } },
    { "field": "productNumber", "title": "订单数量", "minWidth": 100, "align": "center" },
    { "field": "productNumber", "title": "收货数量", "minWidth": 100, "align": "center" },
]

// 对账单
export const RECONCILIATION_STATEMENT = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]


// 发票
export const INVOICE = [
    { "field": "billNo", "title": "单据号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", },
    { "field": "submissionTime", "title": "申请时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "内部审核状态", "minWidth": 120, "align": "left", "slots": { "default": "billState" } },
    { "field": "bizFlowStatus", "title": "业务状态", "minWidth": 100, "align": "left", "slots": { "default": "orderBizFlowStatus" } },
]





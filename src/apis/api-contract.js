import request from "@/utils/request";
import { resolveUrl } from "@/utils/resolve-url";
import { findMenuByTitle, findMenuByCode } from "@/utils/menu";

const URLs = {
    // 合同模板
    getContractTemplateListUrl: resolveUrl("contract/contract-template/pageList"),
    getContractTemplateDetailUrl: resolveUrl("contract/contract-template/queryById"),
    postContractTemplateAddUrl: resolveUrl("contract/contract-template/add"),
    putContractTemplateEditUrl: resolveUrl("contract/contract-template/edit"),
    putContractTemplateStatusUrl: resolveUrl("contract/contract-template/enableBatch"),
    // 合同管理
    getContractBillListUrl: resolveUrl("contract/contract-bill/pageList"),
    getContractBillDetailUrl: resolveUrl('contract/contract-bill/queryById'),
    postContractBillAddUrl: resolveUrl('contract/contract-bill/add'),
    putContractBillEditUrl: resolveUrl('contract/contract-bill/edit'),
    getTemplateListUrl: resolveUrl('contract/contract-bill/templateList'),
    getBasicProductListUrl: resolveUrl('contract/contract-bill/basicProductList'),

    // 采购订单
    getRequirementsListUrl: resolveUrl('contract/order-bill/add/requirements'),
    getContractListUrl: resolveUrl('contract/order-bill/add/contract'),
    postRequirementsAddUrl: resolveUrl('contract/order-bill/add/requirements'),
    postContractAddUrl: resolveUrl('contract/order-bill/add/contract'),
    getPurchaseOrderListUrl: resolveUrl("contract/order-bill/pageList"),
    getPurchaseOrderDetailUrl: resolveUrl('contract/order-bill/queryById'),
    putPurchaseOrderEditUrl: resolveUrl('contract/order-bill/edit'),
    putOrderReleaseUrl: resolveUrl('contract/order-bill/release'),

    // 采购订单确认
    getPurchaseOrderConfirmListUrl: resolveUrl("contract/order-confirm/pageList"),
    getPurchaseOrderConfirmDetailUrl: resolveUrl('contract/order-confirm/queryById'),
    putPurchaseOrderConfirmEditUrl: resolveUrl('contract/order-confirm/edit'),
    putPurchaseOrderConfirmAgreeUrl: resolveUrl('contract/order-confirm/agree'),
    putPurchaseOrderConfirmRejectUrl: resolveUrl('contract/order-confirm/reject'),


    // 要货计划
    getDetailPageListUrl: resolveUrl("contract/order-purch-plan/detailPageList"),
    getPageExportUrl: resolveUrl("contract/order-purch-plan/export"),


    // 创建订单
    postAddOrderUrl: resolveUrl('contract/order-bill/add/save'),
    getOrderDetailUrl: resolveUrl('contract/order-bill/queryById'),
    putOrderEditUrl: resolveUrl('contract/order-bill/edit'),

    // 发货单
    createDeliveryUrl: resolveUrl('contract/ship-notices/add/purchPlan'),
    getDeliveryListUrl: resolveUrl('contract/ship-notices/pageList'),
    getDeliveryDetailUrl: resolveUrl('contract/ship-notices/queryById'),
    putDeliveryEditUrl: resolveUrl('contract/ship-notices/edit'),
    getDeliverySubmitUrl: resolveUrl('contract/ship-notices/ship'),

    // 收货单
    getTakeDeliveryListUrl: resolveUrl('contract/receive-notices/pageList'),
    getTakeDeliveryDetailUrl: resolveUrl('contract/receive-notices/queryById'),
    postTakeDeliveryReceiveUrl: resolveUrl('contract/receive-notices/receive'),
    getSendReceiveNoticeUrl: resolveUrl('contract/aps/send-receive-notice'),

    // 数据同步
    getSyncApsUrl: resolveUrl('contract/aps/send-order-bill'),

    //溯源
    getTraceFlatLinksUrl: resolveUrl('contract/trace/flat-links'),
};

class ApiContract {
    postAddOrder(data) {
        return request({
            method: "POST",
            url: URLs.postAddOrderUrl,
            data,
        });
    }
    getOrderDetail(id) {
        return request({
            method: "GET",
            url: URLs.getOrderDetailUrl,
            params: { id },
        });
    }
    putOrderEdit(data) {
        return request({
            method: "PUT",
            url: URLs.putOrderEditUrl,
            data,
        });
    }


    getContractTemplateList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getContractTemplateListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    getContractTemplateDetail(id) {
        return request({
            method: "GET",
            url: URLs.getContractTemplateDetailUrl,
            params: { id },
        });
    }
    postContractTemplateAdd(data) {
        return request({
            method: "post",
            url: URLs.postContractTemplateAddUrl,
            data,
        });
    }
    putContractTemplateEdit(data) {
        return request({
            method: "put",
            url: URLs.putContractTemplateEditUrl,
            data,
        });
    }
    putContractTemplateStatus(data) {
        return request({
            method: "put",
            url: URLs.putContractTemplateStatusUrl,
            data,
        });
    }
    // 合同管理
    getContractBillList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getContractBillListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    getContractBillDetail(id) {
        return request({
            method: "GET",
            url: URLs.getContractBillDetailUrl,
            params: { id },
        });
    }
    postContractBillAdd(data) {
        return request({
            method: "POST",
            url: URLs.postContractBillAddUrl,
            data,
        });
    }
    putContractBillEdit(data) {
        return request({
            method: "PUT",
            url: URLs.putContractBillEditUrl,
            data,
        });
    }
    getTemplateList() {
        return request({
            method: "GET",
            url: URLs.getTemplateListUrl,
        });
    }
    getBasicProductList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getBasicProductListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }

    // 采购订单
    getRequirementsList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getRequirementsListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    getContractList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getContractListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    postRequirementsAdd(data) {
        return request({
            method: "POST",
            url: URLs.postRequirementsAddUrl,
            data,
        });
    }
    postContractAdd(data) {
        return request({
            method: "POST",
            url: URLs.postContractAddUrl,
            data,
        });
    }
    getPurchaseOrderList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getPurchaseOrderListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        })
    }
    getPurchaseOrderDetail(id) {
        return request({
            method: "GET",
            url: URLs.getPurchaseOrderDetailUrl,
            params: { id },
        })
    }
    putPurchaseOrderEdit(data) {
        return request({
            method: "PUT",
            url: URLs.putPurchaseOrderEditUrl,
            data,
        })
    }
    putOrderRelease(data) {
        return request({
            method: "PUT",
            url: URLs.putOrderReleaseUrl,
            data,
        })
    }

    // 采购订单确认
    getPurchaseOrderConfirmList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getPurchaseOrderConfirmListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        })
    }
    getPurchaseOrderConfirmDetail(id) {
        return request({
            method: "GET",
            url: URLs.getPurchaseOrderConfirmDetailUrl,
            params: { id },
        })
    }
    putPurchaseOrderConfirmEdit(data) {
        return request({
            method: "PUT",
            url: URLs.putPurchaseOrderConfirmEditUrl,
            data,
        })
    }
    putPurchaseOrderConfirmAgree(data) {
        return request({
            method: "PUT",
            url: URLs.putPurchaseOrderConfirmAgreeUrl,
            data,
        })
    }
    putPurchaseOrderConfirmReject(data) {
        return request({
            method: "PUT",
            url: URLs.putPurchaseOrderConfirmRejectUrl,
            data,
        })
    }

    // 要货计划
    getDetailPageList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getDetailPageListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    getPageExport(condition) {
        return request({
            method: "GET",
            url: URLs.getPageExportUrl,
            params: {
                ...condition,
            },
            responseType: "blob",
        });
    }
    // 创建发货单
    createDelivery(data) {
        return request({
            method: "POST",
            url: URLs.createDeliveryUrl,
            data,
        });
    }
    getDeliveryList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getDeliveryListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    getDeliveryDetail(id) {
        return request({
            method: "GET",
            url: URLs.getDeliveryDetailUrl,
            params: { id },
        });
    }
    putDeliveryEdit(data) {
        return request({
            method: "PUT",
            url: URLs.putDeliveryEditUrl,
            data,
        });
    }
    postDeliverySubmit(data) {
        return request({
            method: "POST",
            url: URLs.getDeliverySubmitUrl,
            data,
        });
    }
    getTakeDeliveryList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getTakeDeliveryListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    getTakeDeliveryDetail(id) {
        return request({
            method: "GET",
            url: URLs.getTakeDeliveryDetailUrl,
            params: { id },
        });
    }
    postTakeDeliveryReceive(data) {
        return request({
            method: "POST",
            url: URLs.postTakeDeliveryReceiveUrl,
            data,
        });
    }
    getSendReceiveNotice(id) {
        return request({
            method: "GET",
            url: URLs.getSendReceiveNoticeUrl,
            params: { id },
        });
    }
    getSyncAps(id) {
        return request({
            method: "GET",
            url: URLs.getSyncApsUrl,
            params: { id },
        });
    }

    //溯源
    getTraceFlatLinks(id, type) {
        return request({
            method: "GET",
            url: URLs.getTraceFlatLinksUrl,
            params: { nodeId: id, nodeType: type },
        });
    }

}

export default ApiContract;

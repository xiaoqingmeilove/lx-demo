import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
    getServiceResult: resolveUrl('quoted/lx-scoring-result/find-evaluate-all'), //评论查询
    exportServiceResult: resolveUrl('quoted/lx-scoring-result/report-evaluate'),//评论导出
    getPostSalesService: resolveUrl('quoted/after-sales/page'), //售后查询
    addPostSalesService: resolveUrl('quoted/after-sales/save'), //新增售后
    updatePostSalesService: resolveUrl('quoted/after-sales/update'), //维护售后
    detailPostSalesService: resolveUrl('quoted/after-sales/detail'), //售后详情
    getobtainDistributor: resolveUrl('quoted/franchiser-predeposit/all'), //售后客户表
    getCustomerInfo: resolveUrl('quoted/after-sales/customer-info'), //售后客户信息
    handleServicBill: resolveUrl('quoted/after-sales/accept'), //受理单据
    supportServicBill: resolveUrl('quoted/after-sales/assign'), //新增支持
    changeBillState: resolveUrl('quoted/after-sales/update-state'), //修改单据状态
    changeFollowUp: resolveUrl('quoted/after-sales/review'), //维护回访
    changeReceipt: resolveUrl('quoted/after-sales/receipt'), //维护回单
    billProcessRecord: resolveUrl('quoted/after-sales/record'), //处理过程
    evaluateDoc: resolveUrl('quoted/lx-scoring-result/findquo-evaluate'),
    evaluateFind: resolveUrl('quoted/lx-scoring-result/documentId-evaluate'),
    evaluateSave: resolveUrl('quoted/lx-scoring-result/save-scoring-result'),
}

class ApiInstance {
    getServiceResult(data) {
        return request({ method:'post', url:URLs.getServiceResult, data })
    }
    exportServiceResult(params) {
        return request({ method:'get', url:URLs.exportServiceResult, params, responseType:"blob" })
    }
    postSalesService(params,page,size) {
        return request({ method:'get', url:URLs.getPostSalesService+'?page='+page+'&size='+size, params })
    }
    addPostSalesService(data) {
        return request({ method:'post', url:URLs.addPostSalesService, data })
    }
    updatePostSalesService(data) {
        return request({ method:'put', url:URLs.updatePostSalesService, data })
    }
    detailPostSalesService(id) {
        return request({ method:'get', url:URLs.detailPostSalesService+'?id='+id })
    }
    getobtainDistributor(data) {
        return request({ method:'get', url:URLs.getobtainDistributor, data })
    }
    getCustomerInfo(data) {
        return request({ method:'get', url:URLs.getCustomerInfo, params:data })
    }
    handleServicBill(data) {
        return request({ method:'put', url:URLs.handleServicBill, params:data })
    }
    supportServicBill(data) {
        return request({ method:'post', url:URLs.supportServicBill, data })
    }
    evaluateServicBill(data) {
        return request({ method:'put', url:URLs.supportServicBill, data })
    }
    changeBillState(id,state) {
        return request({ method:'put', url:URLs.changeBillState, params:{id,state} })
    }
    changeFollowUp(data) {
        return request({ method:'post', url:URLs.changeFollowUp, data })
    }
    changeFollowUp(data) {
        return request({ method:'post', url:URLs.changeFollowUp, data })
    }
    billProcessRecord(id) {
        return request({ method:'get', url:URLs.billProcessRecord+'?id='+id })
    }
    changeReceipt(data) {
        return request({ method:'post', url:URLs.changeReceipt, data })
    }
    evaluateDoc(component) {
        return request({ method:'get', url:URLs.evaluateDoc, params:{component} })
    }
    evaluateFind(billNo) {
        return request({ method:'get', url:URLs.evaluateFind + '?billNo=' + billNo + '&scoringConfigNameId=1'})
    }
    evaluateSave(data) {
        return request({ method:'post', url:URLs.evaluateSave, data })
    }
}

export default ApiInstance
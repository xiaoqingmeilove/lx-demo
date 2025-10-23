import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
  // 供应商注册
  getSupplier: resolveUrl('basic-data/supplier'),
  postSupplier: resolveUrl('basic-data/supplier'),
  putSupplier: resolveUrl('basic-data/supplier'),
  getSupplierListUrl: resolveUrl('basic-data/supplier/list'),
  getSupplierExportUrl: resolveUrl('basic-data/supplier/export'),
  putSupplierRegisterUrl: resolveUrl('basic-data/supplier/register'),
  postSupplierRegistertUrl: resolveUrl('basic-data/supplier/register'),
  getSupplierRegisterUrl: resolveUrl('basic-data/supplier/register'),
  getMaterialAllListUrl: resolveUrl('basic-data/b-material-info/all-list'),
  getSupplierqualifiedUrl: resolveUrl('basic-data/supplier/qualified'),
  postSupplieImportRregisterUrl: resolveUrl('basic-data/supplier/import-register'),
  // 供应商准入
  getAccessListUrl: resolveUrl('basic-data/supplier/access-list'),
  getAccessExportUrl: resolveUrl('basic-data/supplier/access-export'),
  getAccessDetailUrl: resolveUrl('basic-data/supplier/access-register'),
  putAccessEditUrl: resolveUrl('basic-data/supplier/access-register'),
  // 供应商资质
  getQualificationsUrl: resolveUrl('basic-data/qualifications'),
  getQualificationsExportUrl: resolveUrl('basic-data/qualifications/export'),
  // 供应商资质
  getdetailUrl: resolveUrl('basic-data/detail'),
  getdetailExportUrl: resolveUrl('basic-data/detail/export'),

  getQualifiedSupplierListUrl: resolveUrl("basic-data/supplier/qualified"),

  // 供应商看板
  getNoticeBoardUrl: resolveUrl('basic-data/noticeBoard'),


  // 物料分类
  getMaterialListUrl: resolveUrl('basic-data/b-material-type/list'), //一览表
  saveMaterialUrl: resolveUrl('basic-data/b-material-type/save'), //新增
  editMaterialUrl: resolveUrl('basic-data/b-material-type/edit'), //编辑
  delMaterialUrl: resolveUrl('basic-data/b-material-type/del-batch'), //删除
  postMaterialTreeUrl: resolveUrl('basic-data/b-material-type/tree'),
  getMaterialTypeDetailUrl: resolveUrl('basic-data/b-material-type/detail'),

  // 物料档案
  getMaterialInfoUrl: resolveUrl('basic-data/b-material-info'), //详情
  getMaterialInfoListUrl: resolveUrl('basic-data/b-material-info/list'), //一览表
  saveMaterialInfoUrl: resolveUrl('basic-data/b-material-info/save'), //新增
  editMaterialInfoUrl: resolveUrl('basic-data/b-material-info/edit'), //编辑
  delMaterialInfoUrl: resolveUrl('basic-data/b-material-info/del-batch'), //删除
  putMaterialInfoBatchApplyUrl: resolveUrl('basic-data/b-material-info/batch-apply'), // 批量启用停用


  // 供应商首页
  indicatorsInfoUrl: resolveUrl('basic-data/home-page/otherCore-indicators'), //核心指标
  coreIndicatorsInfoUrl: resolveUrl('basic-data/home-page/core-indicators'), //供应商核心指标
  enquiryApplyInfoUrl: resolveUrl('basic-data/home-page/enquiryApplyNews'), //最新采购信息

  // 其他首页
  dashboardInfoUrl: resolveUrl('basic-data/home-page/project-dashboard'), //项目看板
  corewinAllUrl: resolveUrl('basic-data/home-page/purchasing-trends'), //采购趋势
  purchasingUrl: resolveUrl('basic-data/home-page/purchasing-trends'), //

  getSupplierInviteListUrl: resolveUrl('basic-data/supplier-invite/page-list'),     // 供应商邀请列表
  postSupplierInviteSaveUrl: resolveUrl('basic-data/supplier-invite/save-batch'),  //邀请供应商
  putSupplierInviteUrl: resolveUrl('basic-data/supplier-invite/invite'), //邀请
  getSupplierInviteSmsListUrl: resolveUrl('basic-data/supplier-invite/sms-list'), //短信记录


  // 供应商变更
  postSupplierChangeSubmitUrl: resolveUrl('basic-data/supplier-change/save'), // 变更提交
  getSupplierChangeListUrl: resolveUrl('basic-data/supplier-change/supplier-list'), // 变更记录列表
  getSupplierChangeUrl: resolveUrl('basic-data/supplier-change/list'), // 变更一览表
  getSupplierChangeDetailUrl: resolveUrl('basic-data/supplier-change/detail'), // 变更详情

  // 价目表
  getPriceListUrl: resolveUrl('basic-data/price-list/list'),
  getPriceDetailUrl: resolveUrl('basic-data/price-list/detail'),
  postPriceSaveUrl: resolveUrl('basic-data/price-list/save'),
  putPriceEditUrl: resolveUrl('basic-data/price-list/edit'),
  PostPriceImportUrl: resolveUrl('basic-data/price-list/import'),
  // priceCommonList组件使用
  getPriceCommonListUrl: resolveUrl('basic-data/price-list/common-list'),
  // priceCommonDetail组件使用
  getPriceCommonDetailUrl: resolveUrl('basic-data/price-list/common-detail'),


  // 货源清单
  getSourceListUrl: resolveUrl('basic-data/source-list/list'),
  getSourceDetailUrl: resolveUrl('basic-data/source-list/detail'),
  postSourceSaveUrl: resolveUrl('basic-data/source-list/save'),
  putSourceEditUrl: resolveUrl('basic-data/source-list/edit'),
  getSourceCancelUrl: resolveUrl('basic-data/source-list/cancel'),
  postSourceImportUrl: resolveUrl('basic-data/source-list/import'),

  // 库存预警
  getMaterialStockListUrl: resolveUrl('basic-data/material-stock/page-list'),
  getMaterialStockWarningListUrl: resolveUrl('basic-data/material-stock/warning-list'),
  postMaterialStockConfigSaveUrl: resolveUrl('basic-data/material-stock/config-save'),
  getMaterialStockCheckWarningUrl: resolveUrl('basic-data/material-stock/check-warning-flag'),

  // 收货地址
  getAddressListUrl: resolveUrl('basic-data/address/list'),
  saveAddressUrl: resolveUrl('basic-data/address/save'),

  // 预警转订单
  getMaterialWarningOrderUrl: resolveUrl('contract/order-bill/add/material-warning'),
}

class ApiInstance {
  getAddressList(condition, page = 1, size = 20) {
    return request({
      method: 'GET',
      url: URLs.getAddressListUrl,
      params: { ...condition, page, size },
    })
  }
  saveAddress(data) {
    return request({
      method: 'POST',
      url: URLs.saveAddressUrl,
      data
    })
  }

  getDashboardInfoApi() {
    return request({
      method: 'GET',
      url: URLs.dashboardInfoUrl,
    })
  }
  getcorewinAllApi() {
    return request({
      method: 'GET',
      url: URLs.corewinAllUrl,
    })
  }
  getPurchasingApi(condition) {
    return request({
      method: 'GET',
      url: URLs.purchasingUrl,
      params: {
        ...condition,
      },
    })
  }

  getindicatorsInfoApi() {
    return request({
      method: 'GET',
      url: URLs.indicatorsInfoUrl,
    })
  }
  getcoreIndicatorsInfoApi() {
    return request({
      method: 'GET',
      url: URLs.coreIndicatorsInfoUrl,
    })
  }
  getenquiryApplyInfoApi() {
    return request({
      method: 'GET',
      url: URLs.enquiryApplyInfoUrl,
    })
  }

  getNoticeBoard() {
    return request({
      method: 'GET',
      url: URLs.getNoticeBoardUrl,
    })
  }
  getSupplierqualified(condition, page = 1, size = 20) {
    return request({
      method: 'GET',
      url: URLs.getSupplierqualifiedUrl,
      params: {
        ...condition,
        page,
        size
      }
    })
  }
  getQualifiedSupplierList() {
    return request({
      method: 'GET',
      url: URLs.getQualifiedSupplierListUrl,
    })
  }
  getMaterialAllList(condition, page = 1, size = 20) {
    return request({
      method: 'get',
      url: URLs.getMaterialAllListUrl,
      params: {
        ...condition,
        page,
        size
      }
    })
  }
  getMaterialListApi(condition) {
    return request({
      method: 'get',
      url: URLs.getMaterialListUrl,
      params: {
        ...condition,
      }
    })
  }
  saveMaterialApi(data) {
    return request({
      method: 'POST',
      url: URLs.saveMaterialUrl,
      data,
    })
  }
  editMaterialApi(data) {
    return request({
      method: 'PUT',
      url: URLs.editMaterialUrl,
      data
    })
  }
  delMaterialApi(data) {
    return request({
      method: 'delete',
      url: URLs.delMaterialUrl,
      data
    })
  }
  postMaterialTree(data) {
    return request({
      method: 'POST',
      url: URLs.postMaterialTreeUrl,
      data
    })
  }
  getMaterialTypeDetail(id) {
    return request({
      method: 'GET',
      url: URLs.getMaterialTypeDetailUrl,
      params: { id }
    })
  }
  getMaterialInfoListApi(condition, page = 1, size = 20) {
    return request({
      method: 'get',
      url: URLs.getMaterialInfoListUrl,
      params: {
        ...condition,
        page,
        size
      }
    })
  }
  getMaterialInfoApi(condition) {
    return request({
      method: 'get',
      url: URLs.getMaterialInfoUrl,
      params: {
        ...condition,
      }
    })
  }

  saveMaterialInfoApi(data) {
    return request({
      method: 'POST',
      url: URLs.saveMaterialInfoUrl,
      data,
    })
  }
  editMaterialInfoApi(data) {
    return request({
      method: 'PUT',
      url: URLs.editMaterialInfoUrl,
      data
    })
  }
  delMaterialInfoApi(data) {
    return request({
      method: 'delete',
      url: URLs.delMaterialInfoUrl,
      data
    })
  }
  putMaterialInfoBatchApply(data) {
    return request({
      method: 'PUT',
      url: URLs.putMaterialInfoBatchApplyUrl,
      data
    })
  }

  getSupplier(id) {
    return request({
      method: 'GET',
      url: URLs.getSupplier,
      params: { id }
    })
  }
  postSupplier(data) {
    return request({
      method: 'POST',
      url: URLs.postSupplier,
      data,
    })
  }
  putSupplier(data) {
    return request({
      method: 'PUT',
      url: URLs.putSupplier,
      data
    })
  }
  getSupplierList(condition, page = 1, size = 20) {
    return request({
      method: 'GET',
      url: URLs.getSupplierListUrl,
      params: {
        ...condition,
        page,
        size
      }
    })
  }
  getSupplierExport(condition) {
    return request({
      method: 'GET',
      url: URLs.getSupplierExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    })
  }
  putSupplierRegister(data) {
    return request({
      method: 'PUT',
      url: URLs.putSupplierRegisterUrl,
      data
    })
  }
  postSupplierRegistert(data) {
    return request({
      method: 'POST',
      url: URLs.postSupplierRegistertUrl,
      data
    })
  }
  getSupplierRegister(id) {
    return request({
      method: 'GET',
      url: URLs.getSupplierRegisterUrl,
      params: { id }
    })
  }
  getAccessList(condition, page = 1, size = 20) {
    return request({
      method: 'GET',
      url: URLs.getAccessListUrl,
      params: {
        ...condition, page, size
      }
    })
  }
  getAccessExport(condition) {
    return request({
      method: 'GET',
      url: URLs.getAccessExportUrl,
      params: { ...condition },
      responseType: "blob",
    })
  }
  getAccessDetail(id) {
    return request({
      method: 'GET',
      url: URLs.getAccessDetailUrl,
      params: { id }
    })
  }
  putAccessEdit(data) {
    return request({
      method: 'PUT',
      url: URLs.putAccessEditUrl,
      data
    })
  }
  getQualifications(condition, page = 1, size = 20) {
    return request({
      method: 'GET',
      url: URLs.getQualificationsUrl,
      params: { ...condition, page, size }
    })
  }
  getQualificationsExport(condition) {
    return request({
      method: 'GET',
      url: URLs.getQualificationsExportUrl,
      params: { ...condition },
      responseType: "blob",
    })
  }
  getdetail(condition, page = 1, size = 20) {
    return request({
      method: 'GET',
      url: URLs.getdetailUrl,
      params: { ...condition, page, size }
    })
  }
  getdetailExport(condition) {
    return request({
      method: 'GET',
      url: URLs.getdetailExportUrl,
      params: { ...condition },
      responseType: "blob",
    })
  }

  // 邀请
  getSupplierInviteList(condition, page = 1, size = 20) {
    return request({
      method: 'GET',
      url: URLs.getSupplierInviteListUrl,
      params: {
        ...condition, page, size
      }
    })
  }
  postSupplierInviteSave(data) {
    return request({
      method: 'POST',
      url: URLs.postSupplierInviteSaveUrl,
      data
    })
  }
  putSupplierInvite(data) {
    return request({
      method: 'PUT',
      url: URLs.putSupplierInviteUrl,
      data
    })
  }
  getSupplierInviteSmsList(condition) {
    return request({
      method: 'GET',
      url: URLs.getSupplierInviteSmsListUrl,
      params: {
        ...condition
      }
    })
  }
  postSupplieImportRregister(file) {
    const formData = new FormData();
    formData.append("file", new Blob([file]));
    return request({
      method: 'post',
      url: URLs.postSupplieImportRregisterUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  // 供应商变更
  postSupplierChangeSubmit(data) {
    return request({
      method: 'post',
      url: URLs.postSupplierChangeSubmitUrl,
      data
    })
  }
  getSupplierChangeList(masterId) {
    return request({
      method: 'get',
      url: URLs.getSupplierChangeListUrl,
      params: { masterId }
    })
  }
  getSupplierChange(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getSupplierChangeUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getSupplierChangeDetail(id) {
    return request({
      method: 'get',
      url: URLs.getSupplierChangeDetailUrl,
      params: { id }
    })
  }

  // 价目表
  getPriceList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getPriceListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }

  getPriceCommonList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getPriceCommonListUrl,
      params: { ...condition, page, size },
    });
  }
  getPriceCommonDetail(id) {
    return request({
      method: "GET",
      url: URLs.getPriceCommonDetailUrl,
      params: { id }
    });
  }

  getPriceDetail(id) {
    return request({
      method: 'get',
      url: URLs.getPriceDetailUrl,
      params: { id }
    })
  }
  postPriceSave(data) {
    return request({
      method: 'post',
      url: URLs.postPriceSaveUrl,
      data
    })
  }
  putPriceEdit(data) {
    return request({
      method: 'put',
      url: URLs.putPriceEditUrl,
      data
    })
  }
  postPriceImport(file) {
    const formData = new FormData();
    formData.append("file", new Blob([file]));
    return request({
      method: 'post',
      url: URLs.PostPriceImportUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  // 货源清单
  getSourceList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getSourceListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getSourceDetail(id) {
    return request({
      method: 'get',
      url: URLs.getSourceDetailUrl,
      params: { id }
    })
  }
  getSourceCancel(id) {
    return request({
      method: 'get',
      url: URLs.getSourceCancelUrl,
      params: { id }
    })
  }
  postSourceSave(data) {
    return request({
      method: 'post',
      url: URLs.postSourceSaveUrl,
      data
    })
  }
  putSourceEdit(data) {
    return request({
      method: 'put',
      url: URLs.putSourceEditUrl,
      data
    })
  }
  postSourceImport(file) {
    const formData = new FormData();
    formData.append("file", new Blob([file]));
    return request({
      method: 'post',
      url: URLs.postSourceImportUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  // 库存预警
  getMaterialStockList(condition, page = 1, size = 20) {
    return request({
      method: 'get',
      url: URLs.getMaterialStockListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    })
  }
  getMaterialStockWarningList() {
    return request({
      method: 'get',
      url: URLs.getMaterialStockWarningListUrl,
    })
  }
  postMaterialStockConfigSave(data) {
    return request({
      method: 'post',
      url: URLs.postMaterialStockConfigSaveUrl,
      data
    })
  }
  getMaterialStockCheckWarning() {
    return request({
      method: 'get',
      url: URLs.getMaterialStockCheckWarningUrl
    })
  }
  getMaterialWarningOrder(data) {
    return request({
      method: 'post',
      url: URLs.getMaterialWarningOrderUrl,
      data
    })
  }
}

export default ApiInstance

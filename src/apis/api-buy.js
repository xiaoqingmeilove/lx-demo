import request from "@/utils/request";
import { resolveUrl } from "@/utils/resolve-url";
import { findMenuByTitle, findMenuByCode } from "@/utils/menu";

const URLs = {
  // 采购需求看板
  getPurchaseNeedNoticeListUrl: resolveUrl("procurement/purch-report/apply-sourcing"),//采购需求看板-未开始寻源需求明细
  getPurchaseNeedNoticeEchartUrl: resolveUrl("procurement/purch-report/apply-echarts"),//-图表数据
  getPurchaseNeedNoticeSummaryUrl: resolveUrl("procurement/purch-report/apply-summary"),//数据统计
  // 寻源统计看板
  getSeekNoticeEchartUrl: resolveUrl("procurement/purch-report/sourcing-echarts"),//-图表数据
  // 采购申请
  getPurchaseApplyListExportUrl: resolveUrl("procurement/purch-normal/export"), //一览表导出
  getPurchaseApplyListUrl: resolveUrl("procurement/purch-normal/page"),//一览表
  getPurchaseApplyDetailUrl: resolveUrl("procurement/purch-normal/getById"), //详情接口
  postPurchaseApplyUrl: resolveUrl("procurement/purch-normal/save"),// 新增
  putPurchaseApplyUrl: resolveUrl("procurement/purch-normal/updateById"), //修改/保存

 // 项目采购
 getPurchaseProjectListExportUrl: resolveUrl("procurement/purch-project/export"),//一览表
 getPurchaseProjectListUrl: resolveUrl("procurement/purch-project/page"),//一览表
 getPurchaseProjectDetailUrl: resolveUrl("procurement/purch-project/getById"), //详情接口
 postPurchaseProjectUrl: resolveUrl("procurement/purch-project/save"),// 新增
 putPurchaseProjectUrl: resolveUrl("procurement/purch-project/updateById"), //修改/保存

 // 采购需求池
 getPurchasePoolListExportUrl: resolveUrl("procurement/purch-requirements/export"),//一览表
 getPurchasePoolListUrl: resolveUrl("procurement/purch-requirements/page"),//一览表
 getPurchasePoolDetailUrl: resolveUrl("procurement/purch-requirements/getById"), //详情接口
 putPurchasePoolUrl: resolveUrl("procurement/purch-requirements/updateById"), //修改/保存
 postPoolToSeekUrl: resolveUrl("procurement/purch-requirements/enquiry-apply"),//需求去询价
 postBiddingApplyAddUrl: resolveUrl('procurement/bidding-apply/add'),//需求池竞价
 postRequirementsAddUrl: resolveUrl('contract/tender/requirements-add'),//需求池招标

};

class ApiInstance {
  postRequirementsAdd(data){
    return request({
      method: "POST",
      url: URLs.postRequirementsAddUrl,
      data
    });
  }
  postBiddingApply(data){
    return request({
        method: "POST",
        url: URLs.postBiddingApplyAddUrl,
        data
    });
  }
  postPoolToSeek(data) {
    return request({
      method: "post",
      url: URLs.postPoolToSeekUrl,
      data: { ...data },
    });
  }
  getSeekNoticeEchart() {
    return request({
      method: "GET",
      url: URLs.getSeekNoticeEchartUrl,
    });
  }
  getPurchaseNeedNoticeEchart() {
    return request({
      method: "GET",
      url: URLs.getPurchaseNeedNoticeEchartUrl,
    });
  }
  getPurchaseNeedNoticeSummary() {
    return request({
      method: "GET",
      url: URLs.getPurchaseNeedNoticeSummaryUrl,
    });
  }
  getPurchaseNeedNoticeList(page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getPurchaseNeedNoticeListUrl,
      params: {
        page,
        size,
      },
    });
  }
  getPurchaseProjectListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getPurchaseProjectListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getPurchaseProjectList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getPurchaseProjectListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getPurchaseProjectDetail(data) {
    return request({
      method: "get",
      url: URLs.getPurchaseProjectDetailUrl,
      params: { ...data },
    });
  }
  postPurchaseProject(data) {
    return request({
      method: "POST",
      url: URLs.postPurchaseProjectUrl,
      data: { ...data },
    });
  }
  putPurchaseProject(data) {
    return request({
      method: "put",
      url: URLs.putPurchaseProjectUrl,
      data: { ...data },
    });
  }
  getPurchasePoolListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getPurchasePoolListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getPurchasePoolList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getPurchasePoolListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getPurchasePoolDetail(data) {
    return request({
      method: "get",
      url: URLs.getPurchasePoolDetailUrl,
      params: { ...data },
    });
  }
  putPurchasePool(data) {
    return request({
      method: "put",
      url: URLs.putPurchasePoolUrl,
      data: { ...data },
    });
  }
  getPurchaseApplyList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getPurchaseApplyListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getPurchaseApplyListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getPurchaseApplyListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getPurchaseApplyDetail(data) {
    return request({
      method: "get",
      url: URLs.getPurchaseApplyDetailUrl,
      params: { ...data },
    });
  }
  postPurchaseApply(data) {
    return request({
      method: "POST",
      url: URLs.postPurchaseApplyUrl,
      data: { ...data },
    });
  }
  putPurchaseApply(data) {
    return request({
      method: "put",
      url: URLs.putPurchaseApplyUrl,
      data: { ...data },
    });
  }
}

export default ApiInstance;

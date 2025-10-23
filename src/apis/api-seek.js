import request from "@/utils/request";
import { resolveUrl } from "@/utils/resolve-url";
import { findMenuByTitle, findMenuByCode } from "@/utils/menu";

const URLs = {
  // 询价申请
  getEnquiryApplyListExportUrl: resolveUrl("procurement/enquiry-apply/export"),//一览表导出
  getEnquiryApplyListUrl: resolveUrl("procurement/enquiry-apply/page"),//一览表
  getEnquiryApplyDetailUrl: resolveUrl("procurement/enquiry-apply/getById"), //详情接口
  putEnquiryApplyUrl: resolveUrl("procurement/enquiry-apply/updateById"), //修改/保存

  //  询价大厅
  getEnquiryHallListExportUrl: resolveUrl("procurement/enquiry-hall/export"),//一览表导出
  getEnquiryHallListUrl: resolveUrl("procurement/enquiry-hall/page"),//一览表
  getEnquiryHallDetailUrl: resolveUrl("procurement/enquiry-hall/getById"), //详情接口
  putEnquiryHallUrl: resolveUrl("procurement/enquiry-hall/updateById"), //修改/保存
  putEnquiryHallEndUrl: resolveUrl("procurement/enquiry-hall/stop"), // 终止 {id:1}
  putEnquiryHallDelayUrl: resolveUrl("procurement/enquiry-hall/delay"),// 延期{id:1,time:"2024/12/1"}
  postEnquiryResultConfimUrl: resolveUrl("procurement/enquiry-apply/confirm"),// 询价结果确认{id:1}
  postHallAgainEnquiryUrl: resolveUrl("procurement/enquiry-hall/again"), // 二次询价{询价大厅id:1}
  postSupplierApplyUrl: resolveUrl("procurement/enquiry-hall/apply"), // 经销商参与报价 {id:1}

  // 供应商报价单     // 附件code:SA
  getSupplierApplyListExportUrl: resolveUrl("procurement/enquiry-quote/export"),//一览表导出
  getSupplierApplyListUrl: resolveUrl("procurement/enquiry-quote/page"),//一览表
  getSupplierApplyDetailUrl: resolveUrl("procurement/enquiry-quote/getById"), //详情接口
  putSupplierApplyUrl: resolveUrl("procurement/enquiry-quote/updateById"), //修改/保存
  putSupplierSubmitUrl: resolveUrl("procurement/enquiry-quote/submit"), //经销商提交报价

  // 供应商报价明细
  getSupplierQuoteListExportUrl: resolveUrl("procurement/enquiry-quote/detail-export"),//一览表导出
  getSupplierQuoteListUrl: resolveUrl("procurement/enquiry-quote/detail-page"),//一览表

  //询价结果确认    // 附件code:RC  工作流code    code="market_seekContrast_resultConfim"
  getResultConfimListExportUrl: resolveUrl("procurement/enquiry-result/export"),//一览表导出
  getResultConfimListUrl: resolveUrl("procurement/enquiry-result/page"),//一览表
  getResultConfimDetailUrl: resolveUrl("procurement/enquiry-result/getById"), //详情接口
  putResultConfimUrl: resolveUrl("procurement/enquiry-result/updateById"), //修改/保存
  postResultAgainEnquiryUrl: resolveUrl("procurement/enquiry-result/again"), // 二次询价{询价结果id:1}

  // 询价结果中标明细
  getWinBidListExportUrl: resolveUrl("procurement/enquiry-result/detail-export"),//一览表导出
  getWinBidListListUrl: resolveUrl("procurement/enquiry-result/detail-page"),//一览表


  // 询价中标结果查询   ＋接口
  getSeekWinBidListExportUrl: resolveUrl("procurement/enquiry-result/win-export"),//一览表导出
  getSeekWinBidListListUrl: resolveUrl("procurement/enquiry-result/win-page"),//一览表
  getSeekWinBidDetailUrl: resolveUrl("procurement/enquiry-result/win-getById"), //详情接口

  // 供应商参与报名
  postEnquiryHallsignUpUrl: resolveUrl("procurement/enquiry-hall/sign-up"),
  postEnquiryHallrejectUrl: resolveUrl("procurement/enquiry-hall/reject-sign-up"),


  // 开标
  putOpenBidUrl: resolveUrl("procurement/enquiry-apply/bid-open"),
  putStopEnquiryUrl: resolveUrl("procurement/enquiry-apply/stop"),
  putChangeTimeUrl: resolveUrl("procurement/enquiry-apply/delay"),
  postMoreEnquiryUrl: resolveUrl("procurement/enquiry-apply/again"),
};

class ApiInstance {
  // 供应商中标结果
  getSeekWinBidListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getSeekWinBidListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getSeekWinBidList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getSeekWinBidListListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getSeekWinBidDetail(data) {
    return request({
      method: "get",
      url: URLs.getSeekWinBidDetailUrl,
      params: { ...data },
    });
  }
  // 询价结果中标明细
  getWinBidListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getWinBidListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getWinBidListList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getWinBidListListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  // 供应商报价明细
  getSupplierQuoteListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getSupplierQuoteListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getSupplierQuoteList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getSupplierQuoteListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  // 询价结果确认 
  getResultConfimListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getResultConfimListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getResultConfimList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getResultConfimListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getResultConfimDetail(data) {
    return request({
      method: "get",
      url: URLs.getResultConfimDetailUrl,
      params: { ...data },
    });
  }
  putResultConfim(data) {
    return request({
      method: "put",
      url: URLs.putResultConfimUrl,
      data: { ...data },
    });
  }
  postResultAgainEnquiry(data) {
    return request({
      method: "post",
      url: URLs.postResultAgainEnquiryUrl,
      data: { ...data },
    });
  }
  // 供应商报价单
  getSupplierApplyListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getSupplierApplyListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getSupplierApplyList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getSupplierApplyListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getSupplierApplyDetail(data) {
    return request({
      method: "get",
      url: URLs.getSupplierApplyDetailUrl,
      params: { ...data },
    });
  }
  putSupplierApply(data) {
    return request({
      method: "put",
      url: URLs.putSupplierApplyUrl,
      data: { ...data },
    });
  }
  putSupplierSubmit(data) {
    return request({
      method: "put",
      url: URLs.putSupplierSubmitUrl,
      data: { ...data },
    });
  }
  // 询价大厅
  getEnquiryHallListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getEnquiryHallListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getEnquiryHallList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getEnquiryHallListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getEnquiryHallDetail(data) {
    return request({
      method: "get",
      url: URLs.getEnquiryHallDetailUrl,
      params: { ...data },
    });
  }
  putEnquiryHall(data) {
    return request({
      method: "put",
      url: URLs.putEnquiryHallUrl,
      data: { ...data },
    });
  }
  putEnquiryHallEnd(data) {
    return request({
      method: "put",
      url: URLs.putEnquiryHallEndUrl,
      data: { ...data },
    });
  }
  putEnquiryHallDelay(data) {
    return request({
      method: "put",
      url: URLs.putEnquiryHallDelayUrl,
      data: { ...data },
    });
  }
  postEnquiryResultConfim(data) {
    return request({
      method: "post",
      url: URLs.postEnquiryResultConfimUrl,
      data: { ...data },
    });
  }
  postHallAgainEnquiry(data) {
    return request({
      method: "post",
      url: URLs.postHallAgainEnquiryUrl,
      data: { ...data },
    });
  }
  postSupplierApply(data) {
    return request({
      method: "post",
      url: URLs.postSupplierApplyUrl,
      data: { ...data },
    });
  }

  // 询价申请
  getEnquiryApplyListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getEnquiryApplyListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getEnquiryApplyList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getEnquiryApplyListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getEnquiryApplyDetail(data) {
    return request({
      method: "get",
      url: URLs.getEnquiryApplyDetailUrl,
      params: { ...data },
    });
  }
  putEnquiryApply(data) {
    return request({
      method: "put",
      url: URLs.putEnquiryApplyUrl,
      data: { ...data },
    });
  }
  postEnquiryHallsignUp(data) {
    return request({
      method: "post",
      url: URLs.postEnquiryHallsignUpUrl,
      data: { ...data },
    });
  }
  postEnquiryHallreject(data) {
    return request({
      method: "post",
      url: URLs.postEnquiryHallrejectUrl,
      data: { ...data },
    });
  }
  postOpenBid(data) {
    return request({
      method: "put",
      url: URLs.putOpenBidUrl,
      data: { ...data },
    });
  }
  putStopEnquiry(data) {
    return request({
      method: "put",
      url: URLs.putStopEnquiryUrl,
      data: { ...data },
    });
  }
  putChangeTime(data) {
    return request({
      method: "put",
      url: URLs.putChangeTimeUrl,
      data: { ...data },
    });
  }
  postMoreEnquiry(data) {
    return request({
      method: "post",
      url: URLs.postMoreEnquiryUrl,
      data: { ...data },
    });
  }
}

export default ApiInstance;

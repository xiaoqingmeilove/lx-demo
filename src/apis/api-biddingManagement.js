/*
 * @Author: wmm
 * @Date: 2025-07-18 09:17:48
 * @LastEditors: wmm
 * @LastEditTime: 2025-08-06 13:06:36
 */
import request from "@/utils/request";
import { resolveUrl } from "@/utils/resolve-url";

const URLs = {
    getTenderListUrl: resolveUrl("contract/tender/page-list"),
    getTenderDetailUrl: resolveUrl("contract/tender/detail"),
    addTenderUrl: resolveUrl("contract/tender/add"),
    editTenderUrl: resolveUrl("contract/tender/edit"),
    getSupplierApplyListUrl: resolveUrl("contract/tender-supplier/page-list"),
    tenderReleaseUrl: resolveUrl("contract/tender/release"),
    getSupplierApplyDetailUrl: resolveUrl("contract/tender-supplier/detail"),
    putDocEditUrl: resolveUrl("contract/tender/doc/edit"),
    putDocSubmitUrl: resolveUrl("contract/tender/doc/submit"),
    putBidReleaseUrl: resolveUrl("contract/tender/bid/release"),
    postSignUpUrl: resolveUrl("contract/tender-supplier/sign-up"),
    postRejectSignUpUrl: resolveUrl("contract/tender-supplier/reject-sign-up"),
    putShotlistEditUrl: resolveUrl("contract/tender/shotlist/edit"),
    getBidListUrl: resolveUrl("contract/tender-supplier/bid/page-list"), // 我的投标
    getBidDetailUrl: resolveUrl("contract/tender-supplier/bid/detail"), // 我的投标详情
    postAddAnswerUrl: resolveUrl("contract/tender-answer/add"), // 新建问题
    getAnswerListUrl: resolveUrl("contract/tender-answer/list"), // 问题一览表
    getAnswerDetailUrl: resolveUrl("contract/tender-answer/detail-list"), // 问题详情
    postAnswerReplyUrl: resolveUrl("contract/tender-answer/reply"), // 回复问题
    putFinishAnswerUrl: resolveUrl("contract/tender/answer/finish"), // 结束答疑
    putShotlistSubmitUrl: resolveUrl("contract/tender/shotlist/submit"), // 入围提交
    getBidTenderUrl: resolveUrl("contract/tender-supplier/bid/bid-detail"), // 投标文件
    postBidSaveUrl: resolveUrl("contract/tender-supplier/bid/bid-save"), // 投标保存
    putBidSubmitUrl: resolveUrl("contract/tender-supplier/bid/bid-submit"), // 投标提交
    putBidOpenUrl: resolveUrl("contract/tender/bid/opening"), // 开标
    putBidApplyUrl: resolveUrl("contract/tender/expert/bid-apply"), // 定标
    getBidReviewUrl: resolveUrl("contract/tender/expert/score-detail"), // 投标评审
    putBidReviewUrl: resolveUrl("contract/tender/expert/score-save"), // 投标评审保存
    putScoreSubmitUrl: resolveUrl("contract/tender/expert/score-submit"), // 评分提交
    putBidFinishUrl: resolveUrl("contract/tender/expert/score-finish"), // 投标完成
    getBidAwardDetailUrl: resolveUrl("contract/tender/award/detail"), // 中标结果明细
    putBidAwardConfirmUrl: resolveUrl("contract/tender/award/confirm"), // 中标结果确认
    putBidAwardSaveUrl: resolveUrl("contract/tender/award/save"), // 中标结果保存
    putBidAwardSubmitUrl: resolveUrl("contract/tender/award/submit"), // 中标结果提交
    getNegotiateDetailListUrl: resolveUrl("contract/tender/negotiate/detail-list"), // 谈判记录
    postNegotiateSaveUrl: resolveUrl("contract/tender/negotiate/save"), // 谈判记录保存
    postNegotiateSubmitUrl: resolveUrl("contract/tender/negotiate/submit"), // 谈判记录提交
    getBidReviewDetailUrl: resolveUrl("contract/tender/expert/score-report"), // 投标评审详情
    putSignEndUrl: resolveUrl("contract/tender/sign-up-stop"), // 报名结束
    // putBidSubmitUrl: resolveUrl("contract/tender-supplier/bid/bid-submit"), // 投标提交
    getBizOperLogUrl: resolveUrl("basic-data/biz-oper-log/list"), // 操作记录

    // 标书评审
    getBidReviewListUrl: resolveUrl("contract/tender-expert/page-list"), // 投标评审列表
    getBidReviewTenderExpertDetailUrl: resolveUrl("contract/tender-expert/detail"), // 投标评审详情
    getBidReviewTenderExpertScoreReportUrl: resolveUrl("contract/tender-expert/score-detail"), // 投标评审评分报告
    putBidReviewTenderExpertScoreSaveUrl: resolveUrl("contract/tender-expert/score-save"), // 投标评审评分保存
    putBidReviewTenderExpertScoreSubmitUrl: resolveUrl("contract/tender-expert/score-submit"), // 投标评审评分提交

    // 定标审核
    getTenderAuditPageListUrl: resolveUrl("contract/tender-audit/page-list"), // 投标评审列表
    getTenderAuditDetailUrl: resolveUrl("contract/tender-audit/detail"), // 投标详情查询
    
    // 供应商投标明细
    getBidSupplierDetailUrl: resolveUrl("contract/tender/bid/supplier-detail"),

    // 作废单价
    putTenderCancelUrl: resolveUrl("contract/tender/cancel")

    
};

class ApiBiddingManagement {
    putTenderCancel(data){
        return request({
            method: "put",
            url: URLs.putTenderCancelUrl,
            data,
        });
    }
    getBidSupplierDetail(data){
        return request({
            method: "GET",
            url: URLs.getBidSupplierDetailUrl,
            params: data,
        });
    }
    getTenderAuditDetail(data){
        return request({
            method: "GET",
            url: URLs.getTenderAuditDetailUrl,
            params: data,
        });
    }
    getTenderAuditPageList(data){
        return request({
            method: "GET",
            url: URLs.getTenderAuditPageListUrl,
            params: data,
        });
    }
    putBidReviewTenderExpertScoreSubmit(data) {
        return request({
            method: "put",
            url: URLs.putBidReviewTenderExpertScoreSubmitUrl,
            data,
        });
    }
    putBidReviewTenderExpertScoreSave(data) {
        return request({
            method: "put",
            url: URLs.putBidReviewTenderExpertScoreSaveUrl,
            data,
        });
    }
    getBidReviewTenderExpertScoreReport(data) {
        return request({
            method: "GET",
            url: URLs.getBidReviewTenderExpertScoreReportUrl,
            params: data,
        });
    }
    getBidReviewTenderExpertDetail(data) {
        return request({
            method: "GET",
            url: URLs.getBidReviewTenderExpertDetailUrl,
            params: data,
        });
    }
    getBidReviewList(data, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getBidReviewListUrl,
            params: { ...data, page, size },
        });
    }
    getBizOperLog(data) {
        return request({
            method: "GET",
            url: URLs.getBizOperLogUrl,
            params: data,
        });
    }
    putBidApply(data) {
        return request({
            method: "put",
            url: URLs.putBidApplyUrl,
            data,
        });
    }
    putBidSubmit(data) {
        return request({
            method: "put",
            url: URLs.putBidSubmitUrl,
            data,
        });
    }
    putSignEnd(data) {
        return request({
            method: "put",
            url: URLs.putSignEndUrl,
            data,
        });
    }
    getBidReviewDetail(data) {
        return request({
            method: "GET",
            url: URLs.getBidReviewDetailUrl,
            params: data,
        });
    }
    postNegotiateSubmit(data) {
        return request({
            method: "put",
            url: URLs.postNegotiateSubmitUrl,
            data,
        });
    }
    postNegotiateSave(data) {
        return request({
            method: "POST",
            url: URLs.postNegotiateSaveUrl,
            data,
        });
    }
    getNegotiateDetailList(data) {
        return request({
            method: "GET",
            url: URLs.getNegotiateDetailListUrl,
            params: data,
        });
    }
    putBidAwardSubmit(data) {
        return request({
            method: "put",
            url: URLs.putBidAwardSubmitUrl,
            data,
        });
    }
    putBidAwardSave(data) {
        return request({
            method: "put",
            url: URLs.putBidAwardSaveUrl,
            data,
        });
    }
    putBidAwardConfirm(data) {
        return request({
            method: "put",
            url: URLs.putBidAwardConfirmUrl,
            data,
        });
    }
    getBidAwardDetail(data) {
        return request({
            method: "GET",
            url: URLs.getBidAwardDetailUrl,
            params: data,
        });
    }
    putBidFinish(data) {
        return request({
            method: "put",
            url: URLs.putBidFinishUrl,
            data,
        });
    }
    putScoreSubmit(data) {
        return request({
            method: "put",
            url: URLs.putScoreSubmitUrl,
            data,
        });
    }
    putBidReview(data) {
        return request({
            method: "put",
            url: URLs.putBidReviewUrl,
            data,
        });
    }
    getBidReview(data) {
        return request({
            method: "GET",
            url: URLs.getBidReviewUrl,
            params: data,
        });
    }
    putBidOpen(data) {
        return request({
            method: "put",
            url: URLs.putBidOpenUrl,
            data,
        });
    }
    putBidSubmit(data) {
        return request({
            method: "put",
            url: URLs.putBidSubmitUrl,
            data,
        });
    }
    postBidSave(data) {
        return request({
            method: "POST",
            url: URLs.postBidSaveUrl,
            data,
        });
    }
    getBidTender(data) {
        return request({
            method: "GET",
            url: URLs.getBidTenderUrl,
            params: data,
        });
    }
    putShotlistSubmit(data) {
        return request({
            method: "put",
            url: URLs.putShotlistSubmitUrl,
            data,
        });
    }
    putShotlistEdit(data) {
        return request({
            method: "put",
            url: URLs.putShotlistEditUrl,
            data,
        });
    }
    postRejectSignUp(data) {
        return request({
            method: "POST",
            url: URLs.postRejectSignUpUrl,
            data,
        });
    }
    postSignUp(data) {
        return request({
            method: "POST",
            url: URLs.postSignUpUrl,
            data,
        });
    }
    getSupplierApplyDetail(data) {
        return request({
            method: "GET",
            url: URLs.getSupplierApplyDetailUrl,
            params: data,
        });
    }
    getTenderList(data, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getTenderListUrl,
            params: {
                ...data,
                page,
                size,
            }
        });
    }

    getTenderDetail(data) {
        return request({
            method: "GET",
            url: URLs.getTenderDetailUrl,
            params: data,
        });
    }
    addTender(data) {
        return request({
            method: "POST",
            url: URLs.addTenderUrl,
            data,
        });
    }
    editTender(data) {
        return request({
            method: "put",
            url: URLs.editTenderUrl,
            data,
        });
    }
    getSupplierApplyList(data, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getSupplierApplyListUrl,
            params: { ...data, page, size },
        });
    }
    tenderRelease(data) {
        return request({
            method: "put",
            url: URLs.tenderReleaseUrl,
            data,
        });
    }
    putDocEdit(data) {
        return request({
            method: "put",
            url: URLs.putDocEditUrl,
            data,
        });
    }
    putDocSubmit(data) {
        return request({
            method: "put",
            url: URLs.putDocSubmitUrl,
            data,
        });
    }
    putBidRelease(data) {
        return request({
            method: "put",
            url: URLs.putBidReleaseUrl,
            data,
        });
    }
    getBidList(data, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getBidListUrl,
            params: {
                ...data,
                page,
                size,
            }
        });
    }
    getBidDetail(params) {
        return request({
            method: "GET",
            url: URLs.getBidDetailUrl,
            params
        });
    }
    postAddAnswer(data) {
        return request({
            method: "POST",
            url: URLs.postAddAnswerUrl,
            data,
        });
    }
    getAnswerDetail(data) {
        return request({
            method: "GET",
            url: URLs.getAnswerDetailUrl,
            params: data,
        });
    }
    getAnswerList(data) {
        return request({
            method: "GET",
            url: URLs.getAnswerListUrl,
            params: data,
        });
    }
    postAnswerReply(data) {
        return request({
            method: "POST",
            url: URLs.postAnswerReplyUrl,
            data,
        });
    }
    putFinishAnswer(data) {
        return request({
            method: "put",
            url: URLs.putFinishAnswerUrl,
            data,
        });
    }
}

export default ApiBiddingManagement;

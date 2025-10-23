import request from "@/utils/request";
import { resolveUrl } from "@/utils/resolve-url";
import { findMenuByTitle, findMenuByCode } from "@/utils/menu";

const URLs = {
    // 竞价邀请
    getBiddingApplyListUrl: resolveUrl("procurement/bidding-apply/list"),    //一览表
    getBiddingtDetailUrl: resolveUrl("procurement/bidding-apply"),           //详情
    postBiddingtAddUrl: resolveUrl("procurement/bidding-apply"),             //新增
    putBiddingEditUrl: resolveUrl("procurement/bidding-apply"),              //修改

    // 竞价报名
    putBiddingSignEditUrl: resolveUrl("procurement/bidding-sign"),
    getBiddingSignUrl: resolveUrl('procurement/bidding-sign'),
    getBiddingSignListUrl: resolveUrl('procurement/bidding-sign/list'),

    // 竞价大厅
    getBiddingSignHallListUrl: resolveUrl('procurement/bidding-sign/hall-list'),
    getBiddingSignHallDetailUrl: resolveUrl('procurement/bidding-sign/hall'),
    putBiddingSignOfferUrl: resolveUrl('procurement/bidding-sign/offer'),
    getBiddingSignHallDetailsUrl: resolveUrl('procurement/bidding-sign/hall-details'),

    // 竞价大厅后台
    getBiddingApplyHallListUrl: resolveUrl('procurement/bidding-apply/hall-list'),
    getBiddingApplyHallOfferListUrl: resolveUrl('procurement/bidding-apply/hall-offerList'),

    // 核价
    getBiddingPricingListUrl: resolveUrl("procurement/bidding-pricing/list"),
    getBiddingPricingDetailUrl: resolveUrl("procurement/bidding-pricing"),
    postBiddingPricingUrl: resolveUrl("procurement/bidding-pricing"),
    putBiddingPricingUrl: resolveUrl("procurement/bidding-pricing"),
    getApplicantsUrl: resolveUrl("procurement/bidding-pricing/applicants"),

    // 中标
    getJournalingBidListUrl: resolveUrl("procurement/bidding-journaling/bid"),
    getJournalingBidDetailsUrl: resolveUrl("procurement/bidding-journaling/bid-details"),
    getBidDetailUrl: resolveUrl('procurement/bidding-journaling/getBid'),

    // 报价
    getHallListUrl: resolveUrl("procurement/bidding-journaling/hall"),
    getHallDetailsUrl: resolveUrl("procurement/bidding-journaling/hall-details"),
    getHallDetailUrl: resolveUrl('procurement/bidding-journaling/getHall'),


};

class ApiInstance {
    // 竞价邀请
    getBiddingApplyList(condition, page = 1, size = 20) {
        return request({
            method: "GET",
            url: URLs.getBiddingApplyListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    // getEnquiryHallListExport(condition) {
    //     return request({
    //         method: "GET",
    //         url: URLs.getEnquiryHallListExportUrl,
    //         params: {
    //             ...condition,
    //         },
    //         responseType: "blob",
    //     });
    // }
    getBiddingtDetail(id){
        return request({
            method: "GET",
            url: URLs.getBiddingtDetailUrl,
            params: { id }
        });
    }
    postBiddingtAdd(data){
        return request({
            method: "POST",
            url: URLs.postBiddingtAddUrl,
            data
        });
    }
    putBiddingEdit(data){
        return request({
            method: "PUT",
            url: URLs.putBiddingEditUrl,
            data
        });
    }

    // 竞价报名
    getBiddingSignList(condition, page = 1, size = 20){
        return request({
            method: "GET",
            url: URLs.getBiddingSignListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        });
    }
    getBiddingSign(id){
        return request({
            method: "GET",
            url: URLs.getBiddingSignUrl,
            params: { id }
        });
    }
    putBiddingSignEdit(data){
        return request({
            method: "PUT",
            url: URLs.putBiddingSignEditUrl,
            data
        });
    }

    // 竞价大厅
    getBiddingSignHallList(condition, page = 1, size = 20){
        return request({
            method: 'GET',
            url: URLs.getBiddingSignHallListUrl,
            params: {
                ...condition,
                page,
                size,
            },
        })
    }
    getBiddingSignHallDetail(id){
        return request({
            method: 'GET',
            url: URLs.getBiddingSignHallDetailUrl,
            params: { id }
        })
    }
    putBiddingSignOffer(data){
        return request({
            method: 'PUT',
            url: URLs.putBiddingSignOfferUrl,
            data
        })
    }
    getBiddingSignHallDetails(id){
        return request({
            method: 'GET',
            url: URLs.getBiddingSignHallDetailsUrl,
            params: { id, page: 1, size: 100000 }
        })
    }
    getBiddingApplyHallList(condition, page = 1, size = 20){
        return request({
            method: 'GET',
            url: URLs.getBiddingApplyHallListUrl,
            params: {
                ...condition, page, size
            }
        })
    }
    getBiddingApplyHallOfferList(condition){
        return request({
            method: 'GET',
            url: URLs.getBiddingApplyHallOfferListUrl,
            params: {
                ...condition
            }
        })
    }
    // 核价
    getBiddingPricingList(condition, page = 1, size = 20){
        return request({
            method: 'GET',
            url: URLs.getBiddingPricingListUrl,
            params: {
                ...condition, page, size
            } 
        })
    }
    getBiddingPricingDetail(id){
        return request({
            method: 'GET',
            url: URLs.getBiddingPricingDetailUrl,
            params: { id }
        })
    }
    postBiddingPricing(data){
        return request({
            method: 'POST',
            url: URLs.postBiddingPricingUrl,
            data
        })
    }
    putBiddingPricing(data){
        return request({
            method: 'PUT',
            url: URLs.putBiddingPricingUrl,
            data
        })
    }
    getApplicants(id){
        return request({
            method: 'GET',
            url: URLs.getApplicantsUrl,
            params: { id }
        })
    }

    // 中标
    getJournalingBidList(condition, page = 1, size = 20){
        return request({
            method: 'GET',
            url: URLs.getJournalingBidListUrl,
            params: {
                ...condition, page, size
            } 
        })
    }
    // 中标明细
    getJournalingBidDetails(condition, page, size){
        return request({
            method: 'GET',
            url: URLs.getJournalingBidDetailsUrl,
            params: { ...condition, page, size }
        })
    }

    // 报价单
    getHallList(condition, page = 1, size = 20){
        return request({
            method: 'GET',
            url: URLs.getHallListUrl,
            params: {
                ...condition, page, size
            }
        })
    }
    // 报价单明细
    getHallDetails(condition, page, size){
        return request({
            method: 'GET',
            url: URLs.getHallDetailsUrl,
            params: { ...condition, page, size }
        })
    }
    getBidDetail(id){
        return request({
            method: 'GET',
            url: URLs.getBidDetailUrl,
            params: { id }
        })
    }
    getHallDetail(id){
        return request({
            method: 'GET',
            url: URLs.getHallDetailUrl,
            params: { id }
        })
    }

}

export default ApiInstance;

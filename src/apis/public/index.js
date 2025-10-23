import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
  getTheme: resolveUrl('sys/actuator/getTheme'),
  getNoticeList: resolveUrl('basic-data/msg-announcement/find-announcement'),
  getNoticeDetail: resolveUrl('basic-data/msg-announcement/find-announcement-info'),
  getExternalDealNewsUrl: resolveUrl("basic-data/home-page/deal-and-news") ,
  getExternalPurchaseListUrl: resolveUrl("basic-data/home-page/bill-lists")
}

const getExternalPurchaseList = () => {
  return request({
    method: 'GET',
    url: URLs.getExternalPurchaseListUrl,
    extra: {
      auth: false
    }
  })
}
const getExternalDealNews = () => {
  return request({
    method: 'GET',
    url: URLs.getExternalDealNewsUrl,
    extra: {
      auth: false
    }
  })
}
const getTheme = () => {
  return request({
    method: 'GET',
    url: URLs.getTheme,
    extra: {
      auth: false
    }
  })
}
const getNoticeList = () => {
  return request({
    method: 'GET',
    url: URLs.getNoticeList,
    extra: {
      auth: false
    }
  })
}
const getNoticeDetail = (data) => {
  return request({
    method: 'GET',
    url: URLs.getNoticeDetail,
    extra: {
      auth: false
    },
    params: {
      ...data
    },
  })
}

export default {
  getTheme,
  getNoticeList,
  getNoticeDetail,
  getExternalDealNews,
  getExternalPurchaseList
}
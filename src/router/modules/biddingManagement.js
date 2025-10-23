/*
 * @Author: wmm
 * @Date: 2025-07-18 09:17:48
 * @LastEditors: wmm
 * @LastEditTime: 2025-07-20 09:42:21
 */
import Layout from '@/layout'

export default [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/tenderingApply',
                name: 'bidding_tenderingApply',
                component: () => import('@/pages-view/biddingManagement/tenderingApply/index.vue'),
                meta: { title: '招标项目申请' },
            },
        ]
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/tenderingApply-edit/:id?',
                name: 'bidding_tenderingApply_edit',
                component: () => import('@/pages-view/biddingManagement/tenderingApply-edit/index.vue'),
                meta: { title: '招标项目申请编辑', key: 'fullPath' },
            },
        ]
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/tenderingApply-detail/:id?',
                name: 'bidding_tenderingApply_detail',
                component: () => import('@/pages-view/biddingManagement/tenderingApply-detail/index.vue'),
                meta: { title: '招标项目申请详情', key: 'fullPath' },
            },
        ]
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/supplierApply',
                name: 'biddingManagement_supplierApply',
                component: () => import('@/pages-view/biddingManagement/supplierApply/index.vue'),
                meta: { title: '供应商报名', key: 'fullPath' },
            },
        ]
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/supplierApply-detail/:id?',
                name: 'biddingManagement_supplierApply_detail',
                component: () => import('@/pages-view/biddingManagement/supplierApply-detail/index.vue'),
                meta: { title: '供应商报名详情', key: 'fullPath' },
            },
        ]
    }, {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/myTender',
                name: 'biddingManagement_myTender',
                component: () => import('@/pages-view/biddingManagement/myTender/index.vue'),
                meta: { title: '我的投标', key: 'fullPath' },
            },
        ]
    },{
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement_myTender_detail/:id?',
                name: 'biddingManagement_myTender_detail',
                component: () => import('@/pages-view/biddingManagement/myTender-detail/index.vue'),
                meta: { title: '我的投标详情', key: 'fullPath' },
            },
        ]
    },{
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/bidReview',
                name: 'biddingManagement_bidReview',
                component: () => import('@/pages-view/biddingManagement/bidReview/index.vue'),
                meta: { title: '标书评审', key: 'fullPath' },
            },
        ]
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/bidReview-detail/:id?',
                name: 'biddingManagement_bidReview_detail',
                component: () => import('@/pages-view/biddingManagement/bidReview-detail/index.vue'),
                meta: { title: '标书评审详情', key: 'fullPath' },
            },
        ]
    },{
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/bidResultAdit',
                name: 'biddingManagement_bidResultAdit',
                component: () => import('@/pages-view/biddingManagement/bidResultAdit/index.vue'),
                meta: { title: '定标审核', key: 'fullPath' },
            },
        ]
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '/biddingManagement/bidResultAdit-detail/:id?',
                name: 'biddingManagement_bidResultAdit_detail',
                component: () => import('@/pages-view/biddingManagement/bidResultAdit-detail/index.vue'),
                meta: { title: '定标审核详情', key: 'fullPath' },
            },
        ]
    }
]

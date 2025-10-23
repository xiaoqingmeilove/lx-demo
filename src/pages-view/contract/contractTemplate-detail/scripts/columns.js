const columns = [
    {
        title: "商品状态",
        field: "status",
        align: "left",
        width: 100,
        slots: {
            default: 'status'
        }
    },
    {
        title: "商品类型",
        field: "productType",
        align: "left",
        width: 150,
    },
    {
        title: "采购商品",
        field: "materialName",
        align: "left",
        width: 120,
    },
    {
        title: "物料编码",
        field: "materialCode",
        align: "left",
        width: 150,
    },
    {
        title: "型号",
        field: "model",
        align: "left",
        width: 150,
    },
    {
        title: "规格",
        field: "standard",
        align: "left",
        width: 120,
    },
    {
        title: "电压",
        field: "voltageLevel",
        align: "left",
        width: 150,
    },
    {
        title: "属性",
        field: "attribute",
        align: "left",
        width: 150,
    },
    {
        title: "采购最小量",
        field: "qty",
        align: "right",
        width: 120,
    },
    {
        title: "单位",
        field: "unit",
        align: "left",
        width: 150,
    },
    {
        title: "预计单价",
        field: "price",
        align: "left",
        width: 150,
        params: {
            displayDigits: 4,
        },
        slots: { 
            default: "slot_edit_number",
        }
    },
    {
        title: "税率(%)",
        field: "taxRate",
        align: "right",
        width: 120,
        params: {
            percent: true,
        },
        slots: { 
            default: "slot_edit_number",
        }
    },
    {
        title: "是否集中收货",
        field: "batchGoodsFlag",
        align: "left",
        width: 130,
        slots: {
            default: "flagSlots",
        }
    },
    {
        title: "是否集中付款",
        field: "batchPaymentFlag",
        align: "left",
        width: 130,
        slots: {
            default: "flagSlots",
        }
    },
    {
        title: "图片",
        field: "listUrl",
        align: "left",
        width: 150,
        // slots: {
        //     default: "fileList",
        // }
    },
    {
        title: "收货地址",
        field: "areaCodeListName",
        align: "left",
        width: 150,
    },
    {
        title: "收货人",
        field: "receiving",
        align: "left",
        width: 150,
    },
    {
        title: "收货电话",
        field: "receivingPhone",
        align: "left",
        width: 150,
    },
    {
        title: "商城上架",
        field: "groundingFlag",
        align: "left",
        width: 100,
        "slots": { "default": "groundingFlag" }
    },
    {
        title: "商品描述",
        field: "materialRemark",
        align: "left",
        width: 120,
    },
];

const columns1 = [
    {
        title: "账户名称",
        field: "paymentName",
        align: "left",
        minWidth: 150,
    },
    {
        title: "开户行",
        field: "paymentDepositBank",
        align: "left",
        minWidth: 150,
    },
    {
        title: "账号",
        field: "paymentDepositAccount",
        align: "left",
        minWidth: 150,
    },
    {
        title: "电话",
        field: "paymentTel",
        align: "left",
        minWidth: 150,
    },
    {
        title: "地址",
        field: "areaCodeListName",
        align: "left",
        minWidth: 150,
    },
    {
        title: "详细地址",
        field: "deliveryAddress",
        align: "left",
        minWidth: 150,
    },
    {
        title: "操作",
        field: "action",
        align: "left",
        width: 120,
        slots: {
            default: "action",
        }
    },
]

const columns2 = [
    {
        title: "证书名称",
        field: "certificateName",
        align: "left",
        width: 230,
        minWidth: 130,
    },
    {
        title: "证书类型",
        field: "certificateTypeName",
        align: "left",
        width: 230,
        minWidth: 130,
    },
    {
        title: "附件",
        field: "fileList",
        align: "left",
        minWidth: 150,
        slots: {
            default: "fileList",
        }
    },
    {
        title: "到期时间",
        field: "expireDate",
        align: "left",
        width: 190,
    },
    {
        title: "操作",
        field: "action",
        align: "left",
        width: 120,
        slots: {
            default: "action",
        }
    },
    // {
    //     title: "提交人",
    //     field: "standard",
    //     align: "left",
    //     minWidth: 150,
    // },
    // {
    //     title: "提交时间",
    //     field: "standard",
    //     align: "left",
    //     width: 170,
    // },
    // {
    //     title: "更新时间",
    //     field: "standard",
    //     align: "left",
    //     width: 170,
    // },
]
export {
    columns, columns1, columns2
}

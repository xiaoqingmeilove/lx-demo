const columns = [
    {
        title: "需求池流水号",
        field: "businessBillNo",
        align: "left",
        width: 170,
    },
    {
        title: "采购商品",
        field: "materialName",
        align: "left",
        width: 150,
    },
    {
        title: "物料类型",
        field: "materialTypeName",
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
        title: "单位",
        field: "unit",
        align: "left",
        width: 150,
    },
    {
        title: "申请数量",
        field: "qty",
        align: "right",
        width: 120,
    },
    
    {
        title: "预算单价(不含税)",
        field: "untaxPrice",
        align: "right",
        width: 150,
    },
    {
        title: "税率(%)",
        field: "taxRate",
        align: "right",
        width: 120,
        params: {
            displayDigits: 2,
        },
    },
    {
        title: "预算单价(含税)",
        field: "price",
        align: "right",
        width: 150,
        params: {
            displayDigits: 4,
        },
    },
    {
        title: "预算金额(不含税)",
        field: "untaxAmount",
        align: "right",
        width: 150,
        params: {
            displayDigits: 4,
            addFooter: true
        },
    },
    {
        title: "预算金额(含税)",
        field: "amount",
        align: "right",
        width: 150,
        params: {
            displayDigits: 4,
            addFooter: true
        },
    },
    {
        title: "最晚到货时间",
        field: "latestArrivalDate",
        align: "left",
        width: 170,
    },
    {
        title: "收货区域",
        field: "areaCodeListName",
        align: "left",
        width: 150,
    },
    {
        title: "收货地址",
        field: "deliveryAddress",
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
];
const columns1 = [
    {
        title: "序号",
        field: "rowNum",
        align: "left",
        width: 100,
        slots: {
            default: 'rowNum'
        }
    },
    {
        title: "报价单号",
        field: "billNo",
        align: "left",
        width: 190,
    },
    {
        title: "供应商名称",
        field: "businessLicense",
        align: "left",
        minWidth: 130,
    },
    {
        title: "出价时间",
        field: "offerTime",
        align: "left",
        minWidth: 130,
    },
    {
        title: "出价金额",
        field: "amount",
        align: "right",
        minWidth: 130,
        params: {
            displayDigits: 2,
        },
        slots: {
            default: 'amount'
        }
    },
    {
        title: "操作",
        field: 'action',
        align: 'left',
        width: 150,
        slots: {
            default: 'action'
        }
    }
]

const columns2 = [
    {
        title: "需求池流水号",
        field: "businessBillNo",
        align: "left",
        width: 170,
    },
    {
        title: "采购商品",
        field: "materialName",
        align: "left",
        width: 150,
    },
    {
        title: "物料类型",
        field: "materialTypeName",
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
        title: "单位",
        field: "unit",
        align: "left",
        width: 150,
    },
    {
        title: "申请数量",
        field: "fromQty",
        align: "right",
        width: 120,
    },
    {
        title: "最晚到货时间",
        field: "latestArrivalDate",
        align: "left",
        width: 150,
    },
    {
        title: "收货区域",
        field: "areaCodeListName",
        align: "left",
        width: 150,
    },
    {
        title: "收货地址",
        field: "deliveryAddress",
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
        title: "可供货数量",
        field: "qty",
        align: "right",
        width: 150,
        params: {
            displayDigits: 2,
        },
        slots: {
            default: 'slot_edit_number'
        }
    },
    {
        title: "报价单价(含税)",
        field: "price",
        align: "right",
        width: 150,
        params: {
            displayDigits: 4,
        },
        slots: {
            default: 'slot_edit_number'
        }
    },
    {
        title: "税率(%)",
        field: "taxRate",
        align: "right",
        width: 120,
        params: {
            displayDigits: 2,
        },
        slots: {
            default: 'slot_edit_number'
        }
    },
    {
        title: "报价单价(不含税)",
        field: "untaxPrice",
        align: "right",
        width: 150,
        params: {
            displayDigits: 4,
        },
    },
    {
        title: "报价金额(含税)",
        field: "amount",
        align: "right",
        width: 150,
        params: {
            displayDigits: 2,
        },
    },
    {
        title: "报价金额(不含税)",
        field: "untaxAmount",
        align: "right",
        width: 150,
        params: {
            displayDigits: 2,
        },
    },
];
export {
    columns, columns1, columns2
}
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
        slots: { 
            default: "slot_edit_number",
        }
    },
    
    {
        title: "预算单价(不含税)",
        field: "untaxPrice",
        align: "right",
        width: 150,
        params: {
            displayDigits: 4,
        },
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
            default: "slot_edit_number",
        }
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
        slots: { 
            default: "slot_edit_date",
        }
    },
    {
        title: "收货区域",
        field: "areaCodeList",
        align: "left",
        width: 310,
        slots: { 
            default: "slot_areaCodeList",
        }
    },
    {
        title: "收货地址",
        field: "deliveryAddress",
        align: "left",
        width: 150,
        slots: { 
            default: "slot_edit_input",
        }
    },
    {
        title: "收货人",
        field: "receiving",
        align: "left",
        width: 150,
        slots: { 
            default: "slot_edit_input",
        }
    },
    {
        title: "收货电话",
        field: "receivingPhone",
        align: "left",
        width: 150,
        slots: { 
            default: "slot_edit_input",
        }
    },
];

export {
    columns
}
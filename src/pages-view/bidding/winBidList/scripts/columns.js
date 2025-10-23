const columns = [
    {
        field: 'll',
        title: '流水号',
        width: 170,
        minWidth: 100, 
        align: 'left',
        visible: false
    },
    {
        field: 'createUserName',
        title: '申请人',
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'createTime',
        title: '单据时间', 
        width: 170,
        minWidth: 100,
        align: 'left',
    },
    {
        field: 'submissionTime',
        title: '提交时间', 
        width: 170,
        minWidth: 100,
        align: 'left',
    },
    {
        field: 'auditDate',
        title: '审核时间',
        width: 170, 
        align: 'left',
    },
    {
        field: 'auditorName',
        title: '审核人', 
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'projectName',
        title: '竞价项目名称',
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'billNo',
        title: '竞价核价单号',
        width: 170,
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'offerBillNo',
        title: '竞价单编号',
        width: 170,
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'offerBillNo',
        title: '报价单号',
        width: 170,
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'businessLicense',
        title: '供应商名称',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'supplierBillNo',
        title: '供应商编码',
        width: 170,
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'materialName',
        title: '物品名称',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'model',
        title: '型号',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'standard',
        title: '规格',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'voltageLevel',
        title: '电压',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'attribute',
        title: '属性',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'applyQty',
        title: '需求数量',
        minWidth: 120,
        align: 'right',
    }, 
    {
        field: 'fromQty',
        title: '可供货数量',
        minWidth: 120,
        align: 'right',
    }, 
    {
        field: 'qty',
        title: '中标数量',
        minWidth: 120,
        align: 'right',
    }, 
    {
        field: 'fromPrice',
        title: '报价单价(含税)',
        minWidth: 150,
        align: 'right',
        params: {
            displayDigits: 4
        }
    }, 
    {
        field: 'price',
        title: '中标单价',
        minWidth: 150,
        align: 'right',
        params: {
            displayDigits: 4
        }
    }, 
    {
        field: 'taxRate',
        title: '税率(%)',
        minWidth: 120,
        align: 'right',
    }, 
    {
        field: 'untaxAmount',
        title: '不含税金额',
        minWidth: 120,
        align: 'right',
        params: {
            displayDigits: 4
        }
    },
    {
        field: 'amount',
        title: '含税金额',
        minWidth: 120,
        align: 'right',
        params: {
            displayDigits: 4
        }
    },  
    {
        field: 'areaCodeListName',
        title: '收货区域',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'deliveryAddress',
        title: '收货地址',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'receiving',
        title: '收货人',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'receivingPhone',
        title: '收货电话',
        width: 150,
        minWidth: 120,
        align: 'left',
    }, 
]; 


export {
    columns,
}

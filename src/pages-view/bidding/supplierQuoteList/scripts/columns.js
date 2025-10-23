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
        field: 'auditorName',
        title: '审核人', 
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'auditDate',
        title: '审核时间',
        width: 170, 
        align: 'left',
    },
    {
        field: 'projectBillNo',
        title: '竞价单号',
        width: 170,
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'billNo',
        title: '报价单号',
        width: 170,
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'detailNo',
        title: '需求池单号',
        width: 170,
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'supplierBillNo',
        title: '供应商编码',
        width: 170,
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
        field: 'businessLicense',
        title: '供应商名称',
        minWidth: 120,
        align: 'left',
    }, 
    {
        field: 'aaa',
        title: '采购申请订单号',
        width: 170,
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'pricingDeadlineTime',
        title: '报价截止时间',
        width: 170,
        minWidth: 120, 
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
        field: "fromQty",
        title: "需求数量",
        minWidth: 120,
        align: 'right',
    },
    {
        field: 'qty',
        title: '可供货数量',
        minWidth: 120, 
        align: 'right',
    },
    {
        field: 'untaxAmount',
        title: '报价单价(不含税)',
        width: 150, 
        align: 'right',
        params: {
            displayDigits: 4
        }
    },
    {
        field: 'taxRate',
        title: '税率',
        minWidth: 120, 
        align: 'right',
    },
    {
        field: 'bbb',
        title: '报价唯一辅助字段',
        minWidth: 170, 
        align: 'left',
    },
    {
        field: 'ccc',
        title: '采购申请编号',
        width: 170,
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'multipleBidsFlag',
        title: '本次报价轮次',
        width: 150, 
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'cc',
        title: '参与报价',
        minWidth: 120, 
        align: 'left',
    },
]; 


export {
    columns,
}

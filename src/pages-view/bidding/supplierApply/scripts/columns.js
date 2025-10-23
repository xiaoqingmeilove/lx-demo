const columns = [
    {
        field: 'offerBillNo',
        title: '报价单号',
        width: 170,
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'createUserName',
        title: '申请人',
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'offerTime',
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
        field: 'createUserName',
        title: '报价人', 
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'offerTime',
        title: '报价时间',
        width: 170, 
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
        field: 'businessLicense',
        title: '供应商名称',
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'billNo',
        title: '竞价单号',
        width: 170,
        minWidth: 120, 
        align: 'left',
    },
    {
        field: "projectName",
        title: "竞价项目名称",
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'beginTime',
        title: '竞价开始时间',
        width: 170,
        minWidth: 130, 
        align: 'left',
    },
    {
        field: 'endTime',
        title: '竞价截止时间',
        width: 170,
        width: 130, 
        align: 'left',
    },
    {
        field: 'quoteStatusName',
        title: '参与报价',
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'quoteDescription',
        title: '报价说明',
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'untaxAmount',
        title: '不含税总价',
        minWidth: 120, 
        align: 'right',
        params: {
            displayDigits: 2
        }
    },
    {
        field: 'taxRate',
        title: '税额',
        width: 120, 
        align: 'right',
        params: {
            displayDigits: 2
        }
    },
    {
        field: 'amount',
        title: '含税总金额',
        minWidth: 130, 
        align: 'right',
        params: {
            displayDigits: 2
        }
    },
    {
        field: 'amountName',
        title: '金额大写',
        minWidth: 130, 
        align: 'left',
    },
]; 


export {
    columns,
}

const columns = [
    // {
    //     field: 'rowNum',
    //     width: 80,
    //     minWidth: 80,
    //     align: 'left',
    //     type: 'checkbox',
    // },
    {
        field: 'billNo',
        title: '流水号', 
        width: 190,
        minWidth: 100,
        align: 'left',
        slots: {
            default: 'billNo'
        }
    },
    {
        field: 'createUserName',
        title: '申请人',
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'createTime',
        title: '创建时间', 
        width: 170,
        align: 'left',
    },
    {
        field: 'updateTime',
        title: '更新时间', 
        width: 170, 
        align: 'left',
    },
    {
        field: 'supplierBillNo',
        title: '供应商编码', 
        width: 130,
        align: 'left',
    },
    {
        field: 'businessLicense',
        title: '供应商名称',
        width: 130, 
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'certificateName',
        title: '证书名称',
        width: 130, 
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'certificateTypeName',
        title: '证书类别',
        width: 130, 
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'expireDate',
        title: '到期时间',
        width: 170, 
        align: 'left',
    },
    {
        field: 'listUrl',
        title: '附件',
        width: 170, 
        align: 'left',
    },
]; 


export {
    columns,
}

const columns = [
    {
        field: 'versionNumber',
        title: '版本单号',
        minWidth: 100,
        resizable: false,
        fixed: 'left',
        align: 'left',
        treeNode:true,
    },
    {
        field: 'releaseType',
        title: '发布类型',
        minWidth: 100, 
        align: 'left', 
        sortable: true,
    },
    
    // {
    //     field: 'purchaseCompany',
    //     title: '版本升级状态', 
    //     width: 200, 
    //     minWidth: 70, 
    //     align: 'left',
    //     sortable: true,
    // },
    // {
    //     field: 'areaCodeListName',
    //     title: '最近修改时间', 
    //     width: 150, 
    //     minWidth: 70, 
         
    //     align: 'left',
    //     sortable: true, 
    // },
    // {
    //     field: 'submissionTime',
    //     title: '最近修改人员', 
    //     width: 170, 
    //     minWidth: 70, 
    //     align: 'center', 
    //     sortable: true,
    // },
    {
        field: 'createUserName',
        title: '版本升级人员', 
        width: 190, 
        minWidth: 70, 
        align: 'left', 
        sortable: true,
    },
    {
        field: 'releaseDate',
        title: '发布日期', 
        width: 190, 
        minWidth: 70,
        align: 'center',
        sortable: true,
    },
    {
        field: 'createTime',
        title: '版本创建时间', 
        width: 190, 
        minWidth: 70, 
        align: 'center', 
        sortable: true,
    },
    {
        field: 'updateTime',
        title: '版本更新日期', 
        width: 190, 
        minWidth: 70, 
        align: 'center', 
        sortable: true,
    },
]

export {
    columns, 
}

 



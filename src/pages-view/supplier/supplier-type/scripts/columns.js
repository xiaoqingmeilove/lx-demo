const columns = [
    {
        field: 'rowNum',
        width: 80,
        minWidth: 80,
        align: 'left',
        type: 'checkbox',
    },
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
        field: 'businessName',
        title: '类型名称',
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'imgTime',
        title: '提交人',
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'imgTime',
        title: '提交时间',
        width: 170, 
        align: 'left',
    },
    {
        field: 'imgTime',
        title: '更新时间',
        width: 170, 
        align: 'left',
    },
]; 


export {
    columns,
}

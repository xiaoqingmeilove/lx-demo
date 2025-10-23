const columns = [
    {
        field: 'signUpBillNo',
        title: '报价编号',
        width: 170,
        minWidth: 100, 
        align: 'left',
        visible: false
    },
    {
        field: 'projectBillNo',
        title: '竞价项目编号',
        minWidth: 130,
        align: 'left',
        visible: false
    },
    {
        field: 'projectName',
        title: '竞价项目名称',
        minWidth: 150,
        align: 'left',
        visible: false
    },
    {
        field: 'supplierBillNo',
        title: '供应商编号', 
        width: 170,
        minWidth: 100,
        align: 'left',
        visible: false
    },
    {
        field: 'businessLicense',
        title: '供应商名称',
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'ranking',
        title: '当前排名', 
        width: 120,
        align: 'left',
    },
    {
        field: 'amount',
        title: '报价总价(含税)',
        width: 150,
        align: 'right',
        params: {
            displayDigits: 4
        }
    },
    {
        field: 'offerTime',
        title: '报价时间', 
        width: 170,
        minWidth: 100,
        align: 'left',
    },
]; 

const columns1 = [
    {
        field: 'projectBillNo',
        title: '竞价项目编号',
        width: 170,
        minWidth: 100, 
        align: 'left',
    },
    {
        field: 'projectName',
        title: '项目名称',
        minWidth: 130,
        align: 'left',
    },
    {
        field: 'biddingDirectionName',
        title: '竞价方向',
        minWidth: 130,
        align: 'left',
    },
    {
        field: 'signUpDeadlineTime',
        title: '报名截止时间', 
        width: 170,
        minWidth: 100,
        align: 'left',
    },
    {
        field: 'beginTime',
        title: '竞价开始时间',
        width: 170,
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'endTime',
        title: '竞价截止时间', 
        minWidth: 120,
        align: 'left',
    },
    {
        field: 'inquiryUserName',
        title: '询价员',
        minWidth: 150,
        align: 'left',
    },
    {
        field: 'supplierNum',
        title: '参与供应商数量',
        minWidth: 150,
        align: 'right',
    },
    {
        field: 'action',
        title: '操作',
        width: 100,
        align: 'left',
        slots: {
            default: 'action'
        }
    },
]; 

export {
    columns, columns1
}

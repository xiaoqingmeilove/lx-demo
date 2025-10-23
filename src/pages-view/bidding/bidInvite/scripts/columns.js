const columns = [
    // {
    //     field: 'rowNum',
    //     width: 80,
    //     minWidth: 80,
    //     align: 'left',
    //     type: 'checkbox',
    // },
    {
        field: 'billState',
        title: '单据状态',
        minWidth: 100,
        align: 'left',
        slots: {
            default: 'billState'
        }
    },
    {
        field: 'billNo',
        title: '竞价单号',
        width: 150,
        minWidth: 100, 
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
        field: 'createUserName',
        title: '申请人',
        minWidth: 120,
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
        field: 'projectStatus',
        title: '项目状态',
        minWidth: 120,
        align: 'left',
        slots: {
            default: 'projectStatus'
        }
    },
    {
        field: 'projectBillNo',
        title: '竞价项目编号',
        minWidth: 120, 
        align: 'left',
    },
    {
        field: "applyTime",
        title: "竞价申请日期",
        width: 170,
        align: 'left',
    },
    {
        field: 'describeRemark',
        title: '竞价申请说明',
        minWidth: 130, 
        align: 'left',
    },
    {
        field: 'biddingDirectionName',
        title: '竞价方向',
        width: 130, 
        align: 'left',
    },
    {
        field: 'inquiryUserName',
        title: '询价员',
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'linkerTel',
        title: '联系电话',
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'linkerEmail',
        title: '联系邮箱',
        minWidth: 120, 
        align: 'left',
    },
    {
        field: 'signUpDeadlineTime',
        title: '报名截止时间',
        width: 170, 
        align: 'left',
    },
    {
        field: 'beginTime',
        title: '竞价开始时间',
        minWidth: 170, 
        align: 'left',
    },
    {
        field: 'endTime',
        title: '竞价结束时间',
        minWidth: 170, 
        align: 'left',
    },
    {
        field: 'pricingDeadlineTime',
        title: '核价截止时间',
        width: 170, 
        align: 'left',
    },{
        field: 'promulgateTime',
        title: '中标公示时间',
        width: 170, 
        align: 'left',
    },
    {
        field: 'reviewFlag',
        title: '是否需要资格预审',
        minWidth: 150, 
        align: 'left',
        slots: {
            default: 'slot_Flag'
        }
    },
    {
        field: 'supplierNum',
        title: '参与招投标供应商总数',
        minWidth: 180, 
        align: 'left',
    },
]; 


export {
    columns,
}

const columns = [
    { field: 'billNo', title: '单据号', width: 160, minWidth: 40, fixed: 'left', ellipsis: true, align: 'left' },
    { field: "problemType", title: "问题类型", width: 180, minWidth: 70, align: "center", ellipsis: true , slots: { default: 'problemType' } },
    { field: 'priority', title: '优先级', width: 120, minWidth: 70, align: "center", ellipsis: true , slots: { default: 'priority' } },
    { field: 'serviceTitle', title: '服务标题', width: 180, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'customerName', title: '客户名称', width: 180, minWidth: 70, align: "left", ellipsis: true  },
    { field: 'sourceProjectName', title: '项目名称', width: 180, minWidth: 70, align: "left", ellipsis: true  },
    { field: 'areaCodeListName', title: '所在区域', width: 230, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'acceptTime', title: '受理时间', width: 250, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'billState', title: '单据状态', width: 120, minWidth: 70, align: "center", ellipsis: true , slots: { default: "billState"} },
    { field: 'serviceContent', title: '处理过程及结果', width: 180, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'problemDescription', title: '缺陷描述', width: 120, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'liableDept', title: '责任方', width: 120, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'processingMethod', title: '处理方式', width: 120, minWidth: 70, align: "center", ellipsis: true , slots: { default: "processingMethod"} },
    { field: 'salesName', title: '处理人', width: 120, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'lossFee', title: '损失金额', width: 120, minWidth: 70, align: "center", ellipsis: true  },
    { field: 'lossLevel', title: '损失等级', width: 120, minWidth: 70, align: "center", ellipsis: true , slots: { default: "lossLevel"} }
];

export {
    columns,  
}

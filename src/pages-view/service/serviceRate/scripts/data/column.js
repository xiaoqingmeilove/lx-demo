
const columns1 = [
    { title:'报价单号', field:'billNo', width:150, minWidth:70, resizable:false, align:'left', headerAlign:"center", sortable: true },
    { title:'报价类型', field:'quotedTypeName', width:100, minWidth:70, align:'center', headerAlign:"center", sortable: true },
    { title:'客户名称', field:'customerName', minWidth:150, align:'center' , headerAlign:"center", sortable: true },
    { title:'项目名称', field:'projectName', minWidth:150, align:'center',  headerAlign:"center", sortable: true  },
    { title:'订单申请时间', field:'submissionTime', width:160, minWidth:70, align:'center', headerAlign:"center", sortable: true },
    { title:'审核通过时间', field:'auditDate', width:160, minWidth:70, align:'center' , headerAlign:"center", sortable: true },
    { title:'经销商', field:'userName', width:100, minWidth:70, align:'center', headerAlign:"center", sortable: true },
    { title:'订单评价时间', field:'time', width:160,minWidth:90, align:'center' , headerAlign:"center", sortable: true },
    { title:'评价分数', field:'score',width:100, minWidth:150, align:'center', headerAlign:"center", sortable: true  },
    { title:'操作', width:100, minWidth:100, align:'center', headerAlign:"center", slots: { default:'action' } },
]

const columns2 = [
    { title:'评价人员', field:'userName', minWidth:70, resizable:false, align:'center', headerAlign:"center", sortable: true },
    { title:'评价总件数', field:'num', minWidth:70, resizable:false, align:'center', headerAlign:"center", sortable: true },
    { title:'评价总分', field:'score', minWidth:70, resizable:false, align:'center', headerAlign:"center", sortable: true },
    { title:'评价平均分', field:'avgScore', minWidth:70, resizable:false, align:'center', headerAlign:"center", sortable: true },
]
 
export {
    columns1, 
    columns2, 
}

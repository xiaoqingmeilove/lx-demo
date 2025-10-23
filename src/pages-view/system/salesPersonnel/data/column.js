
const columns = [
  {
    field: 'rowNum',
    title: "序号",
    width: 80,
    align: 'center',
    resizable: false,
    slots: {
      default: "rowNum",
    },
  },
  {
    title: '业务员姓名',
    field: 'name',
    headerAlign: 'center',
    align: 'left',
    width:  100,
    minWidth: 100,
  },
  {
    title: '业务员编码',
    field: 'code',
    headerAlign: 'center',
    align: 'left',
    width:  100,
    minWidth: 100,
  },
  {
    title: '用户名',
    field: 'userName',
    headerAlign: 'center',
    align: 'left',
    width:  100,
    minWidth: 100,
  },
  {
    title: '手机号',
    field: 'phone',
    headerAlign: 'center',
    align: 'left',
    width: 130,
    minWidth: 100,
  },
  {
    title: '身份证',
    field: 'identity',
    headerAlign: 'center',
    align: 'left',
    width: 230,
    minWidth: 160,
  },
  {
    title: '个人基价任务量',
    field: 'personalBasePriceTaskLoad',
    headerAlign: 'center',
    align: 'left',
    width: 230,
    minWidth: 160,
  },
  {
    title: '微信号',
    field: 'webchatNo',
    headerAlign: 'center',
    align: 'left',
    width: 130,
    minWidth: 130,
  },
  {
    title: '邮箱',
    field: 'email',
    headerAlign: 'center',
    align: 'left',
    width: 150,
    minWidth: 100,
  },
  {
    title: '性别',
    field: 'sex',
    headerAlign: 'center',
    align: 'center',
    minWidth: 80,
    slots: {default: 'sex'}
  },
  {
    title: '类型',
    field: 'type',
    headerAlign: 'center',
    align: 'center',
    minWidth: 80,
    slots: {default: 'type'}
  },
  {
    title: '区域经理',
    field: 'managerAdmin',
    headerAlign: 'center',
    align: 'center',
    minWidth: 120,
    slots: { default: 'managerAdmin' }
  },
  {
    title: '启用状态',
    field: 'status',
    headerAlign: 'center',
    align: 'center',
    minWidth: 100,
    slots: { default: 'status' }
  },
  {
    title: '操作',
    field: 'action',
    headerAlign: 'center',
    align: 'center',
    minWidth: 210,
    fixed: 'right',
    slots: { default: 'action' }
  },
];


export {
  columns,
}

const beckonColumns = [
  {
    field: "billNo",
    title: "竞价编号",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "projectName",
    title: "项目名称",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "beginTime",
    title: "报名开始时间",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "endTime",
    title: "报名结束时间",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "cs",
    title: "参数",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "cz",
    title: "操作",
    minWidth: 100,
    align: "left",
    sortable: true,
    slots: {
      default: "cz",
    },
  },
];
const bidColumns = [
  {
    field: "billNo",
    title: "竞价编号",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "projectName",
    title: "项目名称",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "beginTime",
    title: "竞价开始时间",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "endTime",
    title: "竞价结束时间",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "supplierNum",
    title: "参数",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "cz",
    title: "操作",
    minWidth: 100,
    align: "left",
    sortable: true,
    slots: {
      default: "cz",
    },
  },
];
const seekColumns =  [
  {
    field: "billNo",
    title: "竞价编号",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "projectName",
    title: "项目名称",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "beginTime",
    title: "招标开始时间",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "endTime",
    title: "招标结束时间",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "supplierNum",
    title: "参数",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  {
    field: "cz",
    title: "操作",
    minWidth: 100,
    align: "left",
    sortable: true,
    slots: {
      default: "cz",
    },
  },
];



export { beckonColumns ,bidColumns,seekColumns};




const columns = [
  {
    field: "menuId",
    title: "菜单id",
    minWidth: 70,
    resizable: false,
    fixed: "left",
    align: "left",
    sortable: true,
  },
  {
    field: "menuName",
    title: "菜单名称",
    minWidth: 70,
    align: "left",
    sortable: true,
    filters: [],
    filterEnabled: true,
  },
  {
    field: "name",
    title: "名称",
    minWidth: 70,
    align: "left",
    sortable: true,
    filters: [],
    filterEnabled: true,
  },
  {
    field: "corpCode",
    title: "企业代码",
    minWidth: 70,
    align: "left",
    sortable: true,
    filters: [
      {
        label: "美和",
        value: "MHXL",
      },
      {
        label: "固达",
        value: "GDDL",
      },
      {
        label: "中联",
        value: "ZLDL",
      },
      {
        label: "缆新",
        value: "LX",
      },
    ],
  },
  {
    field: "configType",
    title: "配置类型",
    minWidth: 70,
    align: "left",
    sortable: true,
  },
  {
    field: "columns",
    title: "列属性明细",
    minWidth: 70,
    align: "left",
    sortable: true,
  },
  {
    field: "code",
    title: "菜单code",
    minWidth: 70,
    align: "left",
    sortable: true,
    filters: [],
    filterEnabled: true,
  },
  {
    field: "cz",
    title: "操作",
    width: 160,
    minWidth: 70,
    align: "center",
    sortable: true,
    slots: { default: "cz" },
  },
];

const corpCodeList = [
  // {
  //   label: "美和",
  //   value: "MHXL",
  // },
  // {
  //   label: "固达",
  //   value: "GDDL",
  // },
  // {
  //   label: "中联",
  //   value: "ZLDL",
  // },
  // {
  //   label: "太阳",
  //   value: "TYDL",
  // },
  // {
  //   label: "龙岩",
  //   value: "LYTY",
  // },
  {
    label: "缆新",
    value: "LX",
  },
];
const nameList = [
  {
    label: "一览表",
    value: "一览表",
  },
  {
    label: "详情表",
    value: "详情表",
  },
];

const codeList = [
  {
    label: "list",
    value: "list",
  },
  {
    label: "detailList",
    value: "detailList",
  },
  {
    label: "detailForm",
    value: "detailForm",
  },
  {
    label: "timeOutList",
    value: "timeOutList",
  },
];
const configTypeList = [
  {
    label: "table",
    value: "table",
  },
  {
    label: "form",
    value: "form",
  },
  {
    label: "search",
    value: "search",
  },
];

export { columns, nameList, codeList, corpCodeList ,configTypeList};

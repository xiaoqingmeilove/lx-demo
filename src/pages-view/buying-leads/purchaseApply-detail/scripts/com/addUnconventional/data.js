const descItems = [
  {"label":"物料代码","field":"materialCode","type":"input","width":"100%","required":true},
  {"label":"物料名称","field":"materialName","type":"input","width":"100%","required":true},
  {"label":"物料分类","field":"materialTypeId","type":"","width":"100%","source":"materialTypeList","required":true,"slot":"select_tree"},
  {"label":"型号","field":"model","required":true,"type":"input","width":"100%"},
  {"label":"规格","field":"standard","required":true,"type":"input","width":"100%"},
  {"label":"电压","field":"voltageLevel","required":true,"type":"input","width":"100%"},
  {"label":"属性","field":"attribute","required":true,"type":"input","width":"100%"},
  {"label":"单位","field":"unit","required":true,"type":"select","source":"unitList","width":"100%"},
  {"label":"参考单价(含税)","field":"price","type":"number","width":"100%", "digits": 2, "precision": 2, "formatterName": "toFixedNumber"},
  {"label":"申请数量","field":"qty","type":"number","width":"100%", "digits": 2, "precision": 2, "formatterName": "toFixedNumber"},
  {"label":"需求日期","field":"latestArrivalDate","type":"date","width":"100%"},
  {"label":"备注","field":"remark","type":"textarea","width":"100%"}
]

const priceColumns = [
  {
    title: "选择",
    type: "radio",
    width: 80,
    headerAlign: "center",
    align: "center",
    resizable: false,
  },
  {
    field: "materialCode",
    title: "物料代码",
    align: "left",
    minWidth: 70, 
  },
  {
    field: "materialName",
    title: "物料名称",
    width: 100,
    minWidth: 70, 
    align: "left",
  },
  {
    field: "materialTypeName",
    title: "物料分类",
    width: 100,
    minWidth: 70, 
    align: "left",
  },
  {
    field: "model",
    title: "型号",
    align: "left",
    minWidth: 70, 
  },
  {
    field: "standard",
    title: "规格",
    width: 100,
    minWidth: 70, 
    align: "left",
  },
  {
    field: "voltageLevel",
    title: "电压",
    width: 100,
    minWidth: 70, 
    align: "left",
  },
  {
    field: "attribute",
    title: "属性",
    width: 100,
    minWidth: 70, 
    align: "left",
  },
  {
    field: "unit",
    title: "单位",
    width: 100,
    minWidth: 70, 
    align: "left",
  },
  {
    field: "planPrice",
    title: "计划单价",
    width: 100,
    minWidth: 70, 
    align: "right",
    params: {
      displayDigits: 2,
    }
  },
];

export { descItems, priceColumns };

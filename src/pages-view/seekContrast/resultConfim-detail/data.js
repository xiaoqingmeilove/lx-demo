const summaryColumns = [
  {
    field: "fromBillNo",
    title: "需求池流水号",
    width: 180,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "materialName",
    title: "采购商品",
    width: 150,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "materialTypeName",
    title: "物料类型",
    width: 150,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "materialCode",
    title: "物料编码",
    width: 150,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "model",
    title: "型号",
    width: 150,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "standard",
    title: "规格",
    width: 130,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "voltageLevel",
    title: "电压",
    width: 130,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "attribute",
    title: "属性",
    width: 130,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "unit",
    title: "单位",
    width: 130,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "fromQty",
    title: "申请数量",
    width: 150,
    minWidth: 70,
   
    align: "right",
    sortable: true,
    visible: true,
    params: {
      merges: true,
    },
  },
  {
    field: "supplierName",
    title: "供应商名称",
    width: 150,
    minWidth: 70,
   
    align: "left",
    sortable: true,
    visible: true,
  },
  {
    field: "quoteQty",
    title: "可供货数量",
    width: 150,
    minWidth: 70,
   
    align: "right",
    sortable: true,
    visible: true,
  },
  {
    field: "quotePrice",
    title: "报价含税单价",
    width: 170,
    minWidth: 70,
   
    align: "right",
    sortable: true,
    visible: true,
  },
  {
    field: "priceRank",
    title: "价格排名",
    width: 150,
    minWidth: 70,
   
    align: "right",
    sortable: true,
    visible: true,
  },
  {
    field: "price",
    title: "中标含税单价",
    width: 150,
    minWidth: 70,
    align: "right",
    sortable: true,
    visible: true,
    params: {
      displayDigits: 2,
    },
    slots: {
      default: "slot_edit_number",
    },
  },
  {
    field: "bidResult",
    title: "中标结果",
    width: 150,
    minWidth: 70,
   
    align: "right",
    sortable: true,
    visible: true,
    slots: {
      default: "slot_edit_bidResult",
    },
  },
  {
    field: "qty",
    title: "中标数量",
    width: 150,
    minWidth: 70,
   
    align: "right",
    sortable: true,
    visible: true,
    slots: {
      default: "slot_edit_integerNumber",
    },
  },
  {
    field: "amount",
    title: "中标金额(含税)",
    width: 150,
    minWidth: 70,
   
    align: "right",
    sortable: true,
    visible: true,
  },
];

export { summaryColumns };

[
  {
    label: "竞价项目编号",
    field: "projectBillNo",
    required: true,
    type: "",
    width: "33%",
  },
  {
    label: "竞价项目名称",
    field: "projectName",
    type: "",
    width: "33%",
    required: true,
  },
  {
    label: "竞价申请日期",
    field: "applyTime",
    required: true,
    type: "",
    width: "33%",
  },
  {
    label: "竞价说明",
    field: "describeRemark",
    type: "",
    width: "99%",
    required: true,
  },
  {
    label: "项目状态",
    field: "projectStatusName",
    required: true,
    type: "",
    width: "33%",
  },
  {
    label: "供应商",
    field: "supplierList",
    required: true,
    type: "",
    width: "66%",
    slot: 'supplierListObj'
  },
  {
    label: "授标方式",
    field: "awardMethodCode",
    fieldName: "awardMethodName",
    required: true,
    type: "radio",
    source: "awardMethodList",
    width: "33%",
  },
  {
    label: "中标供应商",
    field: "supplierName",
    required: true,
    type: "select",
    source: "supplierList",
    width: "33%",
  },
];


[
  {
    field: "supplierName",
    title: "供应商名称",
    width: 190,
    minWidth: 70,
    align: "left",
  },
  {
    field: "status",
    title: "报价状态",
    width: 150,
    minWidth: 70,
    align: "left",
    slots: { default: "slot_status" },
  },
  {
    field: "offerTime",
    title: "报价时间",
    width: 150,
    minWidth: 70,
    align: "left",
  },

  {
    field: "fromAmount",
    title: "报价金额(含税)",
    width: 150,
    minWidth: 70,
    align: "right",
    params: {
      displayDigits: 2,
      addFooter: true
    }
  },
  {
    field: "ranking",
    title: "当前排名",
    width: 100,
    minWidth: 70,
    align: "right",
  },
  {
    field: "bidResult",
    title: "中标结果",
    minWidth: 100,
    align: "left",
    slots: { default: "slot_bidResult" },
  },
  {
    field: "hitRemark",
    title: "中标说明",
    width: 150,
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_textarea" },
  },
  {
    field: "amount",
    title: "中标金额(含税)",
    width: 150,
    minWidth: 70,
    align: "right",
    params: { 
      displayDigits: 2,
      addFooter: true 
    }
  },
  {
    field: "amountName",
    title: "金额大写",
    width: 150,
    minWidth: 70,
    align: "left",
  },
  {
    field: "untaxAmount",
    title: "不含税总价",
    width: 150,
    minWidth: 70,
    align: "right",
  },
  {
    field: "taxRate",
    title: "税额",
    width: 120,
    minWidth: 70,
    align: "right",
  },
  {
    field: "action",
    title: "操作",
    width: 130,
    align: "left",
    fixed: "right",
    slots: { default: "action" },
  },
];

[
  {
    field: "businessBillNo",
    title: "需求池流水号",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "materialName",
    title: "采购商品",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "materialTypeName",
    title: "物料类型",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "materialCode",
    title: "物料编码",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "model",
    title: "型号",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "standard",
    title: "规格",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "voltageLevel",
    title: "电压",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "attribute",
    title: "属性",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "unit",
    title: "单位",
    width: 190,
    minWidth: 70,
    align: "left",
    params: {
      merges: true
    }
  },
  {
    field: "fromQty",
    title: "申请数量",
    width: 190,
    minWidth: 70,
    align: "right",
    params: {
      merges: true
    }
  },
  {
    field: "businessLicense",
    title: "供应商名称",
    width: 190,
    minWidth: 70,
    align: "left",
  },
  {
    field: "fromQty",
    title: "可供货数量",
    width: 190,
    minWidth: 70,
    align: "right",
  },
  {
    field: "fromPrice",
    title: "报价含税单价",
    width: 190,
    minWidth: 70,
    align: "right",
  },
  {
    field: "ranking",
    title: "价格排名",
    width: 190,
    minWidth: 70,
    align: "right",
  },
  {
    field: "price",
    title: "中标含税单价",
    width: 190,
    minWidth: 70,
    align: "right",
    slots: { default: "slot_edit_number" },
  },
  {
    field: "bidResult",
    title: "中标结果",
    width: 190,
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_select" },
  },
  {
    field: "qty",
    title: "中标数量",
    width: 190,
    minWidth: 70,
    align: "right",
    slots: { default: "slot_edit_number" },
  },
  {
    field: "amount",
    title: "中标金额(含税)",
    width: 190,
    minWidth: 70,
    align: "right",
    params: {
      displayDigits: 2,
      addFooter: true
    }
  },
]

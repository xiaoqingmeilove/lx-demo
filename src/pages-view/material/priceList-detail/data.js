[
    { "label": "供应商", "field": "supplierName", "slot": "supplierName", "width": "33%"  },
    { "label": "有效日期", "field": "validityStartDate", "slot": "effectiveDate", "width": "33%"  },
    { "label": "价目表类型", "field": "purchaseType", "fieldName":"purchaseTypeName","type": "selectinput", "width": "33%", "source":"purchaseTypeList"  },
    { "label": "税率", "field": "taxRate", "type": "select", "width": "33%", "source":"taxRateList"  },
    { "label": "价格来源", "field": "priceSourceName", "type": "", "width": "33%"  }
]




[
    {"title":"物料代码","field":"materialCode","align":"left","minWidth":100},
    {"title":"物料名称","field":"materialName","align":"left","minWidth":100},
    {"title":"物料分类","field":"materialTypeName","align":"left","minWidth":100},
    {"title":"型号","field":"model","align":"left","minWidth":100},
    {"title":"规格","field":"standard","align":"left","minWidth":100},
    {"title":"电压等级","field":"voltageLevel","align":"left","minWidth":100},
    {"title":"单位","field":"unit","align":"left","width":100},
    {"title":"阶梯数量","field":"","align":"left","width":320,"minWidth":150,"slots":{"default":"number_edit","header":"slot_required"}},
    {"title":"含税单价","field":"price","align":"right","minWidth":100,"width":150,"params": {"displayDigits":4},"slots":{"default":"slot_edit_number","header":"slot_required"}},
    {"title":"不含税单价","field":"untaxPrice","align":"right","minWidth":100,"width":150,"params": {"displayDigits":4}},
    {"title":"操作","field":"action","align":"left","width":150,"slots":{"default":"action"}}
]
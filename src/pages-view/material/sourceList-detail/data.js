[
    { "label": "货源类型", "field": "type","fieldName":"typeName","type": "radio","source":"sourceTypeList", "width": "33%"},
    { "label": "生效日期", "field": "validityStartDate", "slot": "solt_date", "width": "33%"},
    { "label": "失效日期", "field": "validityEndDate", "slot": "solt_date", "width": "33%"}
]




[
    {"title":"物料代码","field":"materialCode","align":"left","minWidth":100},
    {"title":"物料名称","field":"materialName","align":"left","minWidth":100},
    {"title":"型号","field":"model","align":"left","minWidth":100},
    {"title":"规格","field":"standard","align":"left","minWidth":100},
    {"title":"电压等级","field":"voltageLevel","align":"left","minWidth":100},
    {"title":"单位","field":"unit","align":"left","width":100}
]
// {"title":"操作","field":"action","align":"left","width":100,"slots":{"default":"action"}}


[
    {"title":"供应商编码","field":"supplierBillNo","align":"left","minWidth":100},
    {"title":"供应商名称","field":"supplierName","align":"left","minWidth":100},
    {"title":"生效日期","field":"validityStartDate","align":"left","width":190,"minWidth":100},
    {"title":"失效日期","field":"validityEndDate","align":"left","width":190,"minWidth":100},
    {"title":"含税单价","field":"price","align":"right","minWidth":100,"params": {"displayDigits":4},"slots":{"default":"slot_edit_number","header":"slot_required"}},
    {"title":"不含税单价","field":"untaxPrice","align":"right","minWidth":100,"params": {"displayDigits":4}},
    {"title":"税率(%)","field":"taxRate","align":"right","minWidth":100,"params": {"displayDigits":2}},
    {"title":"配额(%)","field":"ratio","align":"right","minWidth":100,"params": {"displayDigits":2},"slots":{"default":"slot_edit_ratio","header":"slot_required"}},
    {"title":"操作","field":"action","align":"left","width":100,"slots":{"default":"action"}}
]
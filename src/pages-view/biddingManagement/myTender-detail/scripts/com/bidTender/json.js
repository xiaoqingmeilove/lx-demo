[
    { "field": "billNo", "title": "供应商编码", "minWidth": "100", "align": "left" },
    { "field": "supplierName", "title": "供应商名称", "minWidth": "100", "align": "left" },
    { "field": "linkerName", "title": "供应商联系人", "minWidth": "100", "align": "left" },
    { "field": "linkerTel", "title": "供应商手机", "minWidth": "100", "align": "left" },
    { "field": "linkerEmail", "title": "供应商邮箱", "minWidth": "100", "align": "left" },
    { "field": "registrationStatusName", "title": "报名状态", "minWidth": "100", "align": "left", "slots": { "default": "registrationStatusName" } },
    { "field": "bidFlag", "title": "投标状态", "minWidth": "100", "align": "left", "slots": { "default": "bidFlag" } },
    { "field": "suggestedFlag", "title": "是否推荐入围", "minWidth": "100", "align": "left", "slots": { "default": "suggestedFlag" } },
    { "field": "entryCount", "title": "入围次数", "minWidth": "100", "align": "left" },
    { "field": "winCount", "title": "中标次数", "minWidth": "100", "align": "left" },
    { "field": "suggestedRemark", "title": "推荐理由", "minWidth": "100", "align": "left", "slots": { "default": "suggestedRemark" } }
]



[
    {"title":"序号","type":"checkbox","width":"80","align":"left","minWidth":"80"},
    {"field":"materialCode","title":"物料代码","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"materialName","title":"物料名称","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"model","title":"型号","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"standard","title":"规格","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"voltageLevel","title":"电压","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"attribute","title":"属性","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"unit","title":"单位","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true,"params":{"source":"unitList"}},
    {"field":"originalQty","title":"需求数量","width":"150","minWidth":"100","align":"right","sortable":true,"visible":true,"params":{"displayDigits":2}},
    {"field":"qty","title":"可供货数量","width":"150","minWidth":"100","align":"right","sortable":true,"visible":true,"params":{"displayDigits":2,"required":true},"slots":{"default":"slot_edit_integerNumber"}},
    {"field":"price","title":"单价(元)","width":"150","minWidth":"100","align":"right","sortable":true,"visible":true,"params":{"displayDigits":2,"required":true,"addFooter":true},"slots":{"default":"slot_edit_price"}},
    {"field":"taxRate","title":"税率%","width":"150","minWidth":"100","align":"right","sortable":true,"visible":true,"params":{"displayDigits":2,"required":true,"source":"taxRateList"},"slots":{"default":"slot_edit_select"}},
    {"field":"taxAmount","title":"税额","width":"150","minWidth":"100","align":"right","sortable":true,"visible":true,"params":{"displayDigits":2,"required":true,"addFooter":true}},
    {"field":"amount","title":"金额(元)","width":"150","minWidth":"100","align":"right","sortable":true,"visible":true,"params":{"displayDigits":2,"required":true,"addFooter":true}}
]
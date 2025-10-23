[
    { "label": "采购需求名称", "field": "procurementName", "type": "input", "width": "33%", "required": true },
    { "label": "是否紧急", "field": "urgentFlag", "type": "radio", "width": "33%", "source": "flagList", "required": true },
    { "label": "需求类型", "field": "procurementType", "fieldName": "procurementTypeName", "type": "radio", "width": "99%", "source": "procurementTypeList", "required": true },
    { "label": "申请部门", "field": "purchaseDeptId", "fieldName": "purchaseDeptName", "required": true, "type": "selectinput", "source": "adepartmentList", "width": "33%" },
    { "label": "使用部门", "field": "employDeptId", "fieldName": "employDeptName", "required": true, "type": "selectinput", "source": "adepartmentList", "width": "33%" },
    { "label": "项目名称", "field": "projectName", "type": "input", "width": "33%" },
    { "label": "描述", "field": "remark", "type": "textarea", "rows": 4, "width": "99%" },
    { "label": "附件", "field": "fileList", "type": "", "width": "99%", "itemClass": "file-item", "slot": "fileList" }
]


[
    { "title": "选择", "type": "checkbox", "width": "80", "align": "left", "minWidth": "80", "visible": "true" },
    { "field": "rowNum", "title": "序号", "width": "80", "align": "left", "slots": { "default": "rowNum" }, "minWidth": "80", "visible": "true" },
    { "field": "materialCode", "title": "物料代码", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "materialName", "title": "物料名称", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "materialTypeName", "title": "物料分类", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "model", "title": "型号", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "standard", "title": "规格", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "voltageLevel", "title": "电压", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "attribute", "title": "属性", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_input" } },
    { "field": "unit", "title": "单位", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "source": "unitList" }, "slots": { "default": "slot_edit_select" } },
    { "field": "price", "title": "参考单价(含税)", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2 }, "slots": { "default": "slot_edit_number" } },
    { "field": "qty", "title": "申请数量", "width": "150", "minWidth": "100", "align": "right", "sortable": true, "visible": true, "params": { "displayDigits": 2, "required": true }, "slots": { "default": "slot_edit_qty", "header": "slot_header" } },
    { "field": "purchaseDate", "title": "需求日期", "width": "150", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "params": { "required": true }, "slots": { "default": "slot_edit_date", "header": "slot_header" } },
    { "field": "remark", "title": "备注", "width": "130", "minWidth": "100", "align": "left", "sortable": true, "visible": true, "slots": { "default": "slot_edit_textarea" } }
]









// [
//     {"label":"采购申请日期","field":"purchaseSubTime","type":"date","width":"33%","required":true},
//     {"label":"采购人","field":"purchaseSubUser","required":true,"type":"selectinput","source":"applicantList","width":"33%"},
//     {"label":"采购部门","field":"purchaseDeptId","required":true,"type":"selectinput","source":"adepartmentList","width":"33%"},
//     {"label":"采购预算金额","field":"amount","type":"","digits":2,"precision":2,"formatterName":"toFixedNumber","width":"33%"},
//     {"label":"采购申请说明","field":"purchaseRequestDescription","type":"textarea","width":"33%"},
//     {"label":"寻源方式","field":"sourcingMethod","required":true,"type":"selectinput","source":"sourcingMethodList","width":"33%"},
//     {"label":"供应商","field":"supplierId","type":"selectinput","source":"confirmedSupplierList","width":"33%"},
//     {"label":"数据来源","field":"dataSourceName","type":"","width":"33%"}
// ]


// [
//     {"title":"选择","type":"checkbox","width":"80","align":"left","resizable":"true","minWidth":"80","visible":"true"},
//     {"field":"rowNum","title":"序号","width":"80","align":"left","resizable":"true","slots":{"default":"rowNum"},"minWidth":"80","visible":"true"},
//     {"field":"materialName","title":"采购商品","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"materialTypeCode","title":"物料类型","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"materialCode","title":"物料编码","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"model","title":"型号","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"standard","title":"规格","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"voltageLevel","title":"电压","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"attribute","title":"属性","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"unit","title":"单位","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"qty","title":"申请数量","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true,"slots":{"default":"slot_edit_integerNumber"}},
//     {"field":"untaxPrice","title":"预算单价(不含税)","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"taxRate","title":"税率(%)","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true,"params":{"displayDigits":2},"slots":{"default":"slot_edit_number"}},
//     {"field":"price","title":"预算单价(含税)","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"untaxAmount","title":"预算金额(不含税)","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"amount","title":"预算金额(含税)","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true},
//     {"field":"latestArrivalDate","title":"最晚到货时间","width":"130","minWidth":"100","align":"left","sortable":true,"visible":true,"slots":{"default":"slot_edit_date"}},
//     {"field":"areaCodeList","title":"收货区域","width":130,"minWidth":100,"align":"left","sortable":true,"visible":true,"slots":{"default":"areaCodeList"}},
//     {"field":"deliveryAddress","title":"收货地址","width":130,"minWidth":100,"align":"left","sortable":true,"visible":true,"slots":{"default":"slot_edit_input"}},
//     {"field":"receiving","title":"收货人","width":130,"minWidth":100,"align":"left","sortable":true,"visible":true,"slots":{"default":"slot_edit_input"}},
//     {"field":"receivingPhone","title":"收货电话","width":130,"minWidth":100,"align":"left","sortable":true,"visible":true,"slots":{"default":"slot_edit_input"}}
// ]
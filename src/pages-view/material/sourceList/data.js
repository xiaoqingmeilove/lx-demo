[
    {"label":"物料代码","field":"materialCode","type":"input","isDefault":true},
    {"label":"物料名称","field":"materialName","type":"input","isDefault":true},
    {"label":"供应商名称","field":"supplierName","type":"input","isDefault":true},
    {"label":"有效效日期","fields":["validityStartDate","validityEndDate"],"type":"datePicker","isDefault":true},
    {"label":"单据状态","field":"billStateList","type":"selectmulti","output":"string","source":"billStateList"}
]
// {"label":"货源状态","field":"purchaseTypeList","type":"selectmulti","output":"string","source":"purchaseTypeList"}



[
    {"field":"rowNum","title":"序号","width":80,"type":"checkbox","align":"center","slots":{"default":"rowNum"}},
    {"field":"billNo","title":"货源编号","width":190,"minWidth":100,"align":"left"},
    {"field":"materialCode","title":"物料代码","minWidth":100,"align":"left"},
    {"field":"materialName","title":"物料名称","minWidth":100,"align":"left"},
    {"field":"validityStartDate","title":"生效日期","width":190,"minWidth":100,"align":"left","slots":{"default":"slot_date"}},
    {"field":"validityEndDate","title":"失效日期","width":190,"minWidth":100,"align":"left","slots":{"default":"slot_date"}},
    {"field":"typeName","title":"货源类型","minWidth":100,"align":"left"},
    {"field":"supplierName","title":"供应商名称","minWidth":100,"align":"left"},
    {"field":"ratio","title":"配额(%)","width":100,"align":"right","params":{"displayDigits":2}},
    {"field":"price","title":"含税单价","minWidth":100,"align":"right","params":{"displayDigits":2}},
    {"field":"billState","title":"单据状态","minWidth":100,"align":"left","slots":{"default":"billState"}},
    {"field":"createUserName","title":"创建人","minWidth":100,"align":"left"},
    {"field":"createTime","title":"创建时间","width":190,"minWidth":100,"align":"left"}
]
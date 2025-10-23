const columns = [
    {"field":"rowNum","width":80,"minWidth":80,"align":"left","type":"checkbox"},
    {"field":"supplierName","title":"企业名称","width":130,"minWidth":100,"align":"left","slots":{"default":"slot_content"}},
    {"field":"billNo","title":"编码","width":170,"minWidth":100,"align":"left"},
    {"field":"clientName","title":"采购组织","width":160,"minWidth":160,"align":"left"},
    {"field":"newSupplierFlag","title":"新供应商","width":160,"minWidth":160,"align":"left", "slots":{"default":"slot_flag"}},
    {"field":"areaCodeListName","title":"所在地区","minWidth":100,"width":150,"align":"left"},
    {"field":"authStatus","title":"认证状态","minWidth":100,"width":150,"align":"left", "slots":{"default":"authStatus"}},
    {"field":"supplierTypeName","title":"供应商类型","width":130,"minWidth":100,"align":"left"},
    {"field":"supplierClassification","title":"供应商分类","width":130,"minWidth":100,"align":"left", "slots":{"default":"supplierClassification"}},
    {"field":"supplierLevelName","title":"供应商等级","width":130,"minWidth":100,"align":"left"},
    {"field":"inviteUserName","title":"负责人","width":130,"minWidth":100,"align":"left"},
    {"field":"supplyClassificationName","title":"供货分类","width":130,"minWidth":100,"align":"left"},
    {"field":"mobile","title":"联系电话","width":150,"align":"left"},
    {"field":"validityEndDate","title":"有效期","width":150,"align":"left","slots":{"default":"validityEndDate"}}
]; 
// {"field":"areaCodeListName","title":"企业状态","minWidth":100,"width":150,"align":"left"},


export {
    columns,
}
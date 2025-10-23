[
    { "label": "供应商名称", "field": "supplierName", "type": "input", "isDefault": true }, 
    { "label": "单据时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker", "isDefault": true }, 
    { "label": "提交时间", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker", "isDefault": true }, 
    { "label": "审核时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker", "isDefault": true }, 
    { "label": "合同号", "field": "billNo", "type": "input" }, 
    { "label": "合同状态", "field": "billStateList", "type": "selectmulti", "output": "string", "source": "billStateList" }, 
    { "label": "合同金额", "fields": ["beginContractAmount","endContractAmount"], "type": "numberRange" }, 
    { "label": "合同类型", "field": "contractTypeList", "type": "selectmulti", "output": "string", "source": "contractTypeList"}, 
    { "label": "付款方式", "field": "paymentMethod", "type": "input" }
]


[
    {"field":"billNo","title":"合同号","width":190,"minWidth":100,"align":"left"},
    {"field":"billState","title":"合同状态","minWidth":100,"align":"left","slots":{"default":"billState"}},
    {"field":"createTime","title":"单据时间","width":190,"minWidth":100,"align":"left"},
    {"field":"submissionTime","title":"提交时间","width":190,"minWidth":100,"align":"left"},
    {"field":"auditDate","title":"审核时间","width":190,"minWidth":100,"align":"left"},
    {"field":"createUserName","title":"提交人","minWidth":100,"align":"left"},
    {"field":"auditorName","title":"审核人","minWidth":100,"align":"left"},
    {"field":"supplierName","title":"供应商名称","minWidth":100,"align":"left"},
    {"field":"contractAmount","title":"合同金额","minWidth":100,"align":"right","params":{"displayDigits":2}},
    {"field":"contractTypeName","title":"合同类型","minWidth":100,"align":"left"},
    {"field":"paymentMethod","title":"付款方式","minWidth":100,"align":"left"}
]
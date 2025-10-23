[
    { "label": "模版编码", "field": "billNo", "type": "input", "isDefault": true }, 
    { "label": "模版名称", "field": "templateName", "type": "input", "isDefault": true }, 
    { "label": "合同类型", "field": "contractType", "type": "selectmulti", "output": "string", "source": "contractTypeList", "isDefault": true }, 
    { "label": "签署方式", "field": "signingMethod", "type": "selectmulti", "output": "string", "source": "signatureMethodList", "isDefault": true }
]


[
    {"field":"rowNum","title":"序号","width":100,"align":"left","type":"checkbox","slots": {"default": "rowNum"}},
    {"field":"billNo","title":"模版编码","width":190,"minWidth":100,"align":"left"},
    {"field":"templateName","title":"模版名称","minWidth":100,"align":"left"},
    {"field":"contractTypeName","title":"合同类型","minWidth":100,"align":"left"},
    {"field":"signingMethodName","title":"签署方式","minWidth":100,"align":"left"},
    {"field":"contractTerms","title":"条款内容","minWidth":100,"align":"left"},
    {"field":"enableFlag","title":"状态","minWidth":100,"align":"left","slots": {"default": "enableFlag"}},
    {"field":"updateTime","title":"更新日期","width":190,"minWidth":70,"align":"left"},
    {"field":"createUserName","title":"制单人","minWidth":100,"align":"left"},
    {"field":"updateUserName","title":"更新人","minWidth":100,"align":"left"}
]
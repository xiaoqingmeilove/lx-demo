[
    {"label":"合同类型","field":"contractType","type":"select","width":"33%","source":"contractTypeList","required":true},
    {"label":"合同模版","field":"templateId","fieldName":"templateName","type":"select","width":"33%","source":"contractTemplateList"},
    {"label":"合同日期","field":"contractDate","required":true,"type":"datetime","width":"33%"},
    {"label":"合同开始时间","field":"contractStartDate","required":true,"type":"datetime","width":"33%"},
    {"label":"合同结束时间","field":"contractEndDate","type":"datetime","required":true,"width":"33%"},
    {"label":"采购类型","field":"purchaseType","fieldName":"purchaseTypeName","type":"select","width":"33%","source":"purchaseTypeList","required":true},
    {"label":"业务主体","field":"businessEntity","required":true,"type":"select","source":"businessSubjectList","width":"33%"},
    {"label": "供应商名称", "field": "supplierName", "slot": "supplierName", "width": "33%", "required":true},
    {"label":"合同金额","field":"contractAmount", "type": "number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%","required":true},
    {"label":"预付金额","field":"prepaidAmount", "type": "number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"付款方式","field":"paymentMethod","type":"input","width":"33%","required":true},
    {"label":"来源单号","field":"sourceBillNo","type":"","width":"33%"},
    {"label":"来源系统","field":"sourceSystem","type":"","width":"33%","required":true},
    {"label":"合同说明","field":"contractNote","type":"textarea","width":"66%"}
]


[
    {"title":"选择","type":"checkbox","align":"center","width":80},
    {"title":"需求池流水号","field":"requirementsBillNo","align":"left","width":170},
    {"title":"采购商品","field":"materialName","align":"left","width":150},
    {"title":"物料类型","field":"materialTypeName","align":"left","width":120},
    {"title":"物料编码","field":"materialTypeCode","align":"left","width":150},
    {"title":"型号","field":"model","align":"left","width":150},
    {"title":"规格","field":"standard","align":"left","width":120},
    {"title":"电压","field":"voltageLevel","align":"left","width":150},
    {"title":"属性","field":"attribute","align":"left","width":150},
    {"title":"单位","field":"unit","align":"left","width":150},
    {"title":"申请数量","field":"applicationQty","align":"right","width":120,"params":{"displayDigits":2}},
    {"title":"寻源方式","field":"sourcingMethodName","align":"right","width":120},
    {"title":"供应商名称","field":"confirmedSupplierName","align":"right","width":120},
    {"title":"中标数量","field":"bidQty","align":"right","width":120,"params":{"displayDigits":2}},
    {"title":"中标金额(含税)","field":"bidAmount","align":"right","width":150,"params":{"displayDigits":2,"addFooter":true}}
]

[{ "label": "供应商名称", "field": "supplierName", "type": "input", "slot": "slot_input"}]

[
    { "label": "订单编号", "field": "billNo", "type": "input", "isDefault": true },
    { "label": "供应商", "field": "businessLicense", "type": "input", "isDefault": true },
    { "label": "采购金额", "fields": ["beginContractAmount", "endContractAmount"], "type": "numberRange", "isDefault": true },
    { "label": "订单发布时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker", "isDefault": true },
    { "label": "确认状态", "field": "agreeFlag", "type": "selectmulti", "output": "string", "source": "agreeFlag" },
    { "label": "预计到货日期", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker" },
    { "label": "提交人", "field": "contractTypeList", "type": "input" },
    { "label": "审核人", "field": "paymentMethod", "type": "input" }
]


[
    { "field": "", "title": "选择", "type": "checkbox", "width": 80, "align": "center" },
    { "field": "billNo", "title": "订单编号", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "supplierName", "title": "供应商", "minWidth": 100, "align": "left" },
    { "field": "contractAmount", "title": "采购金额", "minWidth": 100, "align": "right", "params": { "displayDigits": 2 } },
    { "field": "auditDate", "title": "订单发布时间", "width": 190, "minWidth": 100, "align": "left" },
    { "field": "billState", "title": "单据状态", "minWidth": 100, "align": "left", "slots": { "default": "billState" } },
    { "field": "agreeFlagName", "title": "确认状态", "minWidth": "100", "align": "left", "slots": { "default": "agreeFlag" } },
    { "field": "paymentMethod", "title": "结算方式", "minWidth": 100, "align": "left" },
    { "field": "createUserName", "title": "提交人", "minWidth": 100, "align": "left" },
    { "field": "auditorName", "title": "审核人", "minWidth": 100, "align": "left" }
]
export const changeTimeItems = [
    { "label": "报价截止时间", "field": "endQuoteTime", "type": "datetime", "width": "80%", "placeholder": "请输入报价截止时间", "params": { "required": true } },
    { "label": "备注", "field": "remark", "type": "textarea", "width": "80%", "placeholder": "请输入备注", "params": { "required": true } },
];

export const moreEnquiryColumns = [
    { "field": "select", "title": "选择", "minWidth": "100", "width": "60", "align": "left", "slots": { "default": "select" } },
    { "field": "billNo", "title": "供应商编码", "minWidth": "100", "align": "left" },
    { "field": "supplierName", "title": "供应商名称", "minWidth": "100", "align": "left" },
    { "field": "linkerName", "title": "供应商联系人", "minWidth": "100", "align": "left" },
    { "field": "linkerTel", "title": "供应商手机", "minWidth": "100", "align": "left" },
    { "field": "linkerEmail", "title": "供应商邮箱", "minWidth": "100", "align": "left" },
    { "field": "quoteStateName", "title": "报价状态", "minWidth": "100", "align": "left" },
    { "field": "remark", "title": "备注", "minWidth": "100", "align": "left" },
];

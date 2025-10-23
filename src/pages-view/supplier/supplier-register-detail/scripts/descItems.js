[
  { "label": "负责人", "field": "inviteUserName", "width": "33%" },
  { "label": "税率", "field": "taxRate", "slot": "taxRate", "width": "33%" },
  { "label": "认证状态", "field": "authStatus", "width": "33%", "slot": "authStatus" },
  { "label": "付款条件", "field": "paymentTerm", "width": "33%" },
  { "label": "账期", "field": "accountPeriod", "width": "33%" },
  { "label": "供应商有效期", "field": "validityEndDate", "slot": "validityEndDate", "width": "33%" }
]



// { "label": "企业名称(英文)", "field": "businessLicense", "type": "input", "width": "33%"  },  ////
// { "label": "编码", "field": "billNo", "required": true, "type": "input", "width": "33%"  },
[
  { "label": "企业名称", "field": "supplierName", "required": true, "type": "input", "width": "33%" },
  { "label": "企业简称", "field": "supplierNickName", "type": "input", "width": "33%" },
  { "label": "企业性质", "field": "enterpriseType", "fieldName": "enterpriseTypeName", "required": true, "type": "select", "source": "enterpriseTypeList", "width": "33%" },
  { "label": "供应商类型", "field": "supplierType", "fieldName": "supplierTypeName", "required": true, "type": "select", "source": "supplierTypeList", "width": "33%" },
  { "label": "供货分类", "field": "supplyClassification", "fieldName": "supplyClassificationName", "required": true, "type": "select", "source": "supplyCassificationList", "width": "33%" },
  { "label": "公司所在地", "field": "areaCodeList", "type": "", "slot": "areaCodeList", "width": "33%" },
  { "label": "主供物料", "field": "materialMsg", "type": "textarea", "width": "33%" },
  { "label": "用户名", "field": "userName", "type": "", "width": "33%" }
]

[
  { "label": "注册资本(万元)", "field": "supplierAmount", "type": "number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber", "width": "33%" },
  { "label": "注册时间", "field": "bornDate", "type": "date", "width": "33%" },
  { "label": "法人代表", "field": "legalRepresentative", "type": "input", "width": "33%" },
  { "label": "企业人数", "field": "employeeCount", "type": "number", "width": "33%" },
  { "label": "企业电话", "field": "supplierTel", "type": "input", "width": "33%" },
  { "label": "邮箱", "field": "email", "type": "input", "width": "33%" },
  { "label": "手机", "field": "mobile", "type": "input", "width": "33%" },
  { "label": "详细地址", "field": "deliveryAddress", "type": "input", "width": "33%" },
  { "label": "邮政编码", "field": "postalCode", "type": "input", "width": "33%" },
  { "label": "注册地址", "field": "registerAddress", "type": "textarea", "width": "66%" },
  { "label": "网站地址", "field": "supplierUrl", "type": "textarea", "width": "33%" },
  { "label": "企业logo", "field": "supplierLogoFileList", "type": "", "width": "99%", "slot": "supplierLogo" }
]


[
  { "label": "用户名", "field": "userName", "type": "input", "width": "33%" },
  { "label": "状态", "field": "createUserFlag", "type": "radio", "width": "33%", "source": "flagList" }
]



[
  { "label": "负责人", "field": "inviteUserId", "fieldName": "inviteUserName", "type": "selectinput", "width": "33%", "source": "inviteUserList" },
  { "label": "供应商类型", "field": "supplierType", "fieldName": "supplierTypeName", "type": "selectinput", "width": "33%", "source": "supplierTypeList" },
  { "label": "供应商有效期", "field": "validityEndDate", "type": "", "width": "33%", "slot": "validityEndDate" },
  { "label": "发票类型", "field": "invoiceType", "fieldName": "invoiceTypeName", "type": "selectinput", "width": "33%", "source": "invoiceTypeList" },
  { "label": "税率", "field": "taxRate", "type": "select", "width": "33%", "source": "taxRateList" },
  { "label": "质保金", "field": "retentionMoney", "type": "input", "width": "33%" },
  { "label": "付款条件", "field": "paymentTerm", "type": "selectinput2", "width": "33%", "source": "paymentTermList" },
  { "label": "结算方式", "field": "paymentMethod", "type": "selectinput2", "width": "33%", "source": "paymentMethodList" },
  { "label": "账期", "field": "accountPeriod", "type": "selectinput2", "width": "33%", "source": "accountPeriodList" },
  { "label": "供应商分类", "field": "supplierClassification", "fieldName": "supplierClassificationName", "type": "select", "width": "33%", "source": "supplierClassificationsList" },
  { "label": "供应商等级", "field": "supplierLevel", "fieldName": "supplierLevelName", "type": "select", "width": "33%", "source": "supplierLevelList" },
  { "label": "供应商评价", "field": "evaluation", "type": "textarea", "width": "33%" }
]
// { "label": "质保金(万元)", "field": "retentionMoney", "type": "number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber", "width": "33%"  },



[
  { "label": "供应商类型", "field": "supplierType", "fieldName": "supplierTypeName", "required": true, "type": "select", "source": "supplierTypeList", "width": "33%" },
  { "label": "供应商名称", "field": "businessLicense", "required": true, "type": "input", "width": "33%" },
  { "label": "统一社会信用代码", "field": "businessLicense", "required": true, "type": "input", "width": "33%" },
  { "label": "企业类型", "field": "enterpriseType", "fieldName": "enterpriseTypeName", "required": true, "type": "select", "source": "enterpriseTypeList", "width": "33%" },
  { "label": "企业简称", "field": "supplierNickName", "type": "input", "width": "33%" },
  { "label": "注册资金(万元)", "field": "supplierAmount", "type": "number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber", "width": "33%" },
  { "label": "成立时间", "field": "bornDate", "type": "date", "width": "33%" },
  { "label": "所在地区", "field": "areaCodeList", "type": "", "slot": "areaCodeList", "width": "33%" },
  { "label": "详细地址", "field": "deliveryAddress", "type": "input", "width": "33%" },
  { "label": "企业电话", "field": "supplierTel", "type": "input", "width": "33%" },
  { "label": "企业网址", "field": "supplierUrl", "type": "input", "width": "33%" },
  { "label": "供应商状态", "field": "supplierStatus", "fieldName": "supplierStatusName", "required": true, "type": "select", "source": "supplierStateList", "width": "33%", "slot": "supplierStatus" },
  { "label": "企业简介", "field": "supplierBlurb", "type": "textarea", "width": "99%" },
  { "label": "主供物料", "field": "materialMsg", "type": "textarea", "width": "99%" }
]

const descItems = [
  { label: '供应商类型', field: 'supplierType', fieldName: 'supplierTypeName', required: true, type: 'select', source: 'supplierTypeList', width: '33%' },
  { label: '供应商名称', field: 'businessLicense', required: true, type: 'input', width: '33%'  },
  { label: '统一社会信用代码', field: 'creditCode', required: true, type: 'input', width: '33%'  },
  { label: '企业类型', field: 'enterpriseType', fieldName: 'enterpriseTypeName', required: true, type: 'select', source: 'enterpriseTypeList', width: '33%'  },
  { label: '企业简称', field: 'supplierNickName', type: 'input', width: '33%'  },
  { label: '注册资金(万元)', field: 'supplierAmount', type: 'number', digits: 2, precision: 2, formatterName: 'toFixedNumber', width: '33%'  },
  { label: '成立时间', field: 'bornDate', type: 'date', width: '33%'  },
  { label: '所在地区', field: 'areaCodeList', type: '', slot: 'areaCodeList', width: '33%' },
  { label: '详细地址', field: 'deliveryAddress', type: 'input', width: '33%'  },
  { label: '企业电话', field: 'supplierTel', type: 'input', width: '33%'  },
  { label: '企业网址', field: 'supplierUrl', type: 'input', width: '33%'  },
  { label: '供应商状态', field: 'supplierStatus', fieldName: 'supplierStatusName', required: true, type: 'select', source: 'supplierStateList', width: '33%', "slot": "supplierStatus"  },
  { label: '企业简介', field: 'supplierBlurb', type: 'textarea', width: '100%'  },
  { label: '主供物料', field: 'materialMsg', type: 'textarea', width: '100%'  },
]
const descItems2 = [
  { label: '供应商联系人', field: 'linkerName', required: true, type: 'input', width: '33%'  },
  { label: '联系人尊称', field: 'linkerGender', type: 'radio', source: 'linkerGenderList', width: '33%' },
  { label: '部门职务', field: 'linkerDeptPosition', type: 'input', width: '33%'  },
  { label: '联系人手机号码', field: 'linkerTel', required: true, type: 'input', width: '33%'  },
  { label: '联系人电子邮件', field: 'linkerEmail', type: 'input', width: '33%'  },
]

export { descItems, descItems2 }
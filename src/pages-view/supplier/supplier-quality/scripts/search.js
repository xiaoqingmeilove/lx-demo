const searchOptions = [
  {
    "label": "供应商编号",
    "field": "supplierBillNo",
    "type": "input",
    "placeholder": "请输入供应商编号",
    "isDefault": true
  },
  {
    "label": "供应商名称",
    "field": "businessLicense",
    "type": "input",
    "placeholder": "请输入供应商名称",
    "isDefault": true,
  },
  {
    "label": "证书类别",
    "field": "certificateTypeName",
    "type": "input",
    "placeholder": "请输入证书名称",
    "isDefault": true
  },
  {
    "label": "到期时间",
    "fields": [
      "beginExpireDate",
      "endExpireDate"
    ],
    "type": "datePicker",
    "isDefault": true
  },
]
export { searchOptions }
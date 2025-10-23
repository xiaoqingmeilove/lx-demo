/**
 * 企业名称
编码
新供应商
负责人  
所在地区
认证状态
供应商类型
供应商分类
供货分类
联系电话
有效期
 */

const searchOptions = [
  {
    "label": "企业名称",
    "field": "supplierName",
    "type": "input",
    "isDefault": true
  },
  {
    "label": "编码",
    "field": "supplierBillNo",
    "type": "input",
    "placeholder": "请输入编号",
    "isDefault": true
  },
  {
    "label": "新供应商",
    "field": "newSupplierFlag",
    "type": "select",
    "source": "flagList",
    "isDefault": true
  },
  {
    "label": "负责人",
    "field": "inviteUserName",
    "type": "input",
    "isDefault": true
  },
  {
    "label": "所在地区",
    "field": "areaCodeListName",
    "type": "input"
  },
  {
    "label": "认证状态",
    "field": "authStatusList",
    "type": "selectmulti",
    "output": "string",
    "placeholder": "请选择认证状态",
    "source": "authStatusList"
  },
  {
    "label": "供应商类型",
    "field": "supplierTypeList",
    "type": "selectmulti",
    "output": "string",
    "placeholder": "请选择供应商类型",
    "source": "supplierTypeList"
  },
  {
    "label": "供应商分类",
    "field": "supplierClassificationList",
    "type": "selectmulti",
    "output": "string",
    "placeholder": "请选择供应商分类",
    "source": "supplierClassificationList"
  },
  {
    "label": "供货分类",
    "field": "supplyClassificationList",
    "type": "selectmulti",
    "output": "string",
    "placeholder": "请选择供货分类",
    "source": "supplyClassificationList"
  },
  {
    "label": "联系电话",
    "field": "supplierTel",
    "type": "input"
  },
  {
    "label": "有效期",
    "fields": [
      "beginValidityEndDate",
      "endValidityEndDate"
    ],
    "type": "datePicker"
  }
]
export { searchOptions }
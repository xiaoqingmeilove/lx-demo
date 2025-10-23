[
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



const searchOptions = [
  {
    "label": "审批流水号",
    "field": "billNo",
    "type": "input",
    "placeholder": "请输入审批流水号",
    "isDefault": true
  },
  // {
  //   "label": "流程状态",
  //   "field": "bizState",
  //   "type": "input",
  //   "placeholder": "请输入流程状态",
  //   "isDefault": true
  // },
  {
    "label": "单据状态",
    "field": "billStateList",
    "type": "selectmulti",
    "output": "string",
    "placeholder": "请选择单据状态",
    "source": "billStateList",
    "isDefault": true
  },
  {
    "label": "单据时间",
    "fields": [
      "beginTime",
      "endTime"
    ],
    "type": "datePicker",
    "isDefault": true
  },
  {
    "label": "提交时间",
    "fields": [
      "beginSubmissionTime",
      "endSubmissionTime"
    ],
    "type": "datePicker",
    "isDefault": true
  },
  {
    "label": "审核时间",
    "fields": [
      "beginAuditDate",
      "endAuditDate"
    ],
    "type": "datePicker"
  },
  {
    "label": "申请人",
    "field": "createUserName",
    "type": "input",
    "placeholder": "请输入申请人",
  },
  {
    "label": "审核人",
    "field": "auditorName",
    "type": "input",
    "placeholder": "请输入审核人",
  },
  {
    "label": "统一社会信用代码",
    "field": "creditCode",
    "type": "input",
    "placeholder": "请输入统一社会信用代码",
  },
  {
    "label": "供应商名称",
    "field": "businessLicense",
    "type": "input",
    "placeholder": "请输入供应商名称"
  },
  {
    "label": "供应商编号",
    "field": "supplierBillNo",
    "type": "input",
    "placeholder": "请输入供应商编号"
  },
]
export { searchOptions }
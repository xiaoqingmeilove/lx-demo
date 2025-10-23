// [
//   {
//     label: "询价项目",
//     field: "projectName",
//     required: true,
//     type: "input",
//     width: "33%",
//   },
//   {
//     label: "询价日期",
//     field: "enquiryDate",
//     type: "date",
//     width: "33%",
//     required: true,
//   },
//   {
//     label: "询价说明",
//     field: "enquiryDescription",
//     type: "input",
//     width: "33%",
//   },
//   {
//     label: "报价截止时间",
//     field: "deadlineQuoteDate",
//     type: "datetime",
//     width: "33%",
//     required: true,
//   },
//   {
//     label: "询价方式",
//     field: "enquiryType",
//     required: true,
//     type: "selectinput",
//     source: "enquiryTypeList",
//     width: "33%",
//   },
//   {
//     label: "提醒方式",
//     field: "remindMethodArr",
//     required: true,
//     type: "selectmulti",
//     source: "reminderMethodList",
//     width: "33%",
//   },
//   {
//     label: "中标方式",
//     field: "bidWinMethod",
//     required: true,
//     type: "selectinput",
//     source: "winBidTypeList",
//     width: "33%",
//   },
//   {
//     label: "供应商",
//     field: "supplierList",
//     slot: "supplierList",
//     width: "66%",
//     required: true,
//   },
//   { label: "关联询价单号", field: "linkPreBillNo", type: "", width: "33%" },
//   { label: "报价轮数", field: "currentEnquiryTimes", type: "", width: "33%" },
// ];

// [
//   { field: "rowNum", title: "序号", width: "80", align: "left", resizable: "true", slots: { default: "rowNum" }, minWidth: "80", visible: "true", },
//   { field: "fromBillNo", title: "需求池流水号", width: 190, minWidth: 70, resizable: false, align: "left", sortable: true, visible: true },
//   {
//     field: "materialName",
//     title: "采购商品",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "materialTypeName",
//     title: "物料类型",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "materialCode",
//     title: "物料编码",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "model",
//     title: "型号",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "standard",
//     title: "规格",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "voltageLevel",
//     title: "电压",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "attribute",
//     title: "属性",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "unit",
//     title: "单位",
//     width: 190,
//     minWidth: 70,
//     resizable: false,

//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "qty",
//     title: "申请数量",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "right",
//     sortable: true,
//     visible: true,
//     slots: { default: "slot_edit_integerNumber" },
//   },
//   {
//     field: "untaxPrice",
//     title: "预算单价(不含税)",
//     width: 190,
//     minWidth: 70,
//     resizable: false,

//     align: "right",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "taxRate",
//     title: "税率",
//     width: 190,
//     minWidth: 70,
//     resizable: false,

//     align: "right",
//     sortable: true,
//     visible: true,
//     params: {
//       displayDigits: 2,
//     },
//     slots: { default: "slot_edit_number" },
//   },
//   {
//     field: "price",
//     title: "预算单价(含税)",
//     width: 190,
//     minWidth: 70,
//     resizable: false,

//     align: "right",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "untaxAmount",
//     title: "预算金额(不含税)",
//     width: 190,
//     minWidth: 70,
//     resizable: false,

//     align: "right",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "amount",
//     title: "预算金额(含税)",
//     width: 190,
//     minWidth: 70,
//     resizable: false,

//     align: "right",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "latestArrivalDate",
//     title: "最晚到货时间",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//     slots: { default: "slot_edit_date" },
//   },
//   {
//     field: "areaCodeList",
//     title: "收货区域",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//     slots: { default: "areaCodeList" },
//   },
//   {
//     field: "deliveryAddress",
//     title: "收货地址",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//     slots: { default: "slot_edit_input" },
//   },
//   {
//     field: "receiving",
//     title: "收货人",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//     slots: { default: "slot_edit_input" },
//   },
//   {
//     field: "receivingPhone",
//     title: "收货电话",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     align: "left",
//     sortable: true,
//     visible: true,
//     slots: { default: "slot_edit_input" },
//   },
// ];

//seach
[
  { "label": "询价单号", "field": "billNo", "type": "input", "isDefault": true },
  { "label": "单据状态", "field": "billStateList", "type": "selectmulti", "isDefault": true, "source": "statelist", "output": "string" },
  { "label": "业务状态", "field": "enquiryStateList", "type": "selectmulti", "isDefault": true, "source": "enquiryState", "output": "string" },
  { "label": "单据时间", "fields": ["beginCreateTime", "endCreateTime"], "type": "datePicker", "isDefault": true },
  { "label": "提交时间", "fields": ["beginSubmissionTime", "endSubmissionTime"], "type": "datePicker", "isDefault": true },
  { "label": "审核时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker", "isDefault": false },
  { "label": "申请人", "field": "createUserName", "type": "input", "isDefault": false },
  { "label": "审核人", "field": "auditorName", "type": "input", "isDefault": false },
  { "label": "询价项目", "field": "projectName", "type": "input", "isDefault": false },
  { "label": "询价日期", "fields": ["beginEnquiryDate", "endEnquiryDate"], "type": "datePicker", "isDefault": false },
  { "label": "报价截止时间", "fields": ["beginDeadlineQuoteDate", "endDeadlineQuoteDate"], "type": "datePicker", "isDefault": false },
  { "label": "询价轮数", "fields": ["beginCurrentEnquiryTimes", "endCurrentEnquiryTimes"], "type": "numberRange", "isDefault": false }
]

//一览表
[
  { "field": "billNo", "title": "询价单号", "width": 190, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true },
  { "field": "projectName", "title": "询价项目名称", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryDate", "title": "询价日期", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryDescription", "title": "询价说明", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryStateName", "title": "询价状态", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": false },
  { "field": "currentEnquiryTimes", "title": "询价轮数", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "deadlineQuoteDate", "title": "报价截止时间", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryStateName", "title": "业务状态", "width": 100, "minWidth": 100, "resizable": false, "fixed": "right", "align": "left", "sortable": true, "visible": true },
  { "field": "billStateName", "title": "单据状态", "width": 100, "minWidth": 100, "resizable": false, "fixed": "right", "align": "left", "sortable": true, "slots": { "default": "billState" }, "visible": true },
  { "field": "createTime", "title": "单据时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "createUserName", "title": "创建人", "width": 160, "minWidth": 70, "align": "left", "sortable": true },
  { "field": "submissionTime", "title": "提交时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditDate", "title": "审核时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditorName", "title": "审核人", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true }
]



// 询价详情基本信息
[
  { "label": "询价标题", "field": "projectName", "type": "input", "width": "50%" },
  { "label": "项目类型", "field": "projectType", "fieldName": "projectTypeName", "type": "radio", "width": "50%", "source": "projectTypeList" },
  { "label": "收货地址", "field": "areaCodeList", "width": "50%", "slot": "areaCodeList" },
  { "label": "采购类型", "field": "purchaseType", "fieldName": "purchaseTypeName", "type": "select", "width": "50%", "source": "purchaseTypeList" },
  { "label": "询价日期", "field": "enquiryDate", "type": "date", "width": "50%" },
  { "label": "报名截止时间", "field": "endInvolveTime", "type": "datetime", "width": "50%", "sortable": true, "visible": true },
  { "label": "报价截止时间", "field": "endQuoteTime", "type": "datetime", "width": "50%" },
  { "label": "邀请方式", "field": "enquiryType", "fieldName": "enquiryTypeName", "type": "select", "width": "50%", "source": "enquiryTypeList" },
  { "label": "采购员", "field": "purchaseUserName", "fieldName": "purchaseUser", "fieldUserId": "purchaseUserId", "fieldTel": "purchaseUserTel", "type": "selectinput", "width": "50%", "source": "inviteUserList" },
  { "label": "联系电话", "field": "purchaseUserTel", "type": "input", "width": "50%", "slot": "purchaseUserTel" },
  { "label": "关联单号", "field": "linkPreBillNo", "width": "50%" },
  { "label": "整单询价", "field": "singleFlag", "width": "50%", "slot": "slot_switch" },
  { "label": "提醒方式", "field": "remindMethodArr", "fieldName": "remindMethodArrName", "type": "selectmulti", "source": "reminderMethodList", "width": "50%" },
  { "label": "备注", "field": "remark", "type": "input", "width": "50%" }
]

// 询价物料详情
[
  { "field": "materialCode", "title": "物料代码", "minWidth": "100", "align": "left" },
  { "field": "materialName", "title": "物料名称", "minWidth": "100", "align": "left" },
  { "field": "materialTypeName", "title": "物料分类", "minWidth": "100", "align": "left" },
  { "field": "model", "title": "型号", "minWidth": "100", "align": "left" },
  { "field": "standard", "title": "规格", "minWidth": "100", "align": "left" },
  { "field": "voltageLevel", "title": "电压", "minWidth": "100", "align": "left" },
  { "field": "attribute", "title": "属性", "minWidth": "100", "align": "left" },
  { "field": "unit", "title": "单位", "minWidth": "100", "align": "left" },
  { "field": "qty", "title": "询价数量", "minWidth": "100", "align": "right", "params": { "required": true }, "slots": { "default": "slot_edit_integerNumber", "header": "slot_header" } },
  { "field": "warrantyDuration", "title": "质保期(天)", "minWidth": "100", "align": "right", "params": { "required": true }, "slots": { "default": "slot_edit_integerNumber", "header": "slot_header" } },
  { "field": "latestArrivalDate", "title": "最晚到货时间", "width": "180", "minWidth": "100", "align": "left", "params": { "required": true }, "slots": { "default": "slot_edit_date", "header": "slot_header" } }
]

// 供应商信息
[
  { "field": "billNo", "title": "供应商编码", "minWidth": "100", "align": "left" },
  { "field": "supplierName", "title": "供应商名称", "minWidth": "100", "align": "left" },
  { "field": "linkerName", "title": "供应商联系人", "minWidth": "100", "align": "left" },
  { "field": "linkerTel", "title": "供应商手机", "minWidth": "100", "align": "left" },
  { "field": "linkerEmail", "title": "供应商邮箱", "minWidth": "100", "align": "left" },
  { "field": "quoteStateName", "title": "报价状态", "minWidth": "100", "align": "left", "slots": { "default": "quoteStateName" } },
  { "field": "remark", "title": "备注", "minWidth": "100", "align": "left" },
  { "field": "action", "title": "操作", "minWidth": "100", "align": "left", "slots": { "default": "action" } }
]

// 业务规则
[
  { "label": "密封报价", "field": "sealPrice", "type": "", "width": "50%", "slot": "slot_switch" },
  { "label": "开标方式", "field": "openMethod", "type": "radio", "width": "50%", "source": "openMethodList", "slot": "openMethod" },
  { "label": "比价需要审核", "field": "priceAudit", "type": "", "width": "50%", "slot": "slot_switch" }
]









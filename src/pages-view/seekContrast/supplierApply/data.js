// [
//   {
//     field: "billNo",
//     title: "报价单号",
//     width: 190,
//     minWidth: 70,
//     resizable: false,
//     fixed: "left",
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: 'createUserName',
//     title: '创建人',
//     width: 160,
//     minWidth: 70,
//     align: 'left',
//     sortable: true,
// },
//   {
//     field: "createTime",
//     title: "单据时间",
//     width: 170,
//     minWidth: 70,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },


//   {
//     field: "submissionTime",
//     title: "提交时间",
//     width: 170,
//     minWidth: 70,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: 'auditorName',
//     title: '审核人',
//     width: 160,
//     minWidth: 70,
//     align: 'left',
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "auditDate",
//     title: "审核时间",
//     width: 170,
//     minWidth: 70,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: 'createUserName',
//     title: '报价人',
//     width: 160,
//     minWidth: 70,
//     align: 'left',
//     sortable: true,
//     visible: true,
//   },
//   {
//     field: "auditDate",
//     title: "报价时间",
//     width: 170,
//     minWidth: 70,
//     align: "left",
//     sortable: true,
//     visible: true,
//   },



// {
//   field: 'supplierBillNo',
//   title: '供应商编码',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// },
// {
//   field: 'businessLicense',
//   title: '供应商名称',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// },
// {
//   field: 'fromBillNo',
//   title: '询价单号',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// },
// {
//   field: 'projectName',
//   title: '询价项目名称',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: false,
// },
// {
//   field: 'quotedSupplierNum',
//   title: '本次报价轮次',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// },
// {
//   field: 'deadlineQuoteDate',
//   title: '报价截止时间',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// }
// ,
// {
//   field: 'quoteFlagName',
//   title: '参与报价',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// }
// ,
// {
//   field: 'quoteDescription',
//   title: '报价说明',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// }
// ,
// {
//   field: 'untaxAmount',
//   title: '不含税总价',
//   width: 160,
//   minWidth: 70,
//   align: 'right',
//   sortable: true,
//   visible: true,
// }
// ,
// {
//   field: 'taxRate',
//   title: '税额',
//   width: 160,
//   minWidth: 70,
//   align: 'right',
//   sortable: true,
//   visible: true,
// }
// ,
// {
//   field: 'amount',
//   title: '含税总金额',
//   width: 160,
//   minWidth: 70,
//   align: 'right',
//   sortable: true,
//   visible: true,
// }
// ,
// {
//   field: 'amountName',
//   title: '金额大写',
//   width: 160,
//   minWidth: 70,
//   align: 'left',
//   sortable: true,
//   visible: true,
// }
// ];

// [
//   {
//     label: "报价单号",
//     field: "billNo",
//     type: "input",
//     isDefault: true,
//   },
//   {
//     label: '报价时间',
//     fields: ['beginAuditDate', 'endAuditDate'],
//     type: 'datePicker',
//     isDefault: true,
//   },

//   {
//     label: "询价项目名称",
//     field: "projectName",
//     type: "input",
//     isDefault: true,
//   },
//   {
//     label: "供应商名称",
//     field: "businessLicense",
//     type: "input",
//     isDefault: true,
//   },
//   {
//     label: '报价截止时间',
//     fields: ['beginDeadlineQuoteDate', 'endDeadlineQuoteDate'],
//     type: 'datePicker',
//     isDefault: false,
//   }
//   ,
//     {
//     label: "含税总金额",
//     fields: ["beginAmount", "endAmount"],
//     type: "numberRange",
//     isDefault: false,
//   },
//   {
//     label: "询价单号",
//     field: "fromBillNo",
//     type: "input",
//     isDefault: false,
//   }
// ]



[
  { "label": "报价单号", "field": "billNo", "type": "input", "isDefault": true },
  { "label": "报价时间", "fields": ["beginAuditDate", "endAuditDate"], "type": "datePicker", "isDefault": true },
  { "label": "询价项目名称", "field": "projectName", "type": "input", "isDefault": true },
  { "label": "供应商名称", "field": "businessLicense", "type": "input", "isDefault": true },
  { "label": "报价状态", "field": "quoteState", "fieldName": "quoteStateName", "type": "select", "source": "quoteState", "output": "string" },
  { "label": "报价截止时间", "fields": ["beginDeadlineQuoteDate", "endDeadlineQuoteDate"], "type": "datePicker", "isDefault": false },
  { "label": "含税总金额", "fields": ["beginAmount", "endAmount"], "type": "numberRange", "isDefault": false },
  { "label": "询价单号", "field": "fromBillNo", "type": "input", "isDefault": false }
]



[
  { "field": "billNo", "title": "报价单号", "width": 190, "minWidth": 70, "resizable": false, "fixed": "left", "align": "left", "sortable": true, "visible": true },
  { "field": "createUserName", "title": "报价人", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryStateName", "title": "项目状态", "width": 120, "minWidth": 70, "align": "left", "sortable": true, "visible": true, "slots": { "default": "enquiryState" } },
  { "field": "quoteStateName", "title": "报价状态", "minWidth": 120, "align": "left", "sortable": true, "visible": true },
  { "field": "auditDate", "title": "报价时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "businessLicense", "title": "供应商名称", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "enquiryApplyBillNo", "title": "询价单号", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "projectName", "title": "询价项目名称", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": false },
  { "field": "currentEnquiryTimes", "title": "本次询价轮次", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "endQuoteTime", "title": "报价截止时间", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "quoteFlagName", "title": "参与报价", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "quoteDescription", "title": "报价说明", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "untaxAmount", "title": "不含税总价", "width": 160, "minWidth": 70, "align": "right", "sortable": true, "visible": true },
  { "field": "taxAmount", "title": "税额", "width": 160, "minWidth": 70, "align": "right", "sortable": true, "visible": true },
  { "field": "amount", "title": "含税总金额", "width": 160, "minWidth": 70, "align": "right", "sortable": true, "visible": true },
  { "field": "amountName", "title": "金额大写", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "createUserName", "title": "创建人", "width": 160, "minWidth": 70, "align": "left", "sortable": true },
  { "field": "createTime", "title": "单据时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "submissionTime", "title": "提交时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditorName", "title": "审核人", "width": 160, "minWidth": 70, "align": "left", "sortable": true, "visible": true },
  { "field": "auditDate", "title": "审核时间", "width": 170, "minWidth": 70, "align": "left", "sortable": true, "visible": true }
]










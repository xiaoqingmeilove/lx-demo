[
  {
    field: "billStateName",
    title: "单据状态",
    width: 100,
    minWidth: 100,
    align: "left",
    slots: { default: "billState" },
  },
  {
    field: "billNo",
    title: "竞价核价单号",
    width: 170,
    minWidth: 100,
    align: "left",
  },
  {
    field: "createTime",
    title: "单据时间",
    width: 170,
    minWidth: 100,
    align: "left",
  },
  {
    field: 'createUserName',
    title: '申请人', 
    width: 160, 
    minWidth: 100, 
    align: 'left', 
},

  {
    field: "submissionTime",
    title: "提交时间",
    width: 170,
    minWidth: 100,
    align: "left",
  },
  {
    field: "auditDate",
    title: "审核时间",
    width: 170,
    minWidth: 100,
    align: "left",
  },
  {
    field: 'auditorName',
    title: '审核人', 
    width: 160, 
    minWidth: 100, 
    align: 'left', 
  },
  {
    field: 'projectBillNo',
    title: '竞价项目编号', 
    width: 170, 
    minWidth: 100, 
    align: 'left', 
  },

{
  field: 'projectName',
  title: '项目名称', 
  width: 160, 
  minWidth: 100, 
  align: 'left', 
},
{
  field: 'projectStatusName',
  title: '项目状态', 
  width: 130, 
  minWidth: 100, 
  align: 'left',
},
{
  field: 'biddingDirectionName',
  title: '竞价方向', 
  width: 160, 
  minWidth: 100, 
  align: 'left', 
  sortable: true,
  visible: true,
},
{
  field: 'signUpDeadlineTime',
  title: '报名截止时间',
  width: 170, 
  align: 'left',
},
{
  field: 'beginTime',
  title: '竞价开始时间',
  minWidth: 170, 
  align: 'left',
},
{
  field: 'endTime',
  title: '竞价截止时间',
  minWidth: 170, 
  align: 'left',
},
{
  field: 'pricingDeadlineTime',
  title: '核价截止时间',
  width: 170, 
  align: 'left',
},{
  field: 'promulgateTime',
  title: '中标公示时间',
  width: 170, 
  align: 'left',
},
{
  field: 'reviewFlag',
  title: '是否需要资格预审',
  minWidth: 160, 
  align: 'left',
  slots: {
      default: 'slot_Flag'
  }
},
{
  field: 'involvedFlag',
  title: '报名资格确认',
  minWidth: 160, 
  align: 'left',
  slots: {
      default: 'involvedFlag'
  }
},
{
  field: 'supplierNum',
  title: '参与招投标供应商总数',
  minWidth: 180, 
  align: 'left',
},
];

[
  {
    label: "竞价核价单号",
    field: "billNo",
    type: "input",
    isDefault: true,
  },
  {
    label: "单据状态",
    field: "billStateList",
    type: "selectmulti",
    isDefault: true,
    source: "billStatelist",
    output: "string",
  },
  {
    label: '单据时间',
    fields: ['beginCreateTime', 'endCreateTime'],
    type: 'datePicker',
    isDefault: true,
  },
  {
    label: '提交时间',
    fields: ['beginSubmissionTime', 'endSubmissionTime'],
    type: 'datePicker',
    isDefault: true,
  },
  {
    label: '审核时间',
    fields: ['beginAuditDate', 'endAuditDate'],
    type: 'datePicker',
    isDefault: false,
  },
  {
    label: "申请人",
    field: "createUserName",
    type: "input",
    isDefault: false,
  },
  {
    label: "审核人",
    field: "auditorName",
    type: "input",
    isDefault: false,
  },
  {
    label: "竞价项目",
    field: "projectName",
    type: "input",
    isDefault: false,
  },
  {
    label: '竞价申请日期',
    fields: ['beginApplyTime', 'endApplyTime'],
    type: 'datePicker',
    isDefault: false,
  },
  {
    label: '报名截止时间',
    fields: ['beginSignUpDeadlineTime', 'endSignUpDeadlineTime'],
    type: 'datePicker',
    isDefault: false,
  },
]
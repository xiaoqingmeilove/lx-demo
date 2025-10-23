[
    {"label":"采购需求单号","field":"billNo","type":"input","isDefault":true},
    {"label":"采购需求名称","field":"procurementName","type":"input","isDefault":true},
    {"label":"单据状态","field":"billStateList","type":"selectmulti","isDefault":true,"source":"statelist","output":"string"},
    {"label":"是否紧急","field":"urgentFlag","type":"select","isDefault":true,"source":"yesNoList"},
    {"label":"申请部门","field":"purchaseDeptName","type":"input","isDefault":false},
    {"label":"申请人","field":"createUserName","type":"input","isDefault":false},
    {"label":"申请时间","fields":["beginCreateTime","endCreateTime"],"type":"datePicker","isDefault":false},
    {"label":"需求类型","field":"procurementTypeList","type":"selectmulti","isDefault":false,"source":"procurementTypeList","output":"string"},
    {"label":"项目名称","field":"projectName","type":"input","isDefault":false}
]
// {"label":"寻源状态","field":"sourcingMethodList","type":"selectmulti","isDefault":false,"source":"sourcingMethodList","output":"string"},

[
    {"field":"urgentFlag","title":"是否紧急","width":"100","minWidth":"100","fixed":"left","align":"left","sortable":true,"visible":true,"slots":{"default":"urgentFlag"}},
    {"field":"billNo","title":"采购需求单号","width":"190","minWidth":"100","fixed":"left","align":"left","sortable":true,"visible":true,"slots":{"default":"billNo"}},
    {"field":"procurementName","title":"采购需求名称","minWidth":"100","fixed":"left","align":"left","sortable":true,"visible":true},
    {"field":"projectName","title":"项目名称","minWidth":"100","fixed":"left","align":"left","sortable":true,"visible":true},
    {"field":"procurementTypeName","title":"需求类型","minWidth":"100","fixed":"left","align":"left","sortable":true,"visible":true},
    {"field":"purchaseDeptName","title":"申请部门","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"createUserName","title":"申请人","width":"130","minWidth":"100","align":"left","sortable":true},
    {"field":"createTime","title":"申请时间","width":"170","minWidth":"100","align":"left","sortable":true,"visible":true},
    {"field":"billStateName","title":"单据状态","width":"110","minWidth":"100","fixed":"right","align":"left","sortable":true,"slots":{"default":"billState"},"visible":true},
    {"field":"sourcingMethodName","title":"寻源状态","width":"110","minWidth":"100","align":"left","sortable":true,"visible":true}
]





// [
//     {"label":"申请单号","field":"billNo","type":"input","isDefault":true},
//     {"label":"单据状态","field":"billStateList","type":"selectmulti","isDefault":true,"source":"statelist","output":"string"},
//     {"label":"单据时间","fields":["beginCreateTime","endCreateTime"],"type":"datePicker","isDefault":true},
//     {"label":"提交时间","fields":["beginSubmissionTime","endSubmissionTime"],"type":"datePicker","isDefault":true},
//     {"label":"审核时间","fields":["beginAuditDate","endAuditDate"],"type":"datePicker","isDefault":false},
//     {"label":"申请人","field":"createUserName","type":"input","isDefault":false},
//     {"label":"审核人","field":"auditorName","type":"input","isDefault":false},
//     {"label":"采购申请人","field":"purchaseSubUserName","type":"input","isDefault":false},
//     {"label":"采购申请部门","field":"purchaseDeptName","type":"input","isDefault":false},
//     {"label":"采购申请日期","fields":["beginPurchaseSubTime","endPurchaseSubTime"],"type":"datePicker","isDefault":false},
//     {"label":"采购预算金额","fields":["beginAmount","endAmount"],"type":"numberRange","isDefault":false}
// ]


// [
//     {"field":"billNo","title":"申请单号","width":"190","minWidth":"70","fixed":"left","align":"left","sortable":true,"visible":true},
//     {"field":"purchaseDeptName","title":"采购部门","width":"160","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"purchaseSubUserName","title":"采购申请人","width":"160","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"purchaseSubTime","title":"采购申请日期","width":"160","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"clientName","title":"申请公司","width":"160","minWidth":"70","align":"left","sortable":true,"visible":false},
//     {"field":"amount","title":"采购预算金额","width":"160","minWidth":"70","align":"right","sortable":true,"visible":true},
//     {"field":"purchaseRequestDescription","title":"采购申请说明","width":"160","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"sourcingMethodName","title":"寻源方式","width":"160","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"supplierName","title":"供应商","width":"160","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"confirmedSupplierName","title":"确认供应商名称","width":"160","minWidth":"70","align":"left","sortable":true,"visible":false},
//     {"field":"inquiryStateName","title":"询价进度","width":"160","minWidth":"70","align":"left","sortable":true,"visible":false},
//     {"field":"purchaseStateName","title":"采购进度","width":"160","minWidth":"70","align":"left","sortable":true,"visible":false},
//     {"field":"billStateName","title":"单据状态","width":"100","minWidth":"100","fixed":"right","align":"left","sortable":true,"slots":{"default":"billState"},"visible":true},
//     {"field":"createTime","title":"单据时间","width":"170","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"submissionTime","title":"提交时间","width":"170","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"auditDate","title":"审核时间","width":"170","minWidth":"70","align":"left","sortable":true,"visible":true},
//     {"field":"createUserName","title":"创建人","width":"160","minWidth":"70","align":"left","sortable":true},
//     {"field":"auditorName","title":"审核人","width":"160","minWidth":"70","align":"left","sortable":true,"visible":true}
// ]
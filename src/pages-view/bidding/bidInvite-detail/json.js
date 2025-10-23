[
    {"title":"需求池流水号","field":"businessBillNo","align":"left","width":170},
    {"title":"采购商品","field":"materialName","align":"left","width":150},
    {"title":"物料类型","field":"materialTypeName","align":"left","width":120},
    {"title":"物料编码","field":"materialCode","align":"left","width":150},
    {"title":"型号","field":"model","align":"left","width":150},
    {"title":"规格","field":"standard","align":"left","width":120},
    {"title":"电压","field":"voltageLevel","align":"left","width":150},
    {"title":"属性","field":"attribute","align":"left","width":150},
    {"title":"单位","field":"unit","align":"left","width":150},
    {"title":"申请数量","field":"qty","align":"right","width":120,"slots":{"default":"slot_edit_number"}},
    {"title":"预算单价(不含税)","field":"untaxPrice","align":"right","width":150,"params":{"displayDigits":4}},
    {"title":"税率(%)","field":"taxRate","align":"right","width":120, "params": {  "source": "taxRateList" }, "slots": { "default": "slot_edit_select" }},
    {"title":"预算单价(含税)","field":"price","align":"right","width":150,"params":{"displayDigits":4}},
    {"title":"预算金额(不含税)","field":"untaxAmount","align":"right","width":150,"params":{"displayDigits":4,"addFooter":true}},
    {"title":"预算金额(含税)","field":"amount","align":"right","width":150,"params":{"displayDigits":4,"addFooter":true}},
    {"title":"最晚到货时间","field":"latestArrivalDate","align":"left","width":170,"slots":{"default":"slot_edit_date"}},
    {"title":"收货区域","field":"areaCodeList","align":"left","width":310,"slots":{"default":"slot_areaCodeList"}},
    {"title":"收货地址","field":"deliveryAddress","align":"left","width":150,"slots":{"default":"slot_edit_input"}},
    {"title":"收货人","field":"receiving","align":"left","width":150,"slots":{"default":"slot_edit_input"}},
    {"title":"收货电话","field":"receivingPhone","align":"left","width":150,"slots":{"default":"slot_edit_input"}}
]


[
  {"label":"项目名称", "field": "projectName", "required": true, "type": "input", "width": "33%"},
  {"label":"竞价日期", "field": "applyTime", "required": true, "type": "datetime", "width": "33%"},
  {"label":"邀请方式", "field": "inviteMethod", "fieldName": "inviteMethodName", "type": "select", "width": "33%", "source": "inviteMethodList" },
  {"label":"询价员","field":"inquiryUser","fieldName":"inquiryUserName","type":"select","width":"33%","source":"inquiryUserList"},
  {"label":"联系电话","field":"linkerTel","required":true,"type":"input","width":"33%"},
  {"label":"竞价说明", "field": "describeRemark", "type": "textarea", "width": "99%"  }
]


[
  {"label":"是否需要资格预审","field":"reviewFlag","required":true,"type":"radio","width":"33%","source":"flagList"},
  {"label":"竞价方向","field":"biddingDirectionCode","fieldName":"biddingDirectionName","type":"radio","source":"biddingDirectionList","width":"66%"},
  {"label":"每次出价间隔","field":"","type":"","width":"99%","slot":"bid_interval"},
  {"label":"截止时间","field":"","type":"","width":"99%","slot":"deadline"},
  {"label":"投标人报价查看范围","field":"buddingViewFlag","fieldName":"buddingViewFlagName","type":"radio","width":"99%","source":"buddingViewList"},
  {"label":"允许提交相同报价","field":"sameQuotationFlag","fieldName":"sameQuotationFlagName","required":true,"type":"radio","width":"99%","source":"sameQuotationList"},
  {"label":"拒绝投标是否需要说明原因","field":"rejectReasonFlag","type":"radio","width":"33%","source":"rejectReasonFlagList"}
]


[
  {"field":"materialName","title":"物料名称","minWidth":"100","align":"left"},
  {"field":"materialTypeName","title":"物料分类","minWidth":"100","align":"left"},
  {"field":"model","title":"型号","minWidth":"100","align":"left"},
  {"field":"standard","title":"规格","minWidth":"100","align":"left"},
  {"field":"voltageLevel","title":"电压","minWidth":"100","align":"left"},
  {"field":"attribute","title":"属性","minWidth":"100","align":"left"},
  {"field":"unit","title":"单位","minWidth":"100","align":"left"},
  {"field":"warrantyDuration","title":"质保期(天)","minWidth":"100","align":"right","params":{"required":true},"slots":{"default":"slot_edit_integerNumber","header":"slot_header"}},
  {"field":"qty","title":"询价数量","minWidth":"100","align":"right","params":{"required":true},"slots":{"default":"slot_edit_integerNumber","header":"slot_header"}},
  {"field":"latestArrivalDate","title":"最晚到货时间","width":"180","minWidth":"100","align":"left","params":{"required":true},"slots":{"default":"slot_edit_date","header":"slot_header"}},
  {"field":"materialCode","title":"物料代码","minWidth":"100","align":"left"},
  {"field":"price","title":"预算单价","minWidth":"100","align":"right","params":{"displayDigits":2,"required":true},"slots":{"default":"slot_edit_number","header":"slot_header"}},
  {"field":"amount","title":"预算金额","minWidth":"100","align":"right","params":{"displayDigits":2}}
]

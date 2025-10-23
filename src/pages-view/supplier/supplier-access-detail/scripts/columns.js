// [
//     {"title":"商品状态","field":"status","align":"left","width":100,"slots":{"default":"status"}},
//     {"title":"商品类型","field":"productType","align":"left","width":150},
//     {"title":"采购商品","field":"materialName","align":"left","width":120},
//     {"title":"物料编码","field":"materialCode","align":"left","width":150},
//     {"title":"型号","field":"model","align":"left","width":150},
//     {"title":"规格","field":"standard","align":"left","width":120},
//     {"title":"电压","field":"voltageLevel","align":"left","width":150},
//     {"title":"属性","field":"attribute","align":"left","width":150},
//     {"title":"采购最小量","field":"qty","align":"right","width":120},
//     {"title":"单位","field":"unit","align":"left","width":150},
//     {"title":"预计单价","field":"price","align":"left","width":150,"params":{"displayDigits":4},"slots":{"default":"slot_edit_number"}},
//     {"title":"税率(%)","field":"taxRate","align":"right","width":120,"params":{"percent":true},"slots":{"default":"slot_edit_number"}},
//     {"title":"是否集中收货","field":"batchGoodsFlag","align":"left","width":130,"slots":{"default":"flagSlots"}},
//     {"title":"是否集中付款","field":"batchPaymentFlag","align":"left","width":130,"slots":{"default":"flagSlots"}},
//     {"title":"图片","field":"listUrl","align":"left","width":150},
//     {"title":"收货地址","field":"areaCodeListName","align":"left","width":150},
//     {"title":"收货人","field":"receiving","align":"left","width":150},
//     {"title":"收货电话","field":"receivingPhone","align":"left","width":150},
//     {"title":"商城上架","field":"groundingFlag","align":"left","width":100,"slots":{"default":"groundingFlag"}},
//     {"title":"商品描述","field":"materialRemark","align":"left","width":120}
// ];



[
    {"title":"商品状态","field":"status","align":"left","width":100,"slots":{"default":"status"}},
    {"title":"物料分类","field":"materialTypeName","align":"left","minWidth":100},
    {"title":"物料名称","field":"materialName","align":"left","minWidth":100},
    {"title":"物料代码","field":"materialCode","align":"left","minWidth":100},
    {"title":"型号","field":"model","align":"left","minWidth":100},
    {"title":"规格","field":"standard","align":"left","minWidth":100},
    {"title":"电压","field":"voltageLevel","align":"left","minWidth":100},
    {"title":"属性","field":"attribute","align":"left","width":80},
    {"title":"采购最小量","field":"qty","align":"right","width":100,"params":{"displayDigits":2},"slots":{"default":"slot_edit_number"}},
    {"title":"单位","field":"unit","align":"left","width":100},
    {"title":"含税单价","field":"price","align":"right","width":150,"minWidth":100,"params":{"displayDigits":4},"slots":{"default":"slot_edit_number"}},
    {"title":"不含税单价","field":"unTaxPrice","align":"right","width":150,"minWidth":100,"params":{"displayDigits":4}},
    {"title":"税率(%)","field":"taxRate","align":"right","width":150,"minWidth":100,"params":{"displayDigits":2},"slots":{"default":"slot_edit_number"}},
    {"title":"操作","field":"action","align":"left","width":100,"minWidth":100,"fixed":"right","slots":{"default":"action"}}
]

[
    {"title":"开户银行","field":"bankName","align":"left","minWidth":150,"slots":{"default":"slot_edit_input","header":"slot_required"}},
    {"title":"银行账号","field":"accountNo","align":"left","minWidth":150,"slots":{"default":"slot_edit_input","header":"slot_required"}},
    {"title":"银行开户名","field":"accountName","align":"left","minWidth":150,"slots":{"default":"slot_edit_input","header":"slot_required"}},
    {"title":"联行号","field":"branchCode","align":"left","minWidth":150,"slots":{"default":"slot_edit_input","header":"slot_required"}},
    {"title":"是否默认开户行","field":"defaultFlag","align":"left","minWidth":150,"slots":{"default":"slot_edit_flag"}},
    {"title":"操作","field":"action","align":"left","width":120,"slots":{"default":"action"}}
]


[
    {"title":"姓名","field":"name","align":"left","minWidth":150,"slots":{"default":"slot_edit_input","header":"slot_required"}},
    {"title":"手机号","field":"mobile","align":"left","minWidth":150,"slots":{"default":"slot_edit_input","header":"slot_required"}},
    {"title":"电子邮箱","field":"email","align":"left","minWidth":150,"slots":{"default":"slot_edit_input"}},
    {"title":"职位","field":"jobTitle","align":"left","minWidth":150,"slots":{"default":"slot_edit_input"}},
    {"title":"部门","field":"department","align":"left","minWidth":150,"slots":{"default":"slot_edit_input"}},
    {"title":"联系人详细地址","field":"deliveryAddress","align":"left","minWidth":150,"slots":{"default":"slot_edit_input"}},
    {"title":"是否默认联系人","field":"defaultFlag","align":"left","minWidth":150,"slots":{"default":"slot_edit_flag"}},
    {"title":"操作","field":"action","align":"left","width":120,"slots":{"default":"action"}}
]

[
    {"title":"证书名称","field":"certificateName","align":"left","width":230,"minWidth":130},
    {"title":"证书类型","field":"certificateTypeName","align":"left","width":230,"minWidth":130},
    {"title":"附件","field":"fileList","align":"left","minWidth":150,"slots":{"default":"fileList"}},
    {"title":"到期日期","field":"expireDate","align":"left","width":190, "slots":{"default":"expireDate"}},
    {"title":"操作","field":"action","align":"left","width":120,"slots":{"default":"action"}}
]
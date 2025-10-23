const columns = [
    {"field":"billNo","title":"流水号","width":190,"minWidth":100,"align":"left","slots":{"default":"billNo"}},
    {"field":"createUserName","title":"提交人","minWidth":100,"align":"left"},
    {"field":"submissionTime","title":"提交时间","width":170,"align":"left"},
    {"field":"updateTime","title":"更新时间","width":170,"align":"left"},
    {"field":"status","title":"商品状态","width":100,"align":"left","slots":{"default":"status"}},
    {"field":"supplierName","title":"供应商名称","minWidth":100,"width":150,"align":"left"},
    {"field":"materialTypeName","title":"物料分类","width":120,"minWidth":100,"align":"left"},
    {"field":"materialName","title":"物料名称","minWidth":100,"width":150,"align":"left"},
    {"field":"materialCode","title":"物料编码","minWidth":100,"width":150,"align":"left"},
    {"field":"model","title":"型号","width":150,"minWidth":100,"align":"left"},
    {"field":"standard","title":"规格","width":130,"minWidth":100,"align":"left"},
    {"field":"voltageLevel","title":"电压","width":130,"minWidth":100,"align":"left"},
    {"field":"attribute","title":"属性","width":80,"minWidth":100,"align":"left"},
    {"field":"qty","title":"采购最小量","minWidth":100,"align":"right"},
    {"field":"unit","title":"单位","minWidth":120,"align":"left"},
    {"field":"price","title":"含税单价","minWidth":120,"align":"right","params":{"displayDigits":4}},
    {"field":"taxRate","title":"税率(%)","minWidth":120,"align":"right","params":{"displayDigits":2}},
    {"field":"batchGoodsFlag","title":"是否集中收货","width":130,"align":"left","visible":false,"slots":{"default":"slot_flag"}},
    {"field":"batchPaymentFlag","title":"是否集中付款","width":130,"align":"left","visible":false,"slots":{"default":"slot_flag"}},
    {"field":"groundingFlag","title":"商城上架","width":100,"align":"left","visible":false,"slots":{"default":"groundingFlag"}},
    {"field":"remark","title":"商品描述","width":150,"align":"left","visible":false}
]


export {
    columns,
}

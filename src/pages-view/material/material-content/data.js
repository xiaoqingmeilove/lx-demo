[
    {"label":"物料分类","field":"materialTypeId","type":"","source":"materialTypeList","width":"33%","slot":"select_tree","width":"33%"}
]


[
    {"label":"物料代码","field":"materialCode","type":"input","width":"33%"},
    {"label":"物料名称","field":"materialName","type":"input","width":"33%"},
    {"label":"助记码","field":"mnemonicCode","type":"input","width":"33%"},

    {"label":"型号","field":"model","type":"input","width":"33%"},
    {"label":"规格","field":"standard","type":"input","width":"33%"},
    {"label":"电压等级","field":"voltageLevel","type":"selectinput2","width":"33%", "source":"voltageLevelList"},

    {"label":"标准类型","field":"standardType","type":"input","width":"33%"},
    {"label":"颜色","field":"attribute","type":"input","width":"33%"},
    {"label":"包装规格","field":"packSpecial","type":"input","width":"33%"},

    {"label":"物料获取方式","field":"purchaseType","fieldName":"purchaseType","type":"selectinput","width":"33%","source":"purchaseTypeList"},
    {"label":"数量精度","field":"qtyAccuracy","type":"number", "digits": 4, "precision": 4, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"单价精度","field":"priceAccuracy","type":"number", "digits": 4, "precision": 4, "formatterName": "toFixedNumber","width":"33%"},

    {"label":"基本计量单位","field":"unit","type":"select","width":"33%","source":"unitList"},
    {"label":"采购计量单位","field":"purchaseUnit","type":"select","width":"33%","source":"unitList"},
    {"label":"采购计量单位换算率","field":"purchaseUnitConversion","type":"number","width":"33%"},
    
    {"label":"计划单价","field":"planPrice","type":"number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"核算价","field":"accountPrice","type":"number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"基础价","field":"basicPrice","type":"number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"最高存量","field":"highestStock","type":"number","width":"33%"},
    {"label":"最低存量","field":"minimumStock","type":"number","width":"33%"},
    {"label":"安全库存数量","field":"safeStock","type":"number","width":"33%"},
    {"label":"物料描述","field":"remark","type":"textarea","width":"99%"}
]


// 物料代码 -- 电压等级  不可修改
[
    {"label":"物料代码","field":"materialCode","type":"","width":"33%"},
    {"label":"物料名称","field":"materialName","type":"","width":"33%"},
    {"label":"助记码","field":"mnemonicCode","type":"input","width":"33%"},

    {"label":"型号","field":"model","type":"","width":"33%"},
    {"label":"规格","field":"standard","type":"","width":"33%"},
    {"label":"电压等级","field":"voltageLevel","type":"selectinput2","width":"33%", "source":"voltageLevelList"},

    {"label":"标准类型","field":"standardType","type":"input","width":"33%"},
    {"label":"颜色","field":"attribute","type":"input","width":"33%"},
    {"label":"包装规格","field":"packSpecial","type":"input","width":"33%"},

    {"label":"物料获取方式","field":"purchaseType","fieldName":"purchaseType","type":"selectinput","width":"33%","source":"purchaseTypeList"},
    {"label":"数量精度","field":"qtyAccuracy","type":"number", "digits": 4, "precision": 4, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"单价精度","field":"priceAccuracy","type":"number", "digits": 4, "precision": 4, "formatterName": "toFixedNumber","width":"33%"},

    {"label":"基本计量单位","field":"unit","type":"select","width":"33%","source":"unitList"},
    {"label":"采购计量单位","field":"purchaseUnit","type":"select","width":"33%","source":"unitList"},
    {"label":"采购计量单位换算率","field":"purchaseUnitConversion","type":"number","width":"33%"},
    
    {"label":"计划单价","field":"planPrice","type":"number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"核算价","field":"accountPrice","type":"number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"基础价","field":"basicPrice","type":"number", "digits": 2, "precision": 2, "formatterName": "toFixedNumber","width":"33%"},
    {"label":"最高存量","field":"highestStock","type":"input","width":"33%"},
    {"label":"最低存量","field":"minimumStock","type":"input","width":"33%"},
    {"label":"安全库存数量","field":"safeStock","type":"input","width":"33%"},
    {"label":"物料描述","field":"remark","type":"textarea","width":"99%"}
]


[
    {"label":"是否盘具","field":"dishFlag","slot":"slot_checkbox","width":"33%"},
    {"label":"是否导体","field":"conductorFlag","slot":"slot_checkbox","width":"33%"},
    {"label":"是否虚拟物料","field":"virtualFlag","slot":"slot_checkbox","width":"33%"},
    {"label":"是否电线产品","field":"wireProductFlag","slot":"slot_checkbox","width":"33%"},
    {"label":"是否禁用","field":"status","slot":"slot_checkbox","width":"33%"},
    {"label":"附件","field":"fileList","type":"","width":"99%", "slot": "fileList"}
]
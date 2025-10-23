const searchOptions = [
  {"label":"供应商编号","field":"billNo","type":"input","placeholder":"请输入供应商编号","isDefault":true},
  {"label":"供应商名称","field":"supplierName","type":"input","placeholder":"请输入供应商名称","isDefault":true},
  {"label":"物料名称","field":"materialName","type":"input","placeholder":"请输入物料名称","isDefault":true},
  {"label":"商品状态","field":"status","type":"select","output":"string","placeholder":"请选择商品状态","source":"statuslist","isDefault":true},
  {"label":"型号","field":"model","type":"input","placeholder":"请输入型号"},
  {"label":"规格","field":"standard","type":"input","placeholder":"请输入规格"},
  {"label":"电压","field":"voltageLevel","type":"input","placeholder":"请输入电压"},
  {"label":"属性","field":"attribute","type":"input","placeholder":"请输入属性"}
]
export { searchOptions }
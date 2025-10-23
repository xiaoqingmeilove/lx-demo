const columns = [
  {
    field: "selectbox",
    type: "checkbox",
    fixed: "left",
    width: 60,
    minWidth: 50,
    align: "center",
  },
  {
    field: "title",
    title: "表头展示名(必填)",
    minWidth: 70,
    width: 150,
   
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "field",
    title: "英文字段名(必填/不可重复)",
    minWidth: 70,
    width: 150,
   
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "fixed",
    title: "默认固定方式(不必填)",
    width: 150,
    minWidth: 70,
    width: 150,
    align: "left",
    slots: { default: "fixed" }, //插槽下拉
  },
  {
    field: "width",
    title: "默认宽度(必填)",
    minWidth: 70,
    width: 150,
    align: "left",
    slots: { default: "slot_edit_number" },
  },
  {
    field: "minWidth",
    title: "最小宽度(必填)",
    minWidth: 70,
    width: 150,
    align: "left",
    slots: { default: "slot_edit_number" },
  },
  {
    field: "resizable",
    title: "是否可拖动大小(默认支持)",
    minWidth: 70,
    width: 150,
   
    align: "left",
    slots: { default: "slot_edit_enable" },
  },
  {
    field: "visible",
    title: "默认是否展示(默认展示)",
    minWidth: 70,
    width: 150,
   
    align: "left",
    slots: { default: "slot_edit_enable" },
  },
  {
    field: "align",
    title: "居中方式(必填)",
    minWidth: 70,
    width: 150,
    align: "left",
    slots: { default: "align" },
  },
  {
    field: "sortable",
    title: "是否支持排序(不必填)",
    minWidth: 70,
    width: 150,
    align: "left",
    slots: { default: "slot_edit_enable" },
  },
  {
    field: "filterEnabled",
    title: "是否支持筛选",
    minWidth: 70,
    width: 150,
    align: "left",
  },
  {
    field: "slots",
    title: "插槽",
    minWidth: 70,
    width: 150,
    align: "left",
    slots: { default: "slot_edit_slots" },
  },
  {
    field: "params",
    title: "其他配置(params)",
    minWidth: 70,
    width: 150,
    align: "left",
  },
];
const formColumns = [
  {
    field: "selectbox",
    type: "checkbox",
    fixed: "left",
    width: 150,
    minWidth: 120,
    align: "center",
  },
  {
    field: "label",
    title: "表单展示名(必填)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "field",
    title: "英文字段名(必填)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "type",
    title: "类型(默认展示)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "slots",
    title: "插槽",
    minWidth: 70,
    width: 150,
    align: "left",
  },
  {
    field: "source",
    title: "下拉框/选择框列表",
    minWidth: 70,
    width: 150,
    align: "left",
  },
  {
    field: "required",
    title: "必填信息",
    minWidth: 70,
    width: 150,
    align: "left",
  },
  {
    field: "digits",
    title: "小数位(数字框)",
    minWidth: 70,
    width: 150,
    align: "left",
  },
  {
    field: "width",
    title: "宽(整行100%)",
    minWidth: 70,
    width: 150,
    align: "left",
  }
];
const headerList = [
  {label:'表头标红',value:'header-red'},
  {label:'列粘贴(普通修改)',value:'slot_header'},
  {label:'列粘贴(单价修改)',value:'slot_header_price'},
 ]
 const defaultList = [
  {label:'序号',value:'rowNum'},
  {label:'单据状态展示',value:'billState'},
  {label:'明细条数',value:'unconvention'},
  {label:'技术附件展示',value:'quotedBillFileId'},
  {label:'数字输入框',value:'slot_edit_number'},
  {label:'文字输入框',value:'slot_edit_input'},
  {label:'文本输入框',value:'slot_edit_textarea'},
 ];

 const searchColumns = [
  {
    field: "selectbox",
    type: "checkbox",
    fixed: "left",
    width: 150,
    minWidth: 120,
    align: "center",
  },
  {
    field: "label",
    title: "搜索展示名(必填)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "field",
    title: "英文字段名(单个)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "fields",
    title: "英文字段名(多个)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "type",
    title: "类型(默认展示)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_input" },
  },
  {
    field: "isDefault",
    title: "是否默认展示(初始化展示)",
    minWidth: 70,
    align: "left",
    slots: { default: "slot_edit_enable" },
  }
 ]
export { columns ,headerList,defaultList,formColumns,searchColumns};

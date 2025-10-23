// { label: '用户名', field: 'username', required: true, type: 'input' },
// { label: '手机号', field: 'phone', required: true, type: 'input' },
// { label: '年龄', field: 'age', type: 'input' },
// { label: '性别', field: 'gender', type: 'radio', source: 'gender' },
// { label: '占位', visible: false, span: 2 },
// { label: '说明', field: 'instruction', type: 'input' },
// { label: '余额', field: 'balance', type: 'number', formatterName: 'toFixedNumber', digits: 2 },
// { label: '地址', field: 'address', type: 'textarea', span: 4 },
// { label: '颜色', field: 'color', type: 'select', source: 'color' },
// { label: '备注', field: 'remark', type: 'input' },
// { label: '等级', field: 'level', type: 'input', formatterName: 'level' },
// { label: '日期', field: 'date', type: 'date' },
// { label: '启用', field: 'enable', slot: 'enable' },
// { label: '联系人', field: 'contacts', slot: 'contacts' },


const descItems1 = [
  { label: '菜单id', field: 'id',type: '' },
  { label: '菜单名称', field: 'menuName',type: 'input' },
  { label: '名称', field: 'name',type: 'input' },
  { label: '企业代码', field: 'corpCode',type: 'selectinput',source: "corpCodeList"},
  { label: '菜单code', field: 'code',type: 'input' },
  { label: '配置类型', field: 'configType',type: 'selectinput',source: "configTypeList"},
];

export { descItems1 };

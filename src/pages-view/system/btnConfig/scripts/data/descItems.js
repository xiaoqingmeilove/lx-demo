

const descItems = [
  // {
  //   label: "菜单标识",
  //   field: "menuComponent",
  //   type: "",
  // },
  {
    label: "菜单名称",
    field: "menuName",
    type: "input",
  },
  {
    label: "Groovy-ID",
    field: "scriptId",
    type: "input",
  },
  {
    label: "SQL-ID",
    field: "tableConfigId",
    type: "input",
  },
];

const formConfig = {
  editMenu: {
    gather: [
      {
        config: [
          { label: "菜单名称", field: "menuName", type: "input" },
          { label: "Groovy-ID", field: "scriptId", type: "selectinput", source: "scriptIdList" },
          { label: "SQL-ID", field: "tableConfigId", type: "selectinput", source: "tableConfigIdList" },
        ],
      },
    ],
    rules: {
      scriptId: [{ required: true, message: "请输入Groovy-ID" }],
      tableConfigId: [{ required: true, message: "请输入SQL-ID" }],
    }
  },
  menu: {
    gather: [
      {
        config: [
          { label: "按钮名称", field: "btnName", type: "input" },
          { label: "按钮类型", field: "btnCode", type: "input" },
          // { label: "按钮ID", field: "uuid", type: "input" },
          { label: "按钮方法", field: "funName", type: "input" },
          { label: "父级id", field: "parentId", type: "selectinput", source: "parentList", props: { clearable: true } },
          { label: "显示逻辑", field: "scriptAlgorithmId", type: "selectinput", source: "algorithmList", props: { clearable: true, multiple: true } },
          { label: "是否展示", field: "defaultView", type: "selectinput", source: "defaultViewList" }
        ],
      },
    ],
    rules: {
      btnName: [{ required: true, message: "请输入按钮名称" }],
      btnCode: [{ required: true, message: "请输入按钮类型" }],
      // uuid: [{ required: true, message: "请输入按钮ID" }],
    }
  },
  sql: {
    gather: [
      {
        config: [
          // { label: "ID", field: "id", type: "input" },
          { label: "SQL脚本", field: "sql", type: "input" },
          { label: "备注", field: "remark", type: "input" },
        ],
      },
    ],
    rules: {
      id: [{ required: true, message: "请输入ID" }],
      sql: [{ required: true, message: "请输入SQL脚本" }],
    }
  },
  groovy: {
    gather: [
      {
        config: [
          // { label: "ID", field: "id", type: "" },
          { label: "Groovy脚本地址", field: "path", type: "input" },
          { label: "method-name", field: "methodName", type: "input" },
          { label: "备注", field: "remark", type: "input" },
        ],
      },
    ],
    rules: {
      // id: [{ required: true, message: "请输入ID" }],
      path: [{ required: true, message: "请输入Groovy脚本地址" }],
      methodName: [{ required: true, message: "请输入method-name" }],
    }
  },
  rule: {
    gather: [
      {
        config: [
          // { label: "ID", field: "id", type: "input" },
          // { label: "name", field: "name", type: "input" },
          { label: "Rule-type", field: "scriptType", type: "input" },
          { label: "表达式", field: "scriptCriteria", type: "input" },
          { label: "表达式汉译", field: "scriptCriteriaEsc", type: "input" },
          // { label: "作用范围", field: "scriptCriteriaEsc", type: "select",source: "scriptCriteriaEscList" },
        ],
      },
    ],
    rules: {}
  },
  dynamic: {
    gather: [
      {
        config: [
          { label: "字段属性", field: "type", type: "input" },
          { label: "所属类型", field: "columnConfig", type: "input" },
          { label: "备注", field: "remark", type: "input" },
        ],
      },
    ],
    rules: {
    }
  },
};


export { descItems, formConfig };

import moment from "moment";
import {
  columns,
  groovyColumns,
  sqlColumns,
  ruleColumns,
  trendsColumns,
} from "./scripts/data/column";
import { ApiSystem } from "@/apis";
import { mapState } from "vuex";
import XEUtils from "xe-utils";
import { descItems, formConfig } from "./scripts/data/descItems";
import VXETable from "vxe-table";

const apiSystem = new ApiSystem();

const getList = {
  menu: "getMenuList",
  sql: "getSqlList",
  groovy: "getGroovyList",
  rule: "getRuleList",
  dynamic: "getDynamicList",
};
const addEvent = {
  menu: "addMenuBtn",
  sql: "addSql",
  groovy: "addGroovy",
  rule: "addRule",
  dynamic: "addDynamic",
};
const deleteApi = {
  menu: "deleteMenuList",
  sql: "deleteTableConfigList",
  groovy: "deleteScriptList",
  rule: "deleteScriptAlgorithmList",
  dynamic: "deleteFieldConfigList",
};

let maximizeTable = null;
export default {
  watch: {},
  components: {},
  computed: {
    ...mapState({
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    bindColumns() {
      return this.columns ?? [];
    },
    showTitle() {
      let id =
        this.activeTab == "menu" ? this.addMenuObj?.uuid : this.addMenuObj?.id;
      return id ? "修改" : "新增";
    },
    showdefaultView() {
      return (code) => {
        let find = this.descSourceList.defaultViewList.find(x => x.value === code);
        return find ? find.label : "无";
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      descItems,
      defaultColumns: [],
      columns, //一览表表头信息,
      groovyColumns,
      sqlColumns,
      ruleColumns,
      trendsColumns,
      dict,
      tableData: [],
      filterText: null,
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeData: [],
      activeTab: "menu",
      sysMenuId: null,
      menuData: {
        buttonDetails: [],
      },
      groovyData: {},
      sqlData: {},
      ruleDate: {},
      dynamicData: {},
      menuFormVisible: false,
      addMenuObj: {},
      addGather: [],
      addRules: {},
      editMenuFormVisible: false,
      ditMenuFormObj: {},
      ditMenuFormGather: [],
      ditMenuFormRules: {},
      formConfig,
      descSourceList: {
        defaultViewList: [
          {
            label: "根据逻辑展示",
            value: "0",
          },
          {
            label: "永不展示",
            value: "1",
          },
          {
            label: "永远展示",
            value: "2",
          },
        ],
      },
    };
  },
  created() { },
  mounted() { },
  activated() {
    this.init();
    this.getSelectList();
  },
  watch: {
    filterText(val) {
      this.$refs.roleTree.filter(val);
    },
  },
  methods: {
    getSelectList() {
      apiSystem.getAlgorithmList().then((res) => {
        if (res.code == 200) {
          let descSourceList = { ...this.descSourceList };
          descSourceList.algorithmList = res.data.map((d) => {
            return {
              label: d.scriptCriteriaEsc,
              value: d.id,
            };
          });
          this.descSourceList = { ...descSourceList };
        } else {
          this.$message.error(res.message);
        }
      });
      let obj = {
        page: 1,
        size: 1000,
      };
      apiSystem
        .getScriptList(obj).then(res => {
          if (res.code == 200) {
            let descSourceList = { ...this.descSourceList };
            descSourceList.scriptIdList = (res.data?.records ?? []).map((d) => {
              return {
                label: d.remark,
                value: d.id,
              };
            });
            this.descSourceList = { ...descSourceList };
          } else {
            this.$message.error(res.message);
          }
        })

      let data = {
        page: 1,
        size: 1000,
      };
      apiSystem
        .getTableConfigList(obj).then(res => {
          if (res.code == 200) {
            let descSourceList = { ...this.descSourceList };
            descSourceList.tableConfigIdList = (res.data?.records ?? []).map((d) => {
              return {
                label: d.remark,
                value: d.id,
              };
            });
            this.descSourceList = { ...descSourceList };
          } else {
            this.$message.error(res.message);
          }
        })
    },
    deleteClick(row) {
      if (deleteApi[this.activeTab]) {
        VXETable.modal
          .confirm({
            title: "确认",
            content: "确认删除？",
            mask: true,
          })
          .then(async (type) => {
            if (type === "confirm") {
              const loading = this.$loading({
                lock: true,
                text: "删除中",
                spinner: "el-icon-loading",
              });
              let obj = {
                id: this.activeTab == "menu" ? row.uuid : row.id,
              };
              if (this.activeTab == "menu") {
                obj.masterId = this.menuData.id;
              }
              apiSystem[deleteApi[this.activeTab]](obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$message.success(res.message);
                    this.tabClick({ name: this.activeTab });
                  } else {
                    this.$message.error(res.message);
                  }
                })
                .finally(() => {
                  loading.close();
                });
            }
          });
      }
    },
    editMenu() {
      this.ditMenuFormObj = { ...this.menuData };
      this.ditMenuFormGather = this.formConfig.editMenu?.gather ?? [];
      this.ditMenuFormRules = this.formConfig.editMenu?.rules ?? {};
      this.editMenuFormVisible = true;
    },
    editMenuFormOk(data) {
      const loading = this.$loading({
        lock: true,
        text: "修改中",
        spinner: "el-icon-loading",
      });
      apiSystem
        .putMenuForm(data)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.editMenuFormVisible = false;
            this.getMenuList();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    addBtnClick(add = false, row = {}) {
      if (add) {
        this.addMenuObj = {
          defaultView: "0"
        };
      } else {
        this.addMenuObj = { ...row };
      }
      this.addGather = this.formConfig[this.activeTab]?.gather ?? [];
      this.addRules = this.formConfig[this.activeTab]?.rules ?? {};
      this.menuFormVisible = true;
    },
    addMenuBtn(data) {
      let obj = {};
      if (data.uuid) {
        //修改
        let menuData = { ...this.menuData };
        let buttonDetails = [...menuData.buttonDetails];
        buttonDetails = buttonDetails.map((item) => {
          if (item.uuid === data.uuid) {
            item = { ...item, ...data };
          }
          return item;
        });
        obj = {
          ...menuData,
          buttonDetails: [...buttonDetails],
        };
      } else {
        //新增
        obj = {
          ...this.menuData,
          buttonDetails: [...this.menuData.buttonDetails, ...[data]],
        };
      }
      const loading = this.$loading({
        lock: true,
        text: "添加中",
        spinner: "el-icon-loading",
      });
      apiSystem
        .putMenuBtn(obj)
        .then((res) => {
          if (res.code == 200) {
            this.menuFormVisible = false;
            this.$message.success(res.message);
            this.getMenuList();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    addSql(data) {
      let obj = { ...data };
      let api = data.id ? "putTableConfigList" : "postTableConfigList";
      apiSystem[api](obj).then((res) => {
        if (res.code == 200) {
          this.menuFormVisible = false;
          this.$message.success(res.message);
          this.getSqlList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addGroovy(data) {
      let obj = { ...data };
      let api = data.id ? "putScriptList" : "postScriptList";
      apiSystem[api](obj).then((res) => {
        if (res.code == 200) {
          this.menuFormVisible = false;
          this.$message.success(res.message);
          this.getGroovyList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addRule(data) {
      let obj = { ...data };
      let api = data.id ? "putScriptAlgorithmList" : "postScriptAlgorithmList";
      apiSystem[api](obj).then((res) => {
        if (res.code == 200) {
          this.menuFormVisible = false;
          this.$message.success(res.message);
          this.getRuleList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addDynamic(data) {
      let obj = {
        ...data,
        columnConfig: JSON.parse(data.columnConfig),
      };
      let api = data.id ? "putFieldConfigList" : "postFieldConfigList";
      apiSystem[api](obj).then((res) => {
        if (res.code == 200) {
          this.menuFormVisible = false;
          this.$message.success(res.message);
          this.getDynamicList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addOk(data) {
      let funName = addEvent[this.activeTab];
      if (funName) {
        let fn = this[funName];
        fn && fn(data);
      }
    },
    tabClick(tab, event) {
      const { name } = tab;
      let funName = getList[name];
      if (funName) {
        let fn = this[funName];
        fn && fn();
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (data.hierarchicalType == "C") {
        this.sysMenuId = data.id;
        this.getMenuList();
      }
    },
    init() {
      this.getTreeList();
    },
    getDynamicList() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let obj = {
        page: 1,
        size: 1000,
      };
      apiSystem
        .getFieldConfigList(obj)
        .then((res) => {
          if (res.code === 200) {
            this.dynamicData = {
              ...res.data,
              records: (res.data?.records ?? []).map((item) => {
                item.columnConfig = JSON.stringify(item.columnConfig);
                return item;
              }),
            };
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    getRuleList() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let obj = {
        page: 1,
        size: 1000,
      };
      apiSystem
        .getScriptAlgorithmList(obj)
        .then((res) => {
          if (res.code === 200) {
            this.ruleDate = {
              ...res.data,
              records: res.data?.records ?? [],
            };
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    getGroovyList() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let obj = {
        page: 1,
        size: 1000,
      };
      apiSystem
        .getScriptList(obj)
        .then((res) => {
          if (res.code === 200) {
            this.groovyData = {
              ...res.data,
              records: res.data?.records ?? [],
            };
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    getSqlList() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let obj = {
        page: 1,
        size: 1000,
      };
      apiSystem
        .getTableConfigList(obj)
        .then((res) => {
          if (res.code === 200) {
            this.sqlData = {
              ...res.data,
              records: res.data?.records ?? [],
            };
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    getMenuList() {
      if (!this.sysMenuId) {
        this.$message.error("请选择左侧菜单！");
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let obj = {
        sysMenuId: this.sysMenuId,
      };
      apiSystem
        .getBtnDetailList(obj)
        .then((res) => {
          if (res.code === 200) {
            this.menuData = {
              ...res.data,
              buttonDetails: res.data?.buttonDetails ?? [],
            };
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
      apiSystem.getMenuParentList(obj).then((res) => {
        if (res.code == 200) {
          let descSourceList = { ...this.descSourceList };
          descSourceList.parentList = res.data.map((d) => {
            return {
              label: d.btnName,
              value: d.uuid,
            };
          });
          this.descSourceList = { ...descSourceList };
        } else {
          this.$message.error(res.message);
        }
      });
      this.getSelectList();
      // apiSystem.getAlgorithmList().then((res) => {
      //   if (res.code == 200) {
      //     let descSourceList = { ...this.descSourceList };
      //     descSourceList.algorithmList = res.data.map((d) => {
      //       return {
      //         label: d.scriptCriteriaEsc,
      //         value: d.id,
      //       };
      //     });
      //     this.descSourceList = { ...descSourceList };
      //   } else {
      //     this.$message.error(res.message);
      //   }
      // });
    },
    getTreeList() {
      apiSystem.getBtnConfigTreeList().then((res) => {
        if (res.code === 200 && res.data) {
          this.treeData = [...res.data];
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};

import moment from "moment";
import { ApiSystem } from "@/apis";
import { mapState } from "vuex";
import XEUtils from "xe-utils";
import VXETable from "vxe-table";
import { MaximizeTable, handleStorageColumns } from "@/utils/vxe-table";
import {
  columns,
  nameList,
  codeList,
  corpCodeList,
  configTypeList,
} from "./scripts/data/column";
let maximizeTable = null;

const apiSystem = new ApiSystem();

export default {
  watch: {},
  components: {},
  computed: {
    ...mapState({
      userInfo: (state) => state.User.userInfo ?? {},
    }),
    bindColumns() {
      let columns = [...this.columns];
      columns.forEach((item) => {
        if (item.filterEnabled) {
          item.filters = this.handColumns(item);
        }
      });
      return columns;
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      showEdit:localStorage.getItem("showConfig")  ?? false,
      condition: {},
      searchOptions: [
        {
          label: "名称",
          field: "name",
          type: "input",
          isDefault: true,
        },
        {
          label: "企业代码",
          field: "corpCode",
          type: "input",
          isDefault: true,
        },
        {
          label: "配置类型",
          field: "configType",
          type: "input",
          isDefault: true,
        },
        {
          label: "菜单code",
          field: "code",
          type: "input",
          isDefault: true,
        },
      ],
      sysMenuObj: {},
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeData: [],
      tableData: [],
      columns,
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        
        showTotal: () => `共${this.pagination.total}条`,
        
      }, // 一览表分页配置
      filterText: null,
      defaultColumns: [],
      addressRules: {
        menuId: [{ required: true, message: "请输入菜单id" }],
        menuName: [{ required: true, message: "请输入菜单名称" }],
        name: [{ required: true, message: "请输入名称" }],
        corpCode: [{ required: true, message: "请输入企业代码" }],
        configType: [{ required: true, message: "请输入配置类型" }],
        columns: [{ required: true, message: "请输入列属性明细" }],
        code: [{ required: true, message: "请输入菜单code" }],
      },
      addressObj: {},
      addressFormVisible: false,
      addressDataGather: [
        {
          config: [
            { label: "菜单id", field: "menuId", type: "input" },
            {
              label: "菜单名称",
              field: "menuName",
              type: "input",
            },
            {
              label: "名称",
              field: "name",
              type: "selectinput",
              props: { allowCreate: true, placeholder: "请输入或选择" },
              source: "nameList",
            },
            {
              label: "企业代码",
              field: "corpCode",
              type: "selectinput",
              source: "corpCodeList",
            },
            {
              label: "配置类型",
              field: "configType",
              type: "selectinput",
              source: "configTypeList",
            },
            {
              label: "列属性明细",
              field: "columns",
              type: "textarea",
            },
            {
              label: "请输入菜单code",
              field: "code",
              type: "selectinput",
              props: { allowCreate: true, placeholder: "请输入或选择" },
              source: "codeList",
            },
          ],
        },
      ],
      editressRules: {
        menuId: [{ required: true, message: "请输入菜单id" }],
        menuName: [{ required: true, message: "请输入菜单名称" }],
        name: [{ required: true, message: "请输入名称" }],
        corpCode: [{ required: true, message: "请输入企业代码" }],
        configType: [{ required: true, message: "请输入配置类型" }],
        columns: [{ required: true, message: "请输入列属性明细" }],
        code: [{ required: true, message: "请输入菜单code" }],
      },
      editressObj: {},
      editressFormVisible: false,
      editressDataGather: [
        {
          config: [
            { label: "菜单id", field: "menuId", type: "input" },
            {
              label: "菜单名称",
              field: "menuName",
              type: "input",
            },
            {
              label: "名称",
              field: "name",
              type: "input",
            },
            {
              label: "企业代码",
              field: "corpCode",
              type: "selectinput",
              source: "corpCodeList",
            },
            {
              label: "配置类型",
              field: "configType",
              type: "selectinput",
              source: "configTypeList",
            },
            {
              label: "列属性明细",
              field: "columns",
              type: "textarea",
            },
            {
              label: "请输入菜单code",
              field: "code",
              type: "input",
            },
          ],
        },
      ],
      descSourceList: {
        corpCodeList: [...corpCodeList],
        nameList: [...nameList],
        codeList: [...codeList],
        configTypeList: [...configTypeList],
      },
    };
  },
  created() {},
  mounted() {
    const { table, toolbar } = this.$refs;
    if (table) {
      table.connect(toolbar);
      this.initTable();
    }
    this.defaultColumns = XEUtils.clone(this.columns, true);
    maximizeTable = new MaximizeTable(this.$refs.tableSection.$el);
  },
  activated() {
    this.init();
  },
  watch: {
    filterText(val) {
      this.$refs.roleTree.filter(val);
    },
  },
  methods: {
    onSearch(value) {
      this.condition = { ...value };
      this.getDateList();
    },
    onReset() {
      this.condition = {};
      this.getDateList();
    },
    // 搜索展开
    onExpand() {},
    handColumns(item) {
      let list = this.tableData ?? [];
      const valMap = [];
      const filter_method = {};
      const fn = filter_method[item.field];
      return list.reduce((result, x) => {
        if (!valMap.includes(x[item.field])) {
          valMap.push(x[item.field]);
          if (fn) {
            fn(result, item, x);
          } else {
            result.push({
              label: x[item.field],
              value: x[item.field],
            });
          }
        }
        return result;
      }, []);
    },
    // 一览表双击事件
    onCellDbClick(e) {
      const { row } = e;
      // if (row.configType !== "table") {
      //   this.$message.error("暂不支持修改非表格配置");
      //   return;
      // }
      this.$router.push({
        path: `/system/tableHeaderConfig-detail/detail/${row.id}`,
      });
    },
    addOk(data) {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      if(false){
        this.descSourceList.corpCodeList.forEach((item) => {
          let obj = {
            menuId: data.menuId,
            menuName: data.menuName,
            name: data.name,
            columns: JSON.parse(data.columns),
            code: data.code,
            corpCode: item.value,
            configType: data.configType,
          };
          apiSystem
            .postTableColumnConfigList(obj)
            .then((res) => {
              if (res.code == 200) {
                this.addressFormVisible = false;
                this.$message.success(res.message);
                this.init();
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => {
              loading.close();
            });
        })
      }else{
        let obj = {
          menuId: data.menuId,
          menuName: data.menuName,
          name: data.name,
          columns: JSON.parse(data.columns),
          code: data.code,
          corpCode: data.corpCode,
          configType: data.configType,
        };
        apiSystem
          .postTableColumnConfigList(obj)
          .then((res) => {
            if (res.code == 200) {
              this.addressFormVisible = false;
              this.$message.success(res.message);
              this.init();
            } else {
              this.$message.error(res.message);
            }
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    addBtnClick() {
      this.addressObj = {
        menuId: this.sysMenuObj.id ?? null,
        menuName: this.sysMenuObj.name ?? null,
      };
      this.addressFormVisible = true;
    },
    editOk(data) {
      let obj = {
        id: data.id,
        menuId: data.menuId,
        menuName: data.menuName,
        name: data.name,
        corpCode: data.corpCode,
        code: data.code,
        columns: JSON.parse(data.columns),
        configType: data.configType,
      };
      apiSystem.putTableColumnConfig(obj).then((res) => {
        if (res.code == 200) {
          this.editressFormVisible = false;
          this.$message.success(res.message);
          this.init();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    copyBtnClick(row){
      this.addressObj = {
        menuId: this.sysMenuObj.id ?? null,
        menuName: this.sysMenuObj.name ?? null,
        name: row?.name ?? '',
        configType: row?.configType?? '',
        columns: row?.columns?? '',
        code: row?.code?? '',
      };
      this.addressFormVisible = true;
    },
    editBtnClick(row) {
      this.editressObj = { ...row };
      this.editressFormVisible = true;
    },
    deleteClick(row) {
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
              id: row.id,
            };
            apiSystem
              .deleteTableColumn(obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.message);
                  this.init();
                } else {
                  this.$message.error(res.message);
                }
              })
              .finally(() => {
                loading.close();
              });
          }
        });
    },
    // 一览表分页change事件
    pageChange(e) {
      const { pageSize, currentPage } = e;
      this.pagination = {
        ...this.pagination,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getDateList();
    },
    initTable() {
      const { table } = this.$refs;
      const tableColumns = columns.map((item) => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits);
          };
        }
        return item;
      });
      this.columns = handleStorageColumns(tableColumns, table.id);
    },
    onToolOk(e) {
      const { type, data } = e;
      const fn = this.toolMethods()[type];
      fn && fn(data);
    },
    toolMethods() {
      return {
        maximize: (data) => {
          const { maximize } = data;
          if (maximize) {
            maximizeTable.maximize();
          } else {
            maximizeTable.restoreTable();
          }
        },
      };
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (data.hierarchicalType == "C") {
        this.sysMenuObj = { ...data };
        this.getDateList();
      }
    },
    getDateList() {
      // 获取表格数据
      let data = {
        ...this.condition,
        page: 1,
        size: 100,
        menuId: this.sysMenuObj.id,
      };
      apiSystem.getTableColumnConfigList(data).then((res) => {
        if (res.code == 200 && res.data) {
          this.tableData = (res.data.records ?? []).map((x) => {
            return {
              ...x,
              columns: JSON.stringify(x.columns),
            };
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    init() {
      this.getTreeList();
      this.getDateList();
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

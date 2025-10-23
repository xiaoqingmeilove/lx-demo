import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiSeek } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import VXETable from "vxe-table";
import columnPasting from "@/pages-components/columnPasting/index.vue";
const apiQuotation = new ApiQuotation();
const apiSeek = new ApiSeek();
export default {
  components: { columnPasting },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      activeName: 'jbxx',
      menuCode: "seekContrast_seekWinBid",
      fileBillTpye: "SW",
      id: null,
      lztVisible: false,
      lztColumn: {},
      lztLoadText: "",
      lztText: "",
      editState: false,
      form: {
        detailList: [],
      },
      formDataShow: {
        cgmx: false,
        fjcz: true,
        gysbjqd: true,
        zbjg: true,
      },
      defaultColumns: [],
      columns: [],
      supplierColumns: [],
      defaultSupplierColumns: [],
      mergeCells: [],
      summaryColumns:[],
      defaultSummaryColumns: [],
      rulesobj: {},
      descItems: [],
      descSourceList: {
        fileList: [],
        awardMethodList: (dict["award_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        bidResultList: (dict["bid_result"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        supplierList: [],
      },
    };
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    if (this.editState) {
      // 离开
      let state = await this.closePage();
      state ? next() : next(false);
    } else {
      next();
    }
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    // 离开-同模块
    if (this.editState) {
      let state = await this.closePage();
      state ? next() : next(false);
    } else {
      next();
    }
  },
  async beforePageLeave(tab, type) {
    let state = null;
    if (this.editState && !["unload", "leave"].includes(type)) {
      state = await this.closePage();
    }
    return new Promise((resolve, reject) => {
      if (["unload", "leave"].includes(type)) {
        resolve();
      } else {
        if (this.editState) {
          state ? resolve() : reject();
        } else {
          resolve();
        }
      }
    });
  },
  created() {},
  mounted() {},
  activated() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
    }
    this.setColumn();
  },
  methods: {
    bidResultChange(e, row, rowIndex) {},
    onInputBlurFormChange(e) {},
    async closePage() {
      const res = await VXETable.modal.confirm({
        title: "提示",
        content: "存在修改状态页面，请确认是否保存！",
        mask: true,
        confirmButtonText: "保存",
      });
      if (res === "confirm") {
        // 修改关闭保存
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        if (this.editState && this.id) {
          const submitRes = await apiSeek.putResultConfim(this.form);
          loading.close();
          if (submitRes.code === 200) {
            this.editState = false;
            this.$message.success("保存成功");
            return true;
          } else {
            this.$message.error(submitRes.message, "修改失败系统异常");
            return false;
          }
        }
      }
      if (res === "cancel") {
        this.cancel();
        return true;
      }
    },
    integerInputChage(row, rowIndex, field) {
      row[field] = XEUtils.round(row[field], 0);
    },
    // 表格小数位控制
    getDigits(field) {
      let item = this.summaryColumns.find((x) => x.field === field);
      const { params = {} } = item;
      return item && item.params && params.hasOwnProperty("displayDigits")
        ? item.params.displayDigits
        : 0;
    },
    editForm() {
      this.editState = true;
    },
    cancel() {
      this.editState = false;
      this.init();
    },
    // 保存
    submit() {
      this.editBill();
    },
    editBill() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiSeek
        .putResultConfim(this.form)
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.editState = false;
            this.init();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = file.fileList.map((item) => {
        return {
          label: item.originalFileName,
          value: item.id + "",
          fileName: item.fileName,
          filePath: item.filePath,
          url: item?.url,
          quotedBillFileId: item?.quotedBillFileId,
        };
      });
    },
    init() {
      this.getDetail();
    },
    getDetail() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let id = this.id;
      apiSeek
        .getSeekWinBidDetail({ id })
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.form = { ...res.data };
           
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },

    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let data = {
        code: "detailList,supplierDetailList,summaryDetailList",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
      if (res.code === 200 && res.data) {
        let columns = res.data.detailList.columns;
        let supplierColumns = res.data.supplierDetailList.columns;
        let summaryColumns = res.data.summaryDetailList.columns;
        this.columns = [...columns];
        this.supplierColumns = [...supplierColumns];
        this.summaryColumns = [...summaryColumns];
        this.initTableConfig();
      }
      let dataForm = {
        code: "detailForm",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfig(
        this.menuCode,
        dataForm
      );
      if (resform.code === 200 && resform.data && resform.data.columns) {
        let dataItems = resform.data.columns;
        this.descItems = [...dataItems];
      }

      setTimeout(() => {
        loading.close();
      }, 1000);
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }
      const { suppliertable, suppliertoolbar } = this.$refs;
      if (suppliertable) {
        suppliertable.connect(suppliertoolbar);
        this.initSupplierTable();
      }

      const { summarytable, summarytoolbar } = this.$refs;
      console.log(summarytable,'summarytable')
      if (summarytable) {
        summarytable.connect(summarytoolbar);
        this.initSummaryTable();
      }



      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultSupplierColumns = XEUtils.clone(this.supplierColumns, true);
      this.defaultSummaryColumns = XEUtils.clone(this.summaryColumns, true);
    },
    initSummaryTable() {
      const { summarytable } = this.$refs;
      const tableColumns = this.summaryColumns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.summaryColumns = handleStorageColumns(tableColumns, summarytable.id);
    },
    initSupplierTable() {
      const { suppliertable } = this.$refs;
      const tableColumns = this.supplierColumns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.supplierColumns = handleStorageColumns(tableColumns, suppliertable.id);
    },
    initTable() {
      const { table } = this.$refs;
      const tableColumns = this.columns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.columns = handleStorageColumns(tableColumns, table.id);
    },
    onSummaryToolOk(e) {
      const { type, data } = e;
      const fn = this.toolSummaryMethods()[type];
      fn && fn(data);
    },
    toolSummaryMethods() {
      return {
        set_column: ({ columns }) => {
          this.summaryColumns = columns;
        },
      };
    },
    onSupplierToolOk(e) {
      const { type, data } = e;
      const fn = this.toolSupplierMethods()[type];
      fn && fn(data);
    },
    toolSupplierMethods() {
      return {
        set_column: ({ columns }) => {
          this.supplierColumns = columns;
        },
      };
    },
    onToolOk(e) {
      const { type, data } = e;
      const fn = this.toolMethods()[type];
      fn && fn(data);
    },
    toolMethods() {
      return {
        set_column: ({ columns }) => {
          this.columns = columns;
        },
      };
    },
    validFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.dataForm.validate((valid) => {
          resolve(valid);
        });
      });
    },
    async onSubmitBtnClick() {
      this.beforeSubmit();
    },

    onWorkflowOk() {
      //TODO 刷新表单数据
      this.init();
    },
    async beforeSubmit() {
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return false;
      }
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiSeek
          .putResultConfim(this.form)
          .then((res) => {
            if (res.code === 200 && res.data) {
              this.editState = false;
            } else {
              this.$message.error(res.message);
              return false;
            }
          })
          .finally(() => {
            loading.close();
          });
      }
      this.onSubmitExamine();
    },
    async onSubmitExamine() {
      const { workflow } = this.$refs;
      const { workflow: workflowComponent } = workflow?.$refs;
      workflowComponent && workflowComponent.submitWorkflow();
    },
    lztClose() {
      this.lztVisible = false;
      this.lztColumn = {};
      this.lztLoadText = "";
    },
    lztOpen(column) {
      if (!this.editState) return;
      this.lztVisible = true;
      this.lztColumn = column;
      const { visibleData } = this.$refs.summaryTable.getTableData();
      let list = [...visibleData];
      this.lztLoadText = (list ?? []).map((x) => x[column.field]).join("\n");
    },
    async lztOk(ztList) {
      const { field } = this.lztColumn;
      const { visibleData, tableData } = this.$refs.summaryTable.getTableData();
      if (ztList.length) {
        ztList.forEach((item, index) => {
          if (visibleData[index]) {
            visibleData[index][field] =
              this.lztColumn &&
              this.lztColumn.params &&
              this.lztColumn.params.displayDigits
                ? XEUtils.toFixed(item, this.lztColumn.params.displayDigits)
                : item;
          }
        });
        this.$message.success("操作成功");
        this.lztText = "";
        this.lztVisible = false;
        this.lztColumn = {};
        this.lztLoadText = "";
      }
    },
    upDownMove(e, rowIndex, columnIndex, column) {
      this.inputFocus(e, rowIndex, columnIndex, column);
    },
    inputFocus(e, rowIndex, columnIndex, column) {
      const { code } = e;
      const { summaryTable } = this.$refs;
      const max_row = this.form.summaryList.length;
      const max_column = this.summaryColumns.length;

      //
      const container =
        column.fixed === "left"
          ? summaryTable.$el.querySelector(".vxe-table--fixed-left-wrapper")
          : column.fixed === "right"
          ? summaryTable.$el.querySelector(".vxe-table--fixed-right-wrapper")
          : summaryTable.$el;

      handleNextFocus(
        container,
        code,
        rowIndex,
        columnIndex,
        max_row,
        max_column
      );
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: "el-icon-loading",
      });
      return loading;
    },
  },
};

import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiSeek } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import VXETable from "vxe-table";
import columnPasting from "@/pages-components/columnPasting/index.vue";
import SplicinAddress from "@/pages-components/splicinAddress/index.vue";

const apiQuotation = new ApiQuotation();
const apiSeek = new ApiSeek();
export default {
  components: { columnPasting, SplicinAddress },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      moment,
      activeName: 'jbxx',
      delayVisible: false,
      delayObj: {},
      delayDataGather: [
        {
          config: [{ label: "延期至", field: "time", type: "datetime" }],
        },
      ],
      delayRules: {
        time: [{ required: true, message: "请选择时间" }],
      },
      menuCode: "seekContrast_enquiryHall",
      fileBillTpye: "SE",
      id: null,
      lztVisible: false,
      lztColumn: {},
      lztLoadText: "",
      lztText: "",
      allBtnControlList: [],
      editState: false,
      form: {
        detailList: [],
      },
      formDataShow: {
        cgmx: true,
        fjcz: true,
        gysbjqd: true,
      },
      backForm: {},
      columns: [],
      supplierColumns: [],
      rulesobj: {},
      descItems: [],
      descSourceList: {
        fileList: [],
      },
      defaultColumns: [],
      defaultSupplierColumns: [],
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
  created() { },
  mounted() { },
  activated() {
    this.getSelectList();
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
    }
    this.setColumn();
  },
  methods: {
    accept() {
      this.$confirm(`确认参与【${this.form.projectName??this.form.billNo}】项目的报价?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.acceptFn();
      });
    },
    acceptFn() {
      const loading = this.$loading({
        lock: true,
        text: "参与报名中...",
        spinner: "el-icon-loading",
      });
      apiSeek.postEnquiryHallsignUp({ id: this.id }).then((res) => {
        if (res.code === 200) {
          this.$message.success("参与报名成功!");
          this.init();
          loading.close();
        } else {
          this.$message.error(res.message);
          loading.close();
        }
      }).finally(() => {
        loading.close();
      });
    },
    reject() {
      this.$confirm(`确认拒绝【${this.form.projectName??this.form.billNo}】项目的报价?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rejectFn();
      });
    },
    rejectFn() {
      const loading = this.$loading({
        lock: true,
        text: "拒绝报名中...",
        spinner: "el-icon-loading",
      });
      apiSeek.postEnquiryHallreject({ id: this.id }).then((res) => {
        if (res.code === 200) {
          this.$message.success("拒绝报名成功!");
          this.init();
          loading.close();
        } else {
          this.$message.error(res.message);
          loading.close();
        }
      }).finally(() => {
        loading.close();
      });
    },
    delayOk(data) {
      const time = moment(data.time, 'YYYY-MM-DD hh:mm:ss');
      const deadlineQuoteDate = moment(this.form.deadlineQuoteDate, 'YYYY-MM-DD hh:mm:ss');
      if (time.isBefore(deadlineQuoteDate)) {
        this.$message.error("延期日期不得小于报价截止时间");
        return
      }
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
      });
      let obj = {
        id: this.form.id,
        time: data.time,
      };
      apiSeek
        .putEnquiryHallDelay(obj)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("延期成功!");
            this.delayVisible = false;
            this.init();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    delayClick() {
      this.delayVisible = true;
    },
    involvedClick() {
      VXETable.modal
        .confirm({
          title: "提示",
          content: "确定参与报价?",
          mask: true,
        })
        .then(async (type) => {
          if (type === "confirm") {
            const loading = this.$loading({
              lock: true,
              text: "提交中",
              spinner: "el-icon-loading",
            });
            apiSeek
              .postSupplierApply({ id: this.form.id })
              .then((res) => {
                if (res.code === 200 && res.data) {
                  this.$message.success("操作成功!");
                  this.$router.push({
                    path: `/seekContrast/supplierApply-detail/${res.data.billId}`,
                  });
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
    againEnquiryClick() {
      VXETable.modal
        .confirm({
          title: "提示",
          content: "确定再次询价?",
          mask: true,
        })
        .then(async (type) => {
          if (type === "confirm") {
            const loading = this.$loading({
              lock: true,
              text: "提交中",
              spinner: "el-icon-loading",
            });
            apiSeek
              .postHallAgainEnquiry({ id: this.form.id })
              .then((res) => {
                if (res.code === 200 && res.data) {
                  this.$message.success("操作成功!");
                  this.$router.push({
                    path: `/seekContrast/enquiryApply-detail/${res.data.billId}`,
                  });
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
    resultConfim() {
      VXETable.modal
        .confirm({
          title: "提示",
          content: "询价结果确认?",
          mask: true,
        })
        .then(async (type) => {
          if (type === "confirm") {
            const loading = this.$loading({
              lock: true,
              text: "提交中",
              spinner: "el-icon-loading",
            });
            apiSeek
              .postEnquiryResultConfim({ id: this.form.id })
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("操作成功!");
                  this.$router.push({
                    path: `/seekContrast/resultConfim-detail/${res.data.billId}`,
                  });
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
    // 终止
    stopEnquiry() {
      VXETable.modal
        .confirm({
          title: "终止提示",
          content: "中止后不可恢复，是否确定中止询价?",
          mask: true,
        })
        .then(async (type) => {
          if (type === "confirm") {
            const loading = this.$loading({
              lock: true,
              text: "终止中",
              spinner: "el-icon-loading",
            });
            apiSeek
              .putEnquiryHallEnd({ id: this.form.id })
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("操作成功!");
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
    getSelectList() { },
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
          const submitRes = await apiSeek.putEnquiryHall(this.form);
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
      let item = this.columns.find((x) => x.field === field);
      const { params = {} } = item;
      return item && item.params && params.hasOwnProperty("displayDigits")
        ? item.params.displayDigits
        : 0;
    },
    editForm() {
      this.backForm = XEUtils.clone(this.form, true);
      this.editState = true;
    },
    cancel() {
      this.editState = false;
      this.form = { ...this.backForm };
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
        .putEnquiryHall(this.form)
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
      this.showBtnConfig();
    },
    getDetail() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let id = this.id;
      apiSeek
        .getEnquiryHallDetail({ id })
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
    showBtnConfig() {
      let data = {
        param: {
          id: this.id ?? null,
        },
      };
      apiQuotation.postDetailBtnList(this.menuCode, data).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let data = {
        code: "detailList,supplierDetailList",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
      if (res.code === 200 && res.data) {
        let columns = res.data.detailList.columns;
        let supplierColumns = res.data.supplierDetailList.columns;
        this.columns = [...columns];
        this.supplierColumns = [...supplierColumns];
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


      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultSupplierColumns = XEUtils.clone(this.supplierColumns, true);
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
      const { visibleData } = this.$refs.table.getTableData();
      let list = [...visibleData];
      this.lztLoadText = (list ?? []).map((x) => x[column.field]).join("\n");
    },
    async lztOk(ztList) {
      const { field } = this.lztColumn;
      const { visibleData, tableData } = this.$refs.table.getTableData();
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
      const { table } = this.$refs;
      const max_row = this.form.detailList.length;
      const max_column = this.columns.length;

      //
      const container =
        column.fixed === "left"
          ? table.$el.querySelector(".vxe-table--fixed-left-wrapper")
          : column.fixed === "right"
            ? table.$el.querySelector(".vxe-table--fixed-right-wrapper")
            : table.$el;

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

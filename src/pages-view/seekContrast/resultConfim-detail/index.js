import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiSeek, ApiSystem } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import VXETable from "vxe-table";
import columnPasting from "@/pages-components/columnPasting/index.vue";
import { summaryColumns } from "./data.js";
import noticeModal from "@/pages-components/notice/notice.vue";
import { handContent } from "./helper.js";
const apiQuotation = new ApiQuotation();
const apiSeek = new ApiSeek();
const apiSystem = new ApiSystem();
export default {
  components: { columnPasting, noticeModal },
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
      activeName: 'jbxx',
      menuCode: "seekContrast_resultConfim",
      fileBillTpye: "RC",
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
        xjnr: true,
        fjcz: true,
        gysbjqd: true,
        zbjg: true,
      },
      defaultColumns: [],
      defaultSupplierColumns: [],
      columns: [],
      supplierColumns: [],
      supplierDefaultColumns: [],
      mergeCells: [],
      summaryColumns,
      summaryDefaultColumns: [],
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
      noticeVisible: false,
      noticeForm: {},
      editNoticeState: false,
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
    issueOk(data) {
      const loading = this.$loading({
        lock: true,
        text: "发布中",
        spinner: "el-icon-loading",
      });
      console.log(data, 'data');
      apiSystem.putProclamation(data).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message ?? "发布成功");
          this.getList();
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        loading.close();
      });
    },
    noticeClose() {
      this.noticeForm = {};
      this.editNoticeState = false;
      this.noticeVisible = false;
    },
    editNotice() {
      this.noticeForm = {
        deadline: moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
        officialWebsite: 1,
        content: handContent(this.form),
        relevanceProjectName: this.form.projectName,
        relevanceBillNo: this.form.billNo,
        relevanceBillType: "RC",
      };
      this.editNoticeState = true;
      this.noticeVisible = true;
    },
    bidResultChange(e, row, rowIndex) { },
    onInputBlurFormChange(e) {
      // 选中客户名称
      if (
        e &&
        e.item &&
        e.item.field == "supplierId" &&
        this.form.awardMethod == "AWARD_AS_WHOLE"
      ) {
        let summaryList = [...this.form.summaryList];
        summaryList = summaryList.map((x, y) => {
          return {
            ...x,
            bidResult: x.supplierName == e.value ? "WIN" : "LOSE",
            qty: x.supplierName == e.value ? x.fromQty : 0,
          };
        });
        this.form.summaryList = [...summaryList];
        this.handleMerges();
      }

    },
    handleMerges() {
      const merges = [];
      const fields = (this.summaryColumns || []).reduce((group, item) => {
        if (item.params && item.params.merges) {
          group.push(item.field);
        }
        return group;
      }, []);
      const tableData = [...this.form.summaryList];
      fields.forEach((field) => {
        const colIndex = this.summaryColumns.findIndex(
          (x) => x.field === field
        );
        let startRow = 0;
        let count = 1;

        for (let i = 1; i <= tableData.length; i++) {
          const item = tableData[i];
          if (
            i < tableData.length &&
            item &&
            item[field] === tableData[i - 1][field] &&
            item.fromBillId === tableData[i - 1].fromBillId
          ) {
            count++;
          } else {
            if (count > 1) {
              merges.push({
                row: startRow,
                rowspan: count,
                col: colIndex,
                colspan: 1,
              });
            }
            startRow = i;
            count = 1;
          }
        }
      });

      this.mergeCells = [...merges];
      this.$refs.summaryTable.setMergeCells(this.mergeCells);
    },
    getSelectList() { },
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
              .postResultAgainEnquiry({ id: this.form.id })
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
      apiSeek.putResultConfim(this.form).then((res) => {
        if (res.code === 200 && res.data) {
          this.editState = false;
          this.init();
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
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
        .getResultConfimDetail({ id })
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.form = { ...res.data };
            this.handleMerges();
            let supplierList = res.data.supplierList ?? [];
            let descSourceList = { ...this.descSourceList };
            descSourceList.supplierList = supplierList.map((i) => {
              return {
                label: i.supplierName,
                value: i.supplierName,
              };
            });
            this.descSourceList = { ...descSourceList };
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
        code: "detailList,supplierDetailList,",
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
    initSummaryTable() {
      const { summaryTable } = this.$refs;
      const tableColumns = this.summaryColumns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.summaryColumns = handleStorageColumns(tableColumns, summaryTable.id);
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
      // if (!this.form.detailList.length) {
      //   this.$message.warning("采购明细不能为空");
      //   return;
      // }
      // if(this.form.sourcingMethod == "single" && !this.form.supplierId){
      //   this.$message.error("单一寻源请选择供应商！");
      //   return
      // }
      // let flag = this.form.detailList.some((x) => !Number(x.qty) || !Number(x.taxRate) || !x.latestArrivalDate);
      // if (flag) {
      //   this.$message.error("请补充申请数量，税率，最晚到货时间！！");
      //   return;
      // }
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiSeek.putResultConfim(this.form).then((res) => {
          if (res.code === 200 && res.data) {
            this.editState = false;
            this.init();
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

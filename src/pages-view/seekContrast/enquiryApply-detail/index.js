import XEUtils from "xe-utils";
import moment from "moment";
import {mapState} from "vuex";
import {ApiQuotation, ApiSeek, ApiSystem} from "@/apis";
import {handleNextFocus, handleStorageColumns} from "@/utils/vxe-table";
import VXETable from "vxe-table";
import columnPasting from "@/pages-components/columnPasting/index.vue";
import supplierList from "@/pages-components/supplierList/index.vue";
import splicinAddress from "@/pages-components/splicinAddress/index.vue";
import viewAddress from "@/pages-components/viewAddress/index.vue";
import {changeTimeItems, moreEnquiryColumns} from "./loaclData";

const apiQuotation = new ApiQuotation();
const apiSeek = new ApiSeek();
const apiSystem = new ApiSystem()
export default {
  components: { columnPasting, supplierList, splicinAddress, viewAddress },
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
      changeTimeItems,
      moreEnquiryColumns,
      changeTimeForm: {},
      activeName: 'jbxx',
      addSupplierVisible: false,
      menuCode: "seekContrast_enquiryApply",
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
        ywgz: true,
        gys: true,
      },
      backForm: {},
      columns: [],
      businessRule: [],
      supplierColumns: [],
      visible: {
        viewAddressVisible: false,
        changeTimeVisible: false,
        moreEnquiryVisible: false,
      },
      rulesobj: {
        projectName: [{ required: true, message: "请输入询价项目" }],
        projectType: [{ required: true, message: "请输入项目类型" }],
        enquiryDate: [{ required: true, message: "请选择询价日期" }],
        endInvolveTime: [{ required: true, message: "请选择报名截止时间" }, {
          validator: (rule, value, callback) => {
            if (value && new Date(value) <= new Date()) {
              callback(new Error('报价截止时间必须大于当前时间'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],
        endQuoteTime: [{ required: true, message: "请选择报价截止时间" }],
        enquiryType: [{ required: true, message: "请选择询价方式" }],
        areaCodeList: [{ required: true, message: "请选择收货地址" }],
        purchaseUserName: [{ required: true, message: "请选择采购员" }]
      },
      changeTimeRules: {
        endQuoteTime: [{ required: true, message: "请选择报价截止时间" }],
        remark: [{ required: true, message: "请输入备注" }],
      },
      descItems: [],
      descSourceList: {
        fileList: [],
        inviteUserList: [],
        reminderMethodList: (dict["reminder_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),//提醒方式
        winBidTypeList: (dict["win_bid_type"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),//中标方式
        enquiryTypeList: (dict["enquiry_type"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),//询价方式
        projectTypeList: (dict["enquiry_project_type"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //项目类型
        purchaseTypeList: (dict["enquiry_purchase_type"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //采购类型
        enquiryState: (dict["enquiry_state"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        openMethodList: [
          { label: '截止时间自动开标', value: '0' },
          { label: '截止时间手动开标', value: '1' },
        ], //开标方式
      },
      defaultColumns: [],
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
          const submitRes = await apiSeek.putEnquiryApply(this.form);
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
    changeTimeSubmit() {
      this.$refs.changeTimeDataForm.validate((valid) => {
        if (valid) {
          const { endQuoteTime, remark } = this.changeTimeForm;
          const time = moment(endQuoteTime, 'YYYY-MM-DD HH:mm:ss');
          const deadlineQuoteDate = moment(this.form.endQuoteTime, 'YYYY-MM-DD HH:mm:ss');
          if (time.isBefore(deadlineQuoteDate)) {
            this.$message.error("延期日期不得小于报价截止时间");
            return
          }
          const loading = this.$loading({
            lock: true,
            text: "变更中",
            spinner: "el-icon-loading",
          });
          apiSeek.putChangeTime({ id: this.id, ...this.changeTimeForm }).then(res => {
            if (res.code === 200) {
              this.$message.success("操作成功!");
              this.init();
              this.visible.changeTimeVisible = false;
            } else {
              this.$message.error(res.message);
            }
          }).finally(() => {
            loading.close();
          });
        }
      });
    },
    moreEnquirySubmit() {
      const selectedRows = this.$refs.moreEnquiryTable.getCheckboxRecords();
      if (selectedRows.length === 0) {
        this.$message.warning("请选中需多轮询价的供应商！");
        return;
      }
      let ids = selectedRows.map((mapx) => {
        return mapx.id;
      });
      const loading = this.$loading({
        lock: true,
        text: "多轮询价中",
        spinner: "el-icon-loading",
      });
      apiSeek.postMoreEnquiry({ id: this.id, supplierIdList: ids }).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功!");
          this.init();
          this.visible.moreEnquiryVisible = false;
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        loading.close();
      });
    },
    quoteStateNameClick(row) {
      if (row.quoteState == "YBJ") {
        if (this.form.enquiryState == '3') {
          this.$router.push({
            path: `/seekContrast/supplierApply-detail/${row.quoteBillId}`,
          });
        } else {
          if (this.form.ruleMap?.sealPrice != '1') {
            this.$router.push({
              path: `/seekContrast/supplierApply-detail/${row.quoteBillId}`,
            });
          } else {
            this.$message.error("询价单未开标且密封报价，无法查看");
          }
        }
      } else {
        this.$message.error("供应商未报价，无法查看");
      }
    },
    openBidClick() {
      VXETable.modal.confirm({
        title: "提示",
        content: `报价截止时间时间为 【${this.form.endQuoteTime}】，现在是否开标?`,
        mask: true,
      }).then(async (type) => {
        if (type === "confirm") {
          const loading = this.$loading({
            lock: true,
            text: "开标中",
            spinner: "el-icon-loading",
          });
          apiSeek.postOpenBid({ id: this.form.id }).then(res => {
            if (res.code === 200) {
              this.$message.success("操作成功!");
              this.init();
            } else {
              this.$message.error(res.message);
            }
          }).finally(() => {
            loading.close();
          });
        }
      });
    },
    priceComparisonClick() {
      VXETable.modal
        .confirm({
          title: "提示",
          content: "比较报价?",
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
    stopEnquiry() {
      this.$prompt('请输入终止原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '请输入终止原因'
      }).then(({ value }) => {
        const loading = this.$loading({
          lock: true,
          text: "终止中",
          spinner: "el-icon-loading",
        });
        apiSeek.putStopEnquiry({ id: this.id, remark: value }).then(res => {
          if (res.code === 200) {
            this.$message.success("操作成功!");
            this.init();
          } else {
            this.$message.error(res.message);
          }
        }).finally(() => {
          loading.close();
        });
      })
    },
    editSupplier() {
      this.addSupplierVisible = true;
    },
    delSupplier(row, rowIndex) {
      this.form.supplierList.splice(rowIndex, 1);
    },
    addSupplierData(data) {
      const dataClone = XEUtils.clone(data || [], true);
      let form = { ...this.form };
      let supplierList = form.supplierList ?? [];
      const list = dataClone.filter(f => !supplierList.some(s => s.supplierId == f.supplierId));
      if (!list.length) {
        this.$message.warning("选择供应商已添加，请重新选择供应商");
        return
      }
      if (list) {
        list.map(item => {
          item.id = null
        })
        supplierList = supplierList.concat(list);
        form.supplierList = supplierList;
        this.form = { ...form };
        this.$message.success("添加成功");
      };
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
      this.$refs.dataForm_JBXX.validate((valid) => {
        if (valid) {
          this.editBill();
        }
      })
    },
    editBill() {
      this.form.ruleList = this.businessRule;
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiSeek.putEnquiryApply(this.form).then((res) => {
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
      this.getSelectList();
    },
    getDetail() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let id = this.id;
      apiSeek.getEnquiryApplyDetail({ id }).then((res) => {
        if (res.code === 200 && res.data) {
          this.form = { ...res.data };
          const defaultRuleMap = {
            openMethod: "1",
            priceAudit: 1,
            sealPrice: 1,
          };
          this.form.ruleMap = res.data.ruleMap && Object.keys(res.data.ruleMap).length > 0
            ? { ...defaultRuleMap, ...res.data.ruleMap } : { ...defaultRuleMap };
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        loading.close();
      });
    },
    getSelectList() {
      apiSystem.getOrderUsersList().then(res => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.inviteUserList = (res.data?.inquiryUser ?? []).map((i) => {
          return {
            ...i,
            label: i.nickName,
            value: i.nickName,
            purchaseUserId: i.userId,
            purchaseUser: i.userName,
            purchaseUserTel: i.phone,
          };
        });
        this.descSourceList = { ...descSourceList };
      })
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
        code: "detailList,detailList2",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
      if (res.code === 200 && res.data) {
        this.columns = [...res.data.detailList.columns];
        this.supplierColumns = [...res.data.detailList2.columns];
        this.initTableConfig();
      }
      let dataForm = {
        code: "detailForm,detailForm2",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfigMulti(
        this.menuCode,
        dataForm
      );
      if (resform.code === 200 && resform.data) {
        let dataItems = resform.data.detailForm.columns;
        this.descItems = [...dataItems];
        this.businessRule = [...resform.data.detailForm2.columns];
      }

      setTimeout(() => {
        loading.close();
      }, 1000);
    },
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
      if (e && e.item && e.item.field === 'purchaseUserName') {
        const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
        console.log("e.item", e.item);
        console.log("find", find);
        this.$set(this.form, e.item.field, find?.label ?? '');
        this.$set(this.form, e.item.fieldUserId, find?.purchaseUserId ?? '');
        this.$set(this.form, e.item.fieldName, find?.purchaseUser ?? '');
        this.$set(this.form, e.item.fieldTel, find?.purchaseUserTel ?? '');
      }
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }

      this.defaultColumns = XEUtils.clone(this.columns, true);
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
    // 添加地址
    addAddressData(data) {
      const dataClone = XEUtils.clone(data, true);
      let list = (dataClone ?? []).map((item) => {
        const { areaCodeList, areaCodeListName, defaultFlag, deliveryAddress, email, name, tel } = item
        return {
          areaCodeList, areaCodeListName, defaultFlag, deliveryAddress, email, name,
          receiveLinkName: name,
          receiveLinkTel: tel,
          confirmAddress: areaCodeListName + deliveryAddress + name + tel
        };
      });
      if (list) {
        let obj = list[0] || {};
        this.form = { ...this.form, ...obj };
        this.visible.viewAddressVisible = false;
        this.$message.success("添加成功");
      }
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
      if (this.form.enquiryType == "designated" && !this.form.supplierList.length) {
        this.$message.error("向指定供应商询价请选择供应商！");
        return
      }
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiSeek
          .putPurchaseApply(this.form)
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

      this.form.detailList[rowIndex]['amount'] = this.form.detailList[rowIndex]['price'] * this.form.detailList[rowIndex]['qty'];

      const container = column.fixed === "left" ? table.$el.querySelector(".vxe-table--fixed-left-wrapper")
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

import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiContract, ApiQuotation, ApiBasic, ApiSystem } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import VXETable from "vxe-table";
import { set } from "nprogress";
import splicinAddress from "@/pages-components/splicinAddress/index.vue";

const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation()
const apiSystem = new ApiSystem();
const apiBasic = new ApiBasic()
export default {
  name: "purchaseOrder_orderConfim_detail",
  components: { splicinAddress },
  async beforeRouteLeave(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    if (this.editState) {
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
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "purchaseOrder_orderConfim",
      editState: 0,
      backForm: {},
      moment,
      descItems: [],
      planDescItems: [],
      columns: [],
      planColumns: [],
      plancpColumns: [],
      tableColumns: [],
      planTableColumns: [],
      plancpTableColumns: [],
      defaultColumns: [],
      defaultPlanColumns: [],
      defaultPlancpColumns: [],
      id: null,
      form: {
        templateContent: '',
      },
      formDataShow: {
        lxrxx: true,
        skxx: true,
        cpxx: true,
        pcxx: true,
        pccpxx: true,
      },
      rules: {},
      descSourceList: {
        planTypeList: [
          { label: '一次性采购', value: '1' },
          { label: '多批次采购', value: '2' },
        ],
        contractPurchaseTypeList: (dict['contract_purchase_type'] ?? []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        contractTypeList: (dict["contract_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        supplierList: [],
        fileList: [],
      },
      allBtnControlList: [],
      activeName: 'yhjh',
      planTableList: [],
      planIndex: null,

      // 要货计划
      planRules: {
        planType: [{ required: true, message: "请选择计划类型", trigger: 'blur' }],
      },
      planTableRules: {
        arrivalTime: [{ required: true, message: "请选择要求交货日期", trigger: 'blur' }],
      },
      pickerOptions: {
        disabledDate(current) {
          return current < moment().subtract(1, "day");
        },
      },

    };
  },
  created() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
    }

  },
  mounted() {
  },
  activated() {
    this.getSelectList();
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '采购订单确认'}详情`;
    if (this.id) {
      this.init();
    } else {
      this.editState = 2;
      this.showBtnConfig();
    }
  },
  methods: {
    confirm() {
      const loading = this.loading('请求中...');
      apiContract.putPurchaseOrderConfirmAgree({ ids: [this.id] }).then(res => {
        if (res.code === 200) {
          this.init();
          this.$message.success(res?.message ?? '操作成功')
        } else {
          this.$message.error(res?.message ?? '操作失败')
        }
      }).catch(err => {
        this.$message.error(err?.message ?? '操作失败')
      }).finally(() => {
        setTimeout(() => loading.close(), 1000)
      })
    },
    reject() {
      const loading = this.loading('请求中...');
      apiContract.putPurchaseOrderConfirmReject({ ids: [this.id] }).then(res => {
        if (res.code === 200) {
          this.init();
          this.$message.success(res?.message ?? '操作成功')
        } else {
          this.$message.error(res?.message ?? '操作失败')
        }
      }).catch(err => {
        this.$message.error(err?.message ?? '操作失败')
      }).finally(() => {
        setTimeout(() => loading.close(), 1000)
      })
    },
    planCellClick({ row, rowIndex }) {
      this.planIndex = rowIndex;
      this.planTableList = XEUtils.clone(row?.detailList ?? [], true);
    },
    planInputChage(row, index, column) {
      let purchPlanList = XEUtils.clone(this.form?.purchPlanList ?? [], true);
      row.confirmAmount = XEUtils.toFixed(parseFloat(row.confirmQty || 0) * parseFloat(row.bidPrice || 0), 2);
      this.planTableList[index] = row;
      if (this.planIndex !== null) {
        purchPlanList[this.planIndex].detailList = [...this.planTableList];
        this.form = { ...this.form, purchPlanList };
      }
    },
    inputChage(row, index, column) {
      row.confirmAmount = XEUtils.toFixed(parseFloat(row.confirmQty || 0) * parseFloat(row.bidPrice || 0), 2);
      this.form.detatilList[index] = row;
    },
    // 表格小数位控制
    getDigits(column) {
      return column && column.params && column.params.hasOwnProperty("displayDigits")
        ? column.params.displayDigits
        : 0;
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
    getSelect() {
    },
    async onSubmitBtnClick() {
      this.beforeSubmit();
    },

    onWorkflowOk() {
      //TODO 刷新表单数据
      this.init();
    },
    validFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.dataForm.validate((valid) => {
          resolve(valid);
        });
      });
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
        apiContract.putPurchaseOrderConfirmEdit(this.form).then((res) => {
          if (res.code === 200) {
            this.editState = 0;
          } else {
            this.$message.error(res.message);
            return false;
          }
        }).finally(() => {
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
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
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
        const loading = this.loading('保存中...');
        if (this.editState) {
          const res = await apiContract.putPurchaseOrderConfirmEdit(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = 0;
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message ?? "修改失败系统异常");
            return false;
          }
        }
      }
      if (res === "cancel") {
        if (!this.id) {
          this.$tabs.close();
        } else {
          this.cancel();
        }
        return true;
      }
    },
    cancel() {
      this.editState = 0;
      this.form = { ...this.backForm };
    },
    showBtnConfig() {
      apiQuotation.postDetailBtnList(this.menuCode, { param: { id: this.id ?? null } }).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    async editSave() {


      if (this.form.purchPlanList?.length) {
        const confirmQtyMap = new Map();
        for (const batch of this.form.purchPlanList) {
          if (batch.detailList?.length) {
            for (const confirmItem of batch.detailList) {
              const orderItem = this.form.detailList.find(item => item.rowNum === confirmItem.rowNum);
              if (orderItem && Number(confirmItem.confirmQty) > Number(orderItem.qty)) {
                this.$message.error(`批次 ${batch.batch} 中物料 ${orderItem.materialName} 的确认数量(${confirmItem.confirmQty})不能大于下单数量(${orderItem.qty})`);
                return;
              }
              const currentQty = confirmQtyMap.get(confirmItem.rowNum) || 0;
              confirmQtyMap.set(confirmItem.rowNum, currentQty + Number(confirmItem.confirmQty || 0));
            }
          }
        }

        for (const orderItem of this.form.detailList) {
          const totalPlanQty = confirmQtyMap.get(orderItem.rowNum) || 0;
          if (totalPlanQty !== Number(orderItem.qty)) {
            this.$message.error(`物料 ${orderItem.materialName} 在所有批次中的确认数量总和(${totalPlanQty})必须等于下单数量(${orderItem.qty})`);
            return;
          }
        }
      }

      const loading = this.loading('保存中...');
      apiContract.putPurchaseOrderConfirmEdit(this.form).then(res => {
        if (res.code === 200) {
          this.init();
          this.editState = 0;
          this.$message.success(res?.message || '保存失败');
        } else {
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err => {
        this.$message.error(err?.message || '保存失败')
      }).finally(() => {
        loading.close()
      })
    },
    editClick() {
      this.editState = 2;
      this.backForm = XEUtils.clone(this.form, true);
    },
    getSelectList() {
      apiSystem.getOrderUsersList().then((res) => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.applicantList = (res.data?.submitUser ?? []).map((i) => {
          return {
            label: i.nickName,
            value: i.userName,
          };
        });
        this.descSourceList = { ...descSourceList };
      })
      apiBasic.getQualifiedSupplierList().then((res) => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.confirmedSupplierList = (res.data?.records ?? []).map((i) => {
          return {
            label: i.businessLicense,
            value: i.businessLicense,
          };
        });
        this.descSourceList = { ...descSourceList };
      });
      apiSystem.getJustDeptListList().then((res) => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.adepartmentList = (res.data ?? []).map((i) => {
          return {
            label: i.deptName,
            value: i.deptId,
          };
        });
        this.descSourceList = { ...descSourceList };
      })
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiContract.getPurchaseOrderConfirmDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data || {};
          this.form.confirmAddress = res.data.areaCodeListName + res.data.deliveryAddress + res.data.receiveLinkName + res.data.receiveLinkTel
          this.setColumn();
          this.baseContrastData()
          if (res.data.purchPlanList && res.data.purchPlanList.length) {
            this.planIndex = 0;
            this.planTableList = res.data.purchPlanList[0]?.detailList ?? [];
          } else {
            this.planIndex = null;
            this.planTableList = [];
          }
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(() => {
        loading.close();
      });
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = (file?.fileList ?? []).map((item) => {
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
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, { code: "detailList,detailPlanList,detailOrderList", corpCode: this.businessCode ?? "LX" });
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.planColumns = res.data.detailPlanList?.columns ?? [];
        this.plancpColumns = res.data.detailOrderList?.columns ?? [];
        this.initTableConfig();
      }
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, { code: "detailForm,detailPlanForm", corpCode: this.businessCode ?? "LX" });
      if (resForm.code === 200 && resForm.data) {
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.planDescItems = resForm.data.detailPlanForm?.columns ?? [];
      }
    },
    initTableConfig() {
      const { table, toolbar, plantoolbar, plantable, plancptoolbar, plancptable } = this.$refs;

      if (table) {
        table.connect(toolbar);
        this.initTable('columns', 'tableColumns', table.id);
      }
      if (plantable) {
        plantable.connect(plantoolbar);
        this.initTable('planColumns', 'planTableColumns', plantable.id);
      }
      if (plancptable) {
        plancptable.map((item, index) => {
          item.connect(plancptoolbar[index]);
          this.initTable('plancpColumns', 'plancpTableColumns', item.id);
        })
      }

      // if (plancptable) {
      //   plancptable.connect(plancptoolbar);
      //   this.initTable('plancpColumns', 'plancpTableColumns', plancptable.id);
      // }
      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultPlanColumns = XEUtils.clone(this.planColumns, true);
      this.defaultPlancpColumns = XEUtils.clone(this.plancpColumns, true);
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map((item) => {
        if (item.params) {
          item.formatter = ({ cellValue, row, column }) => {
            if (item.params.displayDigits) {
              var value = XEUtils.toFixed(cellValue, item.params.displayDigits);
            } else {
              var value = cellValue;
            }
            return cellValue != null ? item.params.percent ? `${value}%` : value : cellValue;
          };
        }
        return item;
      });
      this[tableColumn] = handleStorageColumns(tableColumns, tableId);
    },

    onToolOk(e, column) {
      const { type, data } = e
      const fn = this.toolMethods(column)[type]
      fn && fn(data)
    },
    toolMethods(column) {
      return {
        set_column: ({ columns }) => {
          this[column] = [...columns]
        }
      }
    },
    integerInputChage(row, rowIndex, field) {
      row[field] = XEUtils.round(row[field], 0);
    },
    upDownMove(e, rowIndex, columnIndex, column, row) {
      if (column.field === "confirmQty") {
        if (row.confirmQty > row.qty) {
          this.$message.error("确认数量不能大于下单数量");
          this.$set(row, "confirmQty", row.qty);
          return;
        }
      }
      this.contrastData();

      console.log('this.form', this.form)
      // this.inputFocus(e, rowIndex, columnIndex, column, row);
    },
    dateChange(row, rowIndex, column) {
      this.contrastData();
    },
    textareaChange(row, rowIndex, column) {
      this.contrastData();
    },
    inputFocus(e, rowIndex, columnIndex, column) {
      const { code } = e;
      const { table } = this.$refs;
      const max_row = this.form.detailList.length;
      const max_column = this.columns.length;
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

    contrastData() {
      const differences = [];

      // 遍历当前表单的purchPlanList
      this.form.purchPlanList?.forEach((plan, planIndex) => {
        // 找到对应的backForm中的计划
        const backPlan = this.backForm.purchPlanList?.[planIndex];
        if (!backPlan) return;

        // 遍历detailList中的每个项目
        plan.detailList?.forEach((item, itemIndex) => {
          const backItem = backPlan.detailList?.[itemIndex];
          if (!backItem) return;

          // 比较confirmQty
          if (backItem.confirmQty !== item.confirmQty) {
            differences.push({
              id: item.id,
              planIndex,
              itemIndex,
              batch: plan.batch,
              remark: item.remark,
              field: 'confirmQty',
              old: backItem.confirmQty,
              new: item.confirmQty,
              materialName: item.materialName
            });
          }

          // 比较confirmDealDate
          if (backItem.confirmDealDate !== item.confirmDealDate) {
            differences.push({
              planIndex,
              itemIndex,
              batch: plan.batch,
              remark: item.remark,
              field: 'confirmDealDate',
              old: backItem.confirmDealDate,
              new: item.confirmDealDate,
              materialName: item.materialName
            });
          }
        });
      });

      // 更新差异数据到form中，只保留有实际变化的数据
      this.form.differences = differences.filter(diff => {
        // 对于数量，确保新旧值不同且至少有一个不为null
        if (diff.field == 'confirmQty') {
          return diff.old != diff.new && (diff.old != null || diff.new != null);
        }
        // 对于日期，确保新旧值不同且至少有一个不为null
        if (diff.field == 'confirmDealDate') {
          return diff.old != diff.new && (diff.old != null || diff.new != null);
        }
        return false;
      });
      this.$forceUpdate();
    },
    baseContrastData() {
      const differences = [];

      // 遍历当前表单的purchPlanList
      this.form.purchPlanList?.forEach((plan, planIndex) => {
        // 遍历detailList中的每个项目
        plan.detailList?.forEach((item, itemIndex) => {
          // 比较计划数量和确认数量
          if (item.planQty !== item.confirmQty) {
            differences.push({
              id: item.id,
              planIndex,
              itemIndex,
              batch: plan.batch,
              remark: item.remark,
              field: 'confirmQty',
              old: item.planQty,
              new: item.confirmQty,
              materialName: item.materialName
            });
          }

          // 比较计划时间和确认时间
          if (item.planDealDate !== item.confirmDealDate) {
            differences.push({
              planIndex,
              itemIndex,
              batch: plan.batch,
              remark: item.remark,
              field: 'confirmDealDate',
              old: item.planDealDate,
              new: item.confirmDealDate,
              materialName: item.materialName
            });
          }
        });
      });
      console.log('differences123', differences)

      // 更新差异数据到form中，只保留有实际变化的数据
      this.form.differences = differences.filter(diff => {
        // 对于数量，确保新旧值不同且至少有一个不为null
        if (diff.field === 'confirmQty') {
          return diff.old != diff.new && (diff.old != null || diff.new != null);
        }
        // 对于日期，确保新旧值不同且至少有一个不为null
        if (diff.field === 'confirmDealDate') {
          return diff.old != diff.new && (diff.old != null || diff.new != null);
        }
        return false;
      });
      this.$forceUpdate();
    },

    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
      })
      return loading
    },
  },
};

import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy, ApiBasic, ApiSystem } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import { previewFile } from '@/utils/utils';
import mixin_table from "./scripts/mixins/table";
import VXETable from "vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import columnPasting from "@/pages-components/columnPasting/index.vue";
import productList from "@/pages-components/productList/index.vue";
import materialList from "@/pages-components/materialList/index.vue";
import addUnconventional from "./scripts/com/addUnconventional/index.vue";
import timeline from "@/pages-components/timeline/index.vue";

const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
const apiBasic = new ApiBasic();
const apiSystem = new ApiSystem();
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  mixins: [mixin_table],
  components: { VueEasyLightbox, columnPasting, productList, materialList, addUnconventional, timeline },
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
    bindDescItems() {
      if (!this.form.billState) {
        return this.descItems.filter(x => x.field !== 'urgentFlag')
      }
      return this.descItems;
    }
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      dict,
      moment,
      activeName: 'jbxx',
      menuCode: "buyingLead_purchaseApply",
      fileBillTpye: "PA",
      addListVisible: false,
      id: null,
      lztVisible: false,
      lztColumn: {},
      lztLoadText: "",
      lztText: "",
      allBtnControlList: [],
      editState: false,
      form: {
        urgentFlag: 0,
        procurementType: '',
        procurementTypeName: '',
        detailList: [],
        fileList: [],
      },
      formDataShow: {
        jbxx: true,
        cgmx: true,
        fjcz: true,
      },
      backForm: {},
      columns: [],
      rulesobj: {
        procurementName: [{ required: true, message: "请输入采购需求名称" }],
        urgentFlag: [{ required: true, message: "请选择是否加急" }],
        procurementType: [{ required: true, message: "请选择需求类型" }],
        purchaseDeptId: [{ required: true, message: "请选择申请部门" }],
      },
      descItems: [],
      descSourceList: {
        unitList: (dict['unit'] || []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        flagList: [
          { label: "是", value: 1 },
          { label: "否", value: 0 },
        ],
        procurementTypeList: (dict['procurement_type'] ?? []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        fileList: [],
        applicantList: [], //申请人
        adepartmentList: [], //采购部门
        sourcingMethodList: (dict["sourcing_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //寻源方式
        confirmedSupplierList: [], //供应商
      },
      defaultColumns: [],
      previewImg: false,
      previewIndex: 0,
      imgs: [],
      pickerOptions: {
        disabledDate(current) {
          return current < moment().subtract(1, "day");
        },
      },
      combineOptions: [
        { label: "申请数量", value: "qty", type: "number", toFixed: 2 },
        {
          label: "需求日期", value: "purchaseDate", type: "date", props: {
            pickerOptions: {
              disabledDate(current) {
                return current < moment().subtract(1, "day");
              },
            },
          }
        },
        { label: "备注", value: "remark" },
      ],
      addUnconVisible: false,
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
    const { params, query } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
    } else {
      this.editState = true;
      this.showBtnConfig();
      const find = (this.dict['procurement_type'] ?? []).find(d => !Number(d.defaultFlag));
      this.form = {
        ...this.form,
        procurementType: find?.dictValue,
        procurementTypeName: find?.dictLabel,
      }
    }
    this.setColumn();
  },
  methods: {
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
    },
    addUnconOk(data) {
      let row = { ...data };
      let detailList = [...this.form.detailList];
      row.hasOwnProperty('_X_ROW_KEY') && delete row._X_ROW_KEY;
      console.log(row, "addUnconOk");
      detailList = detailList.concat([row]);
      this.$set(this.form, "detailList", detailList);
      this.$message.success("添加成功");
    },
    handleClose(done) {
      this.addUnconVisible = false;
    },
    // 批量填充成功
    onCombineOptionsOk({ field, value }) {
      const selectedRows = this.$refs.table.getCheckboxRecords();
      if (selectedRows.length === 0) {
        this.$message.warning("请选中需填充产品！");
        return;
      }
      selectedRows.forEach((item, index) => {
        let rowindex = this.$refs.table.getRowIndex(item);
        this.$set(this.form.detailList[rowindex], field, value);
      });
      this.$message.success("填充成功");
    },
    onUploadSuccess(e, field, num = 1) {
      const list = this.form[field] || [];
      if (list && list.length >= num) {
        this.$message.warning(`只能上传 ${num} 个附件`);
        return;
      }
      this.$set(this.form, field, num === 1 ? [{ ...e[0] }] : [...list, { ...e[0] }]);
    },
    onImgClick(item, fileList = []) {
      const fileType = (file) => {
        let fileName = file.fileName ?? "";
        let ext = fileName && fileName
          .split(".")
        [fileName.split(".").length - 1].toLowerCase();
        return IMG_EXT.includes(ext);
      };
      if (fileType(item)) {
        this.imgs = fileList.filter((x) => fileType(x))
          .map((i) => {
            return {
              alt: i.originalFileName,
              src: i.url,
              title: i.originalFileName,
            };
          });
        this.previewImg = true;
        this.$nextTick(() => {
          const { lightbox } = this.$refs;
          const { $el } = lightbox;
          document.body.appendChild($el);
          this.previewIndex = this.imgs.findIndex((x) => x.src === item.url);
        });
      }
    },
    viewFile(item, fileList = []) {
      let fileName = item.fileName ?? "";
      let ext = fileName && fileName.split(".")[fileName.split(".").length - 1].toLowerCase();
      if (IMG_EXT.includes(ext)) {
        this.onImgClick(item, fileList);
        return;
      }
      previewFile(item.url)
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
          const submitRes = await apiBuy.putPurchaseApply(this.form);
          loading.close();
          if (submitRes.code === 200) {
            this.editState = false;
            this.$message.success("保存成功");
            return true;
          } else {
            this.$message.error(submitRes.message, "修改失败系统异常");
            return false;
          }
        } else {
          const submitRes = await apiBuy.postPurchaseApply(this.form);
          loading.close();
          if (submitRes.code === 200) {
            this.editState = false;
            this.$tabs.close(
              null,
              `/buyingLead/purchaseApply-detail/${this.id}`
            );
            this.$message.success("保存成功");
            return false;
          } else {
            this.$message.error(submitRes.message, "修改失败系统异常");
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
    integerInputChage(row, rowIndex, field) {
      row[field] = XEUtils.round(row[field], 0);
    },
    // 添加产品
    addProductData(data) {
      const dataClone = XEUtils.clone(data, true);
      let list = (dataClone ?? []).map((item) => {
        const { materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, planPrice } = item
        return { materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, price: planPrice };
      });
      if (list) {
        let form = { ...this.form };
        let detailList = form.detailList ?? [];
        detailList = detailList.concat(list);
        form.detailList = detailList;
        this.form = { ...form };
        this.$message.success("添加成功");
      }
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
    submit(state) {
      if (state === 1) {
        //新增
        this.addPurchase();
      } else if (state === 2) {
        //修改保存
        this.editPurchase();
      }
    },
    addPurchase() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiBuy
        .postPurchaseApply(this.form)
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.id = res.data.billId;
            this.$tabs.close(
              null,
              `/buyingLead/purchaseApply-detail/${this.id}`
            );
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    editPurchase() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiBuy
        .putPurchaseApply(this.form)
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
      apiBuy
        .getPurchaseApplyDetail({ id })
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
        code: "detailList",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (res.code === 200 && res.data && res.data.columns) {
        let columns = res.data.columns;
        this.columns = [...columns];
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
      if (!this.form.detailList.length) {
        this.$message.warning("采购明细不能为空");
        return;
      }
      // if(this.form.sourcingMethod == "single" && !this.form.supplierId){
      //   this.$message.error("单一寻源请选择供应商！");
      //   return 
      // }
      let flag = this.form.detailList.some((x) => !Number(x.qty) || !x.purchaseDate);
      if (flag) {
        this.$message.error("请补充申请数量，需求日期！！");
        return;
      }
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiBuy
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

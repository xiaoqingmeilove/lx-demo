import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiContract, ApiQuotation, ApiBasic, ApiBillFile } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import VXETable from "vxe-table";
import Timeline from "@/pages-components/timeline";

const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation()
const apiBasic = new ApiBasic()
export default {
  name: "purchaseOrder_delivery_detail",
  components: { VueEasyLightbox, Timeline },
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
    calcSum() {
      return (data, code) => {
        if (!!data) {
          return data.reduce((total, cur) => {
            let n = cur[code] || 0;
            n = Number(n);
            return XEUtils.add(total, n);
          }, 0);
        }
      };
    },
    bindRules() {
      this.$refs.dataFormTransport && this.$refs.dataFormTransport.clearValidate();
      if (this.form.shippingMethod === 'kd') {
        return {
          logisticsCompany: [{ required: true, message: "请输入快递公司" }],
          trackingNumber: [{ required: true, message: "请输入快递单号" }],
        }
      } else if (this.form.shippingMethod === 'wl') {
        return {
          driverName: [{ required: true, message: "请输入司机姓名" }],
          driverPhone: [{ required: true, message: "请输入司机联系方式" }],
          vehiclePlate: [{ required: true, message: "请输入车牌号" }],
        }
      } else {
        return this.rules;
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "purchaseOrder_delivery",
      fileBillTpye: 'OR',
      editState: false,
      backForm: {},
      moment,
      descItems: [],
      descItemsTransport: [],
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      id: null,
      form: {},
      formDataShow: {
        cpxx: true,
        jbxx: true,
        fhxx: true,
      },
      previewImg: false,
      previewIndex: 0,
      imgs: [],
      rules: {
        shippingMethod: [{ required: true, message: "请输入运输方式" }],
      },
      descSourceList: {
        transportType: (dict["contract_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        shippingMethodList: [
          { label: "快递", value: "kd" },
          { label: "物流", value: "wl" },
          { label: "自提", value: "zt" },
          { label: "其他", value: "other" },
        ],
        fileList: [],
      },
      allBtnControlList: [],
      activeName: 'jbxx',
    };
  },
  created() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
    }

    this.setColumn();
  },
  mounted() { },
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '采购订单'}详情`;
    if (this.id) {
      this.init();
    }
  },
  methods: {
    onFileSelect(e) {
      if (this.form.id) {
        const file = e[0];
        let data = {
          ...file,
          billId: this.form.id,
          billType: this.fileBillTpye,
          uploadUser: this.userInfo.userId,
          uploadUserName: this.userInfo.userName,
          menuCode: this.menuCode,
        };
        ApiBillFile.addAuthBillFile(data).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$refs.fileList.getData();
          } else {
            this.$message.error(res.message || "操作失败");
          }
        });
      }
    },
    inputChage(row, index, column) {
      row.amount = XEUtils.toFixed(parseFloat(row.qty || 0) * parseFloat(row.bidPrice || 0), 2);
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
    async onSubmitBtnClick() {
      // this.beforeSubmit();
      this.submitShip();
    },

    onWorkflowOk() {
      //TODO 刷新表单数据
      this.init();
    },
    validFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.dataFormTransport.validate((valid) => {
          resolve(valid);
        });
      });
    },
    async beforeSubmit() {
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return;
      }
      if (!this.descSourceList.fileList.length) {
        this.$message.error("请上传凭证！");
        return;
      }
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiContract.putPurchaseOrderEdit(this.form).then((res) => {
          if (res.code === 200) {
            this.editState = false;
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
    async submitShip() {
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return;
      }
      const loading = this.loading('提交中...');
      let params = {
        id: this.id,
      }
      apiContract.postDeliverySubmit(params).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.init();
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        loading.close();
      });
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
          const res = await apiContract.putPurchaseOrderEdit(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
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
      this.editState = false;
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
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return;
      }
      console.log('valid', valid);
      const loading = this.loading('保存中...');
      apiContract.putDeliveryEdit(this.form).then(res => {
        if (res.code === 200) {
          this.init();
          this.editState = false;
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
      this.editState = true;
      this.backForm = XEUtils.clone(this.form, true);
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiContract.getDeliveryDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
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
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, { code: "detailList", corpCode: this.businessCode ?? "LX" });
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.initTableConfig();
      }
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, { code: "detailForm,detailListTransport", corpCode: this.businessCode ?? "LX" });
      if (resForm.code === 200 && resForm.data) {
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItemsTransport = resForm.data.detailListTransport?.columns ?? [];
      }
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable('columns', 'tableColumns', table.id);
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
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

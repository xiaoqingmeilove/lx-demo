import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiBasic, ApiQuotation, ApiSystem } from "@/apis";
import { previewFile } from '@/utils/utils';
import { handleStorageColumns } from "@/utils/vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import materialList from "@/pages-components/materialList/index.vue";
import supplierList from "@/pages-components/supplierList/index.vue";
import VXETable from "vxe-table";

const apiBasic = new ApiBasic()
const apiQuotation = new ApiQuotation()
const apiSystem = new ApiSystem()
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: "purchaseOrder_createOrder",
  components: { VueEasyLightbox, materialList, supplierList },
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
    this.closePopup();
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
    getColorAndName() {
      return (item, list) => {
        const find = list.find(f => f.value == this.form[item.field]);
        return find || { color: '#45CB7F', label: '未知' };
      }
    },
    formatDate() {
      return (date) => {
        return date ? moment(date).format("YYYY-MM-DD") : '';
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "purchaseOrder_createOrder",
      editState: false,
      backForm: {},
      moment,
      columns: [],
      descItems: [],
      adepartmentList: [], //采购部门
      tableColumns: [],
      defaultColumns: [],
      addAddressDrawer: false,
      addAddressForm: {},

      id: null,
      form: {
        priceSourceName: '手动添加',
        validityStartDate: moment().format("YYYY-MM-DD"),
        validityEndDate: moment().add(1, 'year').format("YYYY-MM-DD"),
      },
      effectiveValue: [moment().format("YYYY-MM-DD"), moment().add(1, 'year').format("YYYY-MM-DD")],
      formDataShow: {
        jbxx: true,
        cpxx: true,
      },
      rules: {
        supplierName: [{ required: true, message: '请选择供应商', trigger: 'blur' },],
        validityStartDate: [{ required: true, message: '请选择有效日期', trigger: 'blur' },],
        taxRate: [{ required: true, message: '请选择税率', trigger: 'blur' },],
      },
      descSourceList: {
        fileList: [],
        taxRateList: (dict["tax_rate"] ?? []).map(d => {
          return { label: d.dictLabel, value: Number(d.dictValue) }
        }),
        purchaseTypeList: (dict['purchase_type'] || []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        payment_method: (dict['payment_method'] || []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        flagList: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }],
      },
      visible: {
        addSupplierVisible: false,
        addProductList: false,
      },
      previewImg: false,
      previewIndex: 0,
      imgs: [],
      allBtnControlList: [],
      activeName: 'jbxx',
      pickerOptions: {
        disabledDate(current) {
          return current < moment().subtract(1, "day");
        },
      }
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
    // this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '价目表'}详情`;
    this.getSelectList();
    if (this.id) {
      this.init();
    } else {
      this.editState = true;
      this.showBtnConfig();
    }
  },
  methods: {
    //添加地址
    addAddress() {
      this.addAddressDrawer = false;
      console.log(this.addAddressForm);
    },

    // 获取部门
    getSelectList() {
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

    //# 上传文件
    onUploadSuccess(e, field, num = 1) {
      const list = this.form[field] || [];
      if (list && list.length >= num) {
        this.$message.warning(`只能上传 ${num} 个附件`);
        return;
      }
      this.$set(this.form, field, num === 1 ? [{ ...e[0] }] : [...list, { ...e[0] }]);
    },














    numberQtyChange(e, row, rowIndex) {
      this.qtyFormatter();
    },
    qtyFormatter() {
      let detailList = [...this.form.detailList];
      this.form.detailList = detailList.reduce((pre, cur, index) => {
        if (index === 0) {
          cur.startQty = 0;
        } else {
          const endQty = detailList[index - 1].endQty;
          cur.startQty = Number(endQty) ? Number(endQty) + 1 : 0;
        }
        pre.push(cur);
        return pre;
      }, []);
    },
    addRow(row, rowIndex) {
      let detailList = [...this.form.detailList];
      let obj = { ...row, id: null, price: 0, untaxPrice: 0, startQty: row.endQty ? Number(row.endQty) + 1 : 0, endQty: null };
      delete obj._X_ROW_KEY;
      detailList.splice(rowIndex + 1, 0, { ...obj });
      this.form.detailList = [...detailList];
    },
    delRow(row, rowIndex) {
      let detailList = [...this.form.detailList];
      detailList.splice(rowIndex, 1);
      this.form.detailList = [...detailList];
      this.qtyFormatter();
    },
    numberChange(e, row, column, rowIndex) {
      if (['', null, undefined].includes(this.form.taxRate)) {
        this.$message.warning("请先选择税率");
        return;
      }
      const { taxRate } = this.form;
      let detailList = [...this.form.detailList]
      /**
       * 不含税价 = 含税价 ÷ (1 + 税率)
       * 含税价=不含税价×(1+税率)
       */
      if (column.field === 'untaxPrice') {
        row.price = XEUtils.toFixed(parseFloat(e) * (1 + taxRate / 100), 4);
      } else if (column.field === 'price') {
        row.untaxPrice = XEUtils.toFixed(parseFloat(e) / (1 + taxRate / 100), 4);
      }
      detailList[rowIndex] = { ...row };
      this.form.detailList = [...detailList];
    },
    addProduct() {
      if (['', null, undefined].includes(this.form.supplierId)) {
        this.$message.warning("请先选择供应商");
        return;
      }
      if (['', null, undefined].includes(this.form.taxRate)) {
        this.$message.warning("请先选择税率");
        return;
      }
      this.visible.addProductList = true
    },
    addMaterialData(data) {
      if (data.length !== 1) {
        this.$message.warning("请选择一个物料");
        return;
      }
      const fields = ['accountPrice', 'attribute', 'basicPrice', 'conductorFlag', 'dishFlag', 'highestStock', 'makeProductFlag', 'materialCode', 'materialName', 'materialTypeCode', 'materialTypeId', 'materialTypeName', 'minimumStock', 'mnemonicCode', 'model', 'packSpecial', 'planPrice', 'priceAccuracy', 'purchaseUnit', 'purchaseUnitConversion', 'qtyAccuracy', 'quoteUseFlag', 'remark', 'safeStock', 'standard', 'standardType', 'status', 'unit', 'virtualFlag', 'voltageLevel', 'wireProductFlag'];
      const obj = data[0] || {};
      const objValue = fields.reduce((acc, cur) => {
        acc[cur] = obj[cur] || null;
        return acc
      }, {});
      this.form = { ...this.form, ...objValue };
      this.$set(this.form, 'detailList', [{ ...objValue, startQty: 0, endQty: null }]);
      this.visible.addProductList = false;
    },
    addSupplierData(data) {
      if (data.length !== 1) {
        this.$message.warning("请选择一个供应商");
        return;
      }
      const obj = data[0] || {};
      let form = { ...this.form };
      this.form = { ...form, supplierName: obj?.supplierName ?? '', supplierId: obj?.id ?? '', supplierBillNo: obj?.billNo ?? '', taxRate: obj?.taxRate ?? 0 };
      this.visible.addSupplierVisible = false;
    },
    onChange(value) {
      if (value) {
        this.$set(this.form, 'validityStartDate', value[0] || '');
        this.$set(this.form, 'validityEndDate', value[1] || '');
      } else {
        this.$set(this.form, 'validityStartDate', '');
        this.$set(this.form, 'validityEndDate', '');
      }
    },
    async onSubmitBtnClick() {
      this.beforeSubmit();
    },

    onWorkflowOk() {
      //TODO 刷新表单数据
      this.init();
    },
    async beforeSubmit() {
      const flag = await this.validate();
      if (!flag) return;
      const valid = await this.validateTable();
      if (valid) return;
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiBasic
          .putPriceEdit(this.form)
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
    closePopup() {
      this.visible = {
        addSupplierVisible: false,
        addProductList: false,
      };
    },
    async closePage() {
      const res = await VXETable.modal.confirm({
        title: "提示",
        content: "存在修改状态页面，请确认是否保存！",
        mask: true,
        confirmButtonText: "保存",
      });
      if (res === "confirm") {
        if (this.id) {
          const flag = await this.validateTable();
          if (flag) return false;
          const loading = this.loading('保存中...');
          const res = await apiBasic.putPriceEdit(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message ?? "修改失败系统异常");
            return false;
          }
        } else {
          const flag = await this.validateTable();
          if (flag) return false;
          const loading = this.loading('保存中...');
          const res = await apiBasic.postPriceSave(this.form);
          loading.close();
          if (res.code === 200) {
            this.$tabs.close(null, `/material/priceList-detail/detail/${res.data.id}`)
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message ?? "修改失败系统异常");
            return false;
          }
        }
      }
      if (res === "cancel") {
        if (this.id) {
          this.cancel();
        } else {
          this.$tabs.close();
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
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
      if (e && e.item && e.item.field === 'taxRate') {
        const { taxRate } = this.form;
        // 不含税价 = 含税价 ÷ (1 + 税率)
        let detailList = (this.form.detailList || []).map(x => {
          x.untaxPrice = XEUtils.toFixed(parseFloat(x.price || 0) / (1 + taxRate / 100), 4);
          return x;
        })
        this.form.detailList = [...detailList];
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
    validate() {
      let flag = true;
      for (let key in this.$refs) {
        if (['dataForm'].includes(key)) {
          this.$refs[key].validate && this.$refs[key].validate(valid => {
            if (!valid) {
              flag = false;
            }
          })
        }
      }
      if (!flag) {
        this.$message.warning('请填写必填字段');
      }
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    },
    validateTable() {
      let flag = false;
      const str = (this.form.detailList || []).reduce((acc, item, index) => {
        if (item.endQty < item.startQty) {
          acc += `第${index + 1}行阶梯数量，上限数量必须大于等于下限数量\n`
        }
        return acc;
      }, '')
      if (str) {
        this.$message.error(str);
        flag = true;
      }
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    },
    async addSave() {
      const flag = await this.validateTable();
      if (flag) return;
      const loading = this.loading('保存中...');
      apiBasic.postPriceSave(this.form).then(res => {
        if (res.code === 200 && res.data) {
          this.$tabs.close(null, `/material/priceList-detail/detail/${res.data.id}`)
          this.$message.success(res?.message || '保持成功');
        } else {
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err => {
        this.$message.error(err?.message || '保存失败')
      }).finally(() => {
        loading.close()
      })
    },
    async editSave() {
      const flag = await this.validateTable();
      if (flag) return;
      const loading = this.loading('保存中...');
      apiBasic.putPriceEdit(this.form).then(res => {
        if (res.code === 200) {
          this.getDetail();
          this.editState = false;
          this.$message.success(res?.message || '保持成功');
        } else {
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err => {
        this.$message.error(err?.message || '保存失败')
      }).finally(() => {
        loading.close()
      })
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
    downloadFile(item) {
      const { originalFileName, url } = item;
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = originalFileName;
      a.href = url;
      a.click();
    },
    editClick() {
      this.editState = true;
      this.backForm = XEUtils.clone(this.form, true);
    },
    getDetail() {
      if (!this.id) return;
      const loading = this.loading('请求中');
      apiBasic.getPriceDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data || {};
          const { validityStartDate, validityEndDate } = this.form;
          this.effectiveValue = [validityStartDate || '', validityEndDate || ''];
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(() => {
        loading.close();
      });
    },
    getDigits(column) {
      return (column && column.params && column.params.displayDigits) ? column.params.displayDigits : 0;
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
    initTableConfig() {
      const { cpxxtable, cpxxtoolbar } = this.$refs;
      if (cpxxtable) {
        cpxxtable.connect(cpxxtoolbar);
        this.initTable('columns', 'tableColumns', cpxxtable.id);
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
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, { code: "detailList", corpCode: this.businessCode ?? "LX" });
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, { code: "createOrder", corpCode: this.businessCode ?? "LX" });
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.initTableConfig();
      }
      if (resForm.code === 200 && resForm.data) {
        this.descItems = resForm.data.createOrder?.columns ?? [];
      }
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

import XEUtils from "xe-utils";
import moment from "moment";
import {mapState} from "vuex";
import {descItems, descItems1, descItems2} from "./scripts/descItems";
import {findMenuByCode} from "@/utils/menu";
import {ApiBid, ApiQuotation, ApiSystem} from "@/apis";
import {previewFile} from '@/utils/utils';
import {handleNextFocus, handleStorageColumns} from "@/utils/vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import supplierList from "@/pages-components/supplierList/index.vue";
import VXETable from "vxe-table";

const apiBid = new ApiBid()
const apiQuotation = new ApiQuotation()
const apiSystem = new ApiSystem();
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: "bidding_bidInvite_detail",
  components: {VueEasyLightbox, supplierList},
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
    getSupplierState() {
      return () => {
        const find = this.descSourceList.supplierStateList.find(f => f.value == this.form.supplierStatus);
        return find || {color: '#45CB7F', label: this.form.supplierStatusName};
      }
    },
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    },
    showfooter() {
      return (column = 'columns') => this[column].some(item => item.params && item.params.addFooter);
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "bidding_bidInvite",
      activeName: 'jbxx',
      editState: false,
      backForm: {},
      moment,
      descItems: descItems,
      descItems1: descItems1,
      descItems2: descItems2,
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      id: null,
      form: {
        detailList: [],
        supplierList:[],
        rejectReasonFlag: 1,
      },
      formDataShow: {
        zjgz: true,
        zbjh: true,
        cpxx: true,
        fjcz: true,
        gys: true,
      },
      rules: {
        projectBillNo: [{required: true, message: '请选择竞价项目编号', trigger: 'blur'},],
        projectName: [{required: true, message: '请输入竞价项目名称', trigger: 'blur'},],
        applyTime: [{required: true, message: '请选择竞价申请日期', trigger: 'blur'},],
        supplierList: [{required: true, message: '请选择供应商', trigger: 'blur'},],
        biddingDirectionCode: [{required: true, message: '请选择竞价方向', trigger: 'blur'},],
        inquiryUser: [{required: true, message: '请选择询价员', trigger: 'blur'},],
        buddingViewFlag: [{required: true, message: '请选择投标人报价查看范围', trigger: 'blur'},],
        sameQuotationFlag: [{required: true, message: '请选择允许提交相同报价', trigger: 'blur'},],
        signUpDeadlineTime: [{required: true, message: '请选择报名截止时间', trigger: 'blur'},],
        beginTime: [{required: true, message: '请选择竞价开始时间', trigger: 'blur'},],
        endTime: [{required: true, message: '请选择竞价结束时间', trigger: 'blur'},],
        pricingDeadlineTime: [{required: true, message: '请选择核价截止时间', trigger: 'blur'},],
        promulgateTime: [{required: true, message: '请选择中标公示时间', trigger: 'blur'},],
      },
      descSourceList: {
        taxRateList: (dict['tax_rate'] || []).map(x => {
          return {label: x.dictLabel, value: x.dictValue}
        }),
        projectStatusList: (dict["project_status"] ?? []).map(d => {
          return {label: d.dictLabel, value: Number(d.dictValue)}
        }),
        biddingDirectionList: (dict["bidding_direction"] ?? []).map(d => {
          return {label: d.dictLabel, value: d.dictValue}
        }),
        sameQuotationList: (dict["same_quotation"] ?? []).map(d => {
          return {label: d.dictLabel, value: Number(d.dictValue)}
        }),
        buddingViewList: (dict["budding_view"] ?? []).map(d => {
          return {label: d.dictLabel, value: Number(d.dictValue)}
        }),//邀请方式
        inviteMethodList: (dict["invite_method"] ?? []).map((d) => {
          return {label: d.dictLabel, value: d.dictValue};
        }),
        flagList: [
          {label: "是", value: 1},
          {label: "否", value: 0},
        ],
        rejectReasonFlagList: [
          {label: "是", value: 0},
          {label: "否", value: 1},
        ],
        inquiryUserList: [],
        supplierList: [],
        fileList: [],
      },
      visible: {
        addSupplierVisible: false
      },
      allBtnControlList: [],
      addSupplierVisible: false,
      supplierColumns: [],
    };
  },
  watch: {},
  created() {
    const {params} = this.$route;
    const {id} = params;
    if (id) {
      this.id = id;
    }
    this.setColumn();
    this.getSelectList();
  },
  mounted() {
  },
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '竞价邀请'}详情`;
    if (this.id) {
      this.init();
    } else {
      this.editState = true;
      this.showBtnConfig();
    }
  },
  methods: {
    upDownMove(e, rowIndex, columnIndex, column) {
      this.inputFocus(e, rowIndex, columnIndex, column);
    },
    integerInputChage(row, rowIndex, field) {
      row[field] = XEUtils.round(row[field], 0);
    },
    inputFocus(e, rowIndex, columnIndex, column) {
      const { code } = e;
      const { cpxxtable } = this.$refs;
      const max_row = this.form.detailList.length;
      const max_column = this.columns.length;

      this.form.detailList[rowIndex]['amount'] = this.form.detailList[rowIndex]['price'] * this.form.detailList[rowIndex]['qty'];

      const container = column.fixed === "left" ? cpxxtable.$el.querySelector(".vxe-table--fixed-left-wrapper")
        : column.fixed === "right"
          ? cpxxtable.$el.querySelector(".vxe-table--fixed-right-wrapper")
          : cpxxtable.$el;

      handleNextFocus(
        container,
        code,
        rowIndex,
        columnIndex,
        max_row,
        max_column
      );
    },
    formatNumber(value, digits) {
      const newValue = XEUtils.toFixed(value, digits);
      return newValue.replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
    },
    calcSum(data, code) {
      if (data.length) {
        return data.reduce((total, cur) => {
          let n = cur[code] || 0;
          n = Number(n);
          return total + n;
        }, 0);
      }
    },
    footerMethod({columns, data}) {
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex == 0) {
            return "合计";
          }
          if (column.params && column.params.addFooter) {
            return column.params.commafy ? this.formatNumber(this.calcSum(data, column.property), column.params.displayDigits) : XEUtils.toFixed(this.calcSum(data, column.property), column.params.displayDigits);
          }
          return null;
        }),
      ];
      return footerData;
    },
    toPricing() {
      VXETable.modal.confirm({
        title: "提示",
        content: "确定核价?",
        mask: true,
      }).then(async (type) => {
        if (type === "confirm") {
          const loading = this.loading('请求中');
          apiBid.postBiddingPricing(this.id).then(res => {
            if (res.code === 200 && res.data) {
              this.$message.success(res?.message ?? "操作成功");
              this.$router.push({
                path: `/bidding/bidPricing-detail/detail/${res.data}`,
              });
            } else {
              this.$message.error(res?.message ?? "操作失败");
            }
          }).catch(err => {
            this.$message.error(err?.message ?? "操作失败")
          }).finally(() => {
            loading.close();
          })
        }
      })
    },
    getSelectList() {
      apiSystem.getOrderUsersList().then((res) => {
        let descSourceList = {...this.descSourceList};
        descSourceList.inquiryUserList = (res.data?.inquiryUser ?? []).map((i) => {
          return {
            label: i.nickName,
            value: i.userName,
          };
        });
        this.descSourceList = {...descSourceList};
      })
    },
    closePopup() {
      this.visible = {
        addSupplierVisible: false
      }
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
    async onSubmitBtnClick() {
      this.beforeSubmit();
    },
    onWorkflowOk() {
      //TODO 刷新表单数据
      this.init();
    },
    validFormData() {
      let flag = true;
      for (let key in this.$refs) {
        if (['dataForm', 'dataForm1', 'dataForm2'].includes(key)) {
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
      console.log(moment(this.form.beginTime) > moment(this.form.endTime))
      if(moment(this.form.beginTime) > moment(this.form.endTime)) {
        this.$message.warning('竞价开始时间不能大于竞价结束时间');
        flag = false;
      }
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    },
    async beforeSubmit() {
      const valid = await this.validFormData();
      if (!valid) {
        return false;
      }
      if (this.form.detailList.some(x => !x.latestArrivalDate)) {
        this.$message.warning('请选择最晚到货时间');
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
      const {workflow} = this.$refs;
      const {workflow: workflowComponent} = workflow?.$refs;
      workflowComponent && workflowComponent.submitWorkflow();
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
        const flag = await this.validate();
        if (!flag) return false;
        const loading = this.loading('保存中...');
        if (this.editState && this.id) {
          const res = await apiBid.putBiddingEdit(this.form);
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
      this.form = {...this.backForm};
    },
    showBtnConfig() {
      apiQuotation.postDetailBtnList(this.menuCode, {param: {id: this.id ?? null}}).then((res) => {
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
    },
    viewFile(url) {
      previewFile(url)
    },
    async editSave() {
      const valid = await this.validFormData();
      if (!valid) {
        return false;
      }
      const loading = this.loading('保存中...');
      apiBid.putBiddingEdit(this.form).then(res => {
        if (res.code === 200) {
          this.getDetail();
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
    async addSave() {
      const valid = await this.validFormData();
      if (!valid) {
        return false;
      }
      const loading = this.loading('保存中...');
      apiBid.postBiddingtAdd(this.form).then(res => {
        if (res.code === 200 && res.data) {
          this.$tabs.close(null, `/bidding/bidInvite-detail/detail/${res.data}`);
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
    editpayment(row, index) {
      this.visible.paymentVisible = true;
      this.paymentIndex = index,
        this.paymentForm = index !== '' ? {...row} : {
          areaCodeList: '',
          areaCodeListName: '',
          countryCode: '',
        };
    },
    inputChange(row, rowIndex, column) {
      // if (column.field == "price" || column.field == "qty") {
      //     row.amount = (row.price * row.qty).toFixed(2);
      //     row.taxAmount = (row.price - (row.price / (1 + row.taxRate / 100))).toFixed(2);
      // }
      // if (column.field == "taxRate") {
      //     row.taxAmount = (row.price - (row.price / (1 + row.taxRate / 100))).toFixed(2);
      // }

    },
    selectChange(value, objfield, list, field) {
      const val = (list || []).find(d => d.value == value)?.label ?? ''
      this.$set(this[objfield], field, val);
    },
    onUploadSuccess(e, field) {
      const fileList = XEUtils.clone(this[field].fileList || [], true);
      this.$set(this[field], "fileList", fileList.concat([{...e[0]}]));
    },
    pcaRowChange(e, row, rowIndex) {
      row.areaCodeList = e.value;
      row.areaCodeListName = e.name;
      this.$set(this.form.detailList, rowIndex, {...row});
    },
    pcaChange(e) {
      this.form.areaCodeList = e.value;
      this.form.areaCodeListName = e.name;
      this.form.countryCode = e.countryCode;
    },
    editClick() {
      this.editState = true;
      this.backForm = XEUtils.clone(this.form, true);
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiBid.getBiddingtDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data || {}
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
      const {cpxxtable, cpxxtoolbar} = this.$refs;
      if (cpxxtable) {
        cpxxtable.connect(cpxxtoolbar);
        this.initTable('columns', 'tableColumns', cpxxtable.id);
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map((item) => {
        if (item.params) {
          item.formatter = ({cellValue, row, column}) => {
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
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {
        code: "detailList,detailList2",
        corpCode: this.businessCode ?? "LX"
      });
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {
        code: "detailForm,detailForm1,detailForm2",
        corpCode: this.businessCode ?? "LX"
      });
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.supplierColumns = res.data.detailList2?.columns ?? [];
        this.initTableConfig();
      }
      if (resForm.code === 200 && resForm.data) {
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItems1 = resForm.data.detailForm1?.columns ?? [];
        this.descItems2 = resForm.data.detailForm2?.columns ?? [];
      }
    },
    onToolOk(e, column) {
      const {type, data} = e
      const fn = this.toolMethods(column)[type]
      fn && fn(data)
    },
    toolMethods(column) {
      return {
        set_column: ({columns}) => {
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

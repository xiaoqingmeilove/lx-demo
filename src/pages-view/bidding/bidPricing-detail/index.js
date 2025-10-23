import XEUtils from "xe-utils";
import moment from "moment";
import VXETable from "vxe-table";
import columnPasting from "@/pages-components/columnPasting/index.vue";
import noticeModal from "@/pages-components/notice/notice.vue";
import { mapState } from "vuex";
import { ApiQuotation, ApiBid, ApiSystem } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import { findMenuByCode } from "@/utils/menu";
import { handContent } from "./helper.js";

const apiQuotation = new ApiQuotation();
const apiBid = new ApiBid();
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
    showfooter(){
      return (column='columns') => this[column].some(item => item.params && item.params.addFooter);
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      menuCode: "bidding_bidPricing",
      fileBillTpye: "HJ",
      activeName: 'jbxx',
      id: null,
      lztVisible: false,
      lztColumn: {},
      lztLoadText: "",
      lztText: "",
      allBtnControlList: [],
      editState: false,
      form: {
        detailList:[],
      },
      formDataShow: {
        cgmx: true,
        fjcz: true,
        gysbjqd:true,
        zbjg:true
      },
      backForm: {},
      columns: [],
      mergeCells: [],
      supplierColumns: [],
      supplierTableColumns: [],
      summaryColumns: [],
      summaryTableColumns: [],
      supplierDefaultColumns: [],
      summaryDefaultColumns: [],
      rulesobj: {
        awardMethodCode: [{ required: true, message: "请选择授标方式", trigger: "blur" }]
      },
      descItems: [],
      descSourceList: {
        fileList: [],
        awardMethodList:(dict["award_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        bidResultList: (dict["bid_result"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        supplierList:[],
      },
      defaultColumns: [],
      noticeVisible:false,
      noticeForm:{},
      editNoticeState:false,
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
  created() {
    this.setColumn();
  },
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '核价'}详情`;
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
    } 
    this.getSelectList();
  },
  watch: {
    'form.awardMethodCode': {
      handler(newVal) {
        if(newVal === 'AWARD_AS_WHOLE') {
          this.rulesobj = {
            awardMethodCode: [{ required: true, message: "请选择授标方式", trigger: "blur" }],
            businessLicense: [{ required: true, message: "请选择中标供应商", trigger: "blur" }]
          }
        }else{
          this.rulesobj = {
            awardMethodCode: [{ required: true, message: "请选择授标方式", trigger: "blur" }],
          }
        }
      },
      immediate: true,
    }
  },
  methods: {
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
    issueOk(data){
      const loading = this.$loading({
        lock: true,
        text: "发布中",
        spinner: "el-icon-loading",
      });
      apiSystem.postProclamation(data).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message ?? "发布成功");
          this.init();
        }else{
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
        deadline:moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
        officialWebsite:1,
        content: handContent(this.form),
      };
      this.editNoticeState = true;
      this.noticeVisible = true;
    },
    getColumnDigits(column, field, digits = 2){
      const find = this[column].find(x=>x.field === field)
      if(find && find.params && find.params.displayDigits){
        return find.params.displayDigits
      }
      return digits;
    },
    onNumberChange(e, row, column, rowIndex, columns){
      if(column.field === 'price' || column.field === 'qty'){
        row.amount = XEUtils.toFixed(parseFloat(row.price) * parseFloat(row.qty), this.getColumnDigits(columns, 'amount'));
      }
    },
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
      if(e && e.item && e.item.field === 'businessLicense'){
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.value === this.form[e.item.field])
        let form = {...this.form};
        form.supplierName = find?.supplierName ?? ''
        form.supplierNickName = find?.supplierNickName ?? ''
        form.supplierBillNo = find?.supplierBillNo ?? ''
        this.form = { ...form };
      }
      if (e && e.item && ["businessLicense","awardMethodCode"].includes(e.item.field) && this.form.awardMethodCode == "AWARD_AS_WHOLE") {
        let detailsList = [...this.form.detailsList];
        detailsList = detailsList.map(x => {
          const qty = x.businessLicense == this.form.businessLicense ? x.fromQty : 0;
          return {
            ...x,
            qty,
            bidResult: x.businessLicense == this.form.businessLicense ? "WIN" : "LOSE",
            amount: XEUtils.toFixed(parseFloat(x.price) * parseFloat(qty), this.getColumnDigits('summaryColumns', 'amount'))
          };
        });
        this.form.detailsList = [...detailsList];
        this.handleMerges();
      }
    },
    handleMerges() {
      const merges = [];
      const fields = (this.summaryTableColumns||[]).reduce((group, item)=>{
        if(item.params && item.params.merges){
          group.push(item.field);
        }
        return group;
      }, []);
      const tableData = XEUtils.clone(this.form.detailsList||[], true);
      fields.forEach(field => {
        const colIndex = this.summaryColumns.findIndex(x => x.field === field)
        let startRow = 0
        let count = 1

        for (let i = 1; i <= tableData.length; i++) {
          const item = tableData[i]
          if (i < tableData.length
            && (item.businessBillNo === tableData[i - 1].businessBillNo)
            && (item[field] === tableData[i - 1][field])
          ) {
            count++
          } else {
            if (count > 1) {
              merges.push({
                row: startRow,
                rowspan: count,
                col: colIndex,
                colspan: 1
              })
            }
            startRow = i
            count = 1
          }
        }
      });
      this.mergeCells = [...merges];
    },
    getSelectList() {
      apiBid.getApplicants(this.id).then(res=>{
        if(res.code === 200){
          const supplierList = (res.data || []).map(x=>{
            return {...x, label: x.supplierName, value: x.supplierName}
          });
          this.$set(this.descSourceList, 'supplierList', supplierList);
        }
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
          const submitRes = await apiBid.putBiddingPricing(this.form);
          loading.close();
          if (submitRes.code === 200) {
            this.editState = false;
            this.$message.success("保存成功");
            return true;
          } else {
            this.$message.error(submitRes?.message ?? "修改失败系统异常");
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
    getDigits(column) {
      return column && column.params && column.params.hasOwnProperty("displayDigits")
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
      this.handleMerges();
    },
    // 保存
    submit(state) {
      this.editBill();
    },
    editBill() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiBid.putBiddingPricing(this.form).then((res) => {
        if (res.code === 200 && res.data) {
          this.editState = false;
          this.init();
        } else {
          this.$message.error(res?.message ?? "操作异常");
        }
      }).catch(err=>{
        this.$message.error(err?.message ?? '请求异常');
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
      const loading = this.loading('加载中');
      apiBid.getBiddingPricingDetail(this.id).then((res) => {
        if (res.code === 200 && res.data) {
          this.form = { ...res.data };
          this.$nextTick(()=>{
            this.handleMerges();
          })
        } else {
          this.$message.error(res?.message ?? '请求异常');
        }
      }).catch(err=>{
        this.$message.error(err?.message ?? '请求异常');
      }).finally(() => {
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
      const data = {
        code: "supplierDetailList,summaryList",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
      if (res.code === 200 && res.data) {
        const  supplierColumns = res.data.supplierDetailList?.columns??[];
        const summaryColumns = res.data.summaryList?.columns??[];
        this.supplierColumns = [...supplierColumns];
        this.summaryColumns = [...summaryColumns];
        this.initTableConfig();
      }
      const dataForm = {
        code: "detailForm",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfig(
        this.menuCode,
        dataForm
      );
      if (resform.code === 200 && resform.data && resform.data.columns) {
        const dataItems = resform.data.columns;
        this.descItems = [...dataItems];
      }
      this.handleMerges();
    },
    initTableConfig() {
      const { suppliertoolbar, supplierTable, summarytoolbar, summarytable } = this.$refs;
      if (supplierTable) {
        supplierTable.connect(suppliertoolbar);
        this.initTable('supplierColumns', 'supplierTableColumns', supplierTable.id);
      }
      if (summarytable) {
        summarytable.connect(summarytoolbar);
        this.initTable('summaryColumns', 'summaryTableColumns', summarytable.id);
      }
      this.supplierDefaultColumns = XEUtils.clone(this.supplierColumns, true);
      this.summaryDefaultColumns = XEUtils.clone(this.summaryColumns, true);
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
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
        set_column: ({columns}) => {
          this[column] = [...columns]
          if(column === "summaryTableColumns") this.$nextTick(()=>this.handleMerges())
        }
      }
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
        return true;
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

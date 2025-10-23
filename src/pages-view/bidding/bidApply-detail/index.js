import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { columns } from "./scripts/columns";
import { descItems, descItems1, descItems2 } from "./scripts/descItems";
import { findMenuByCode } from "@/utils/menu";
import { ApiBid, ApiQuotation } from "@/apis";
import { previewFile } from '@/utils/utils';
import { handleStorageColumns } from "@/utils/vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import productList from "@/pages-components/productList/index.vue";
import VXETable from "vxe-table";

const apiBid = new ApiBid()
const apiQuotation = new ApiQuotation()
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: "bidding_bidApply_detail",
  components: { VueEasyLightbox, productList },
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
    getSupplierState(){
      return () => {
        const find = this.descSourceList.supplierStateList.find(f=>f.value == this.form.supplierStatus);
        return find || { color: '#45CB7F', label: this.form.supplierStatusName };
      }
    },
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    },
    rejectReasonRequired() {
      return this.form.involvedFlag == 1 && this.form.rejectReasonFlag === 0
    },
    showfooter(){
      return (column='columns') => this[column].some(item => item.params && item.params.addFooter);
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      activeName: 'jbxx',
      menuCode: "bidding_bidApply",
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
        involvedFlag: null,
        detailList: []
      },
      formDataShow: {
        zbjh: true,
        cpxx: true,
        fjcz: true,
        jbxx: true,
      },
      rules: {
        involvedFlag: [{ required: true, message: '请选择报名资格确认', trigger: 'blur' },],
      },
      descSourceList: {
        involvedFlagList: (dict["involved_flag"] ?? []).map(d => {
          return { label: d.dictLabel, value: Number(d.dictValue) }
        }),
        //邀请方式
        inviteMethodList: (dict["invite_method"] ?? []).map((d) => {
          return {label: d.dictLabel, value: d.dictValue};
        }),
        flagList: [
          { label: "是", value: 1 },
          { label: "否", value: 0 },
        ],
        fileList: [],
      },
      visible: {},
      allBtnControlList: [],
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
  watch: {
    rejectReasonRequired: {
      handler(newval) {
        if(newval) {
          this.rules = {
            involvedFlag: [{ required: true, message: '请选择报名资格确认', trigger: 'blur' },],
            rejectReason: [{ required: true, message: "请输入报名说明", trigger: "blur" }]
          }
        }else{
          this.rules = {
            involvedFlag: [{ required: true, message: '请选择报名资格确认', trigger: 'blur' },],
          }
        }
      },
      immediate: true,
    }
  },
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '竞价报名'}详情`;
    if (this.id) {
      this.init();
    }else{
      this.editState = true;
      this.showBtnConfig();
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
    async onSubmitBtnClick() {
      this.beforeSubmit();
    },
    onWorkflowOk() {
      //TODO 刷新表单数据
      this.init();
    },
    validFormData(){
      let flag = true;
      for(let key in this.$refs){
        if(['dataForm'].includes(key)){
          this.$refs[key].validate && this.$refs[key].validate(valid=>{
            if (!valid){
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
    async beforeSubmit() {
      const valid = await this.validFormData();
      if (!valid) {
        return false;
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
        if(!flag) return false;
        const loading = this.loading('保存中...');
        if (this.editState && this.id) {
          const res = await apiBid.putBiddingSignEdit(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message??"修改失败系统异常");
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
      apiQuotation.postDetailBtnList(this.menuCode, {param: { id: this.id ?? null }}).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
    },
    viewFile(url){
      previewFile(url)
    },
    async editSave(){
      const loading = this.loading('保存中...');
      apiBid.putBiddingSignEdit(this.form).then(res=>{
        if(res.code === 200){
          this.getDetail();
          this.editState=false;
          this.$message.success(res?.message || '保存失败');
        }else{
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err=>{
        this.$message.error(err?.message || '保存失败')
      }).finally(()=>{
        loading.close()
      })
    },
    selectChange(value, objfield, list, field) {
      const val = (list || []).find(d => d.value == value)?.label ?? ''
      this.$set(this[objfield], field, val);
    },
    onUploadSuccess(e, field) {
      const fileList = XEUtils.clone(this[field].fileList || [], true);
      this.$set(this[field], "fileList", fileList.concat([{ ...e[0] }]));
    },
    pcaRowChange(e, row, rowIndex){
      row.areaCodeList = e.value;
      row.form.areaCodeListName = e.name;
      this.form.detailList[rowIndex] = {...row};
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
      apiBid.getBiddingSign(this.id).then((res) => {
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
      this.descSourceList.fileList = (file?.fileList??[]).map((item) => {
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
            if(item.params.displayDigits){
              var value = XEUtils.toFixed(cellValue, item.params.displayDigits);
            }else{
              var value = cellValue;
            }
            return cellValue!=null ? item.params.percent ? `${value}%` : value : cellValue;
          };
        }
        return item;
      });
      this[tableColumn] = handleStorageColumns(tableColumns, tableId);
    },
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "detailList",corpCode: this.businessCode ?? "LX"});
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm,detailForm1,detailForm2",corpCode: this.businessCode ?? "LX"});
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.initTableConfig();
      }
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItems1 = resForm.data.detailForm1?.columns ?? [];
        this.descItems2 = resForm.data.detailForm2?.columns ?? [];
      }
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

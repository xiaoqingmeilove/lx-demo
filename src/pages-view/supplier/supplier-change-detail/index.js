import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiBasic, ApiQuotation, ApiSystem } from "@/apis";
import { previewFile } from '@/utils/utils';
import { handleStorageColumns } from "@/utils/vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import VXETable from "vxe-table";

const apiBasic = new ApiBasic()
const apiQuotation = new ApiQuotation()
const apiSystem = new ApiSystem()
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: "supplier_supplierChange_detail",
  components: { VueEasyLightbox },
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
        const find = this.descSourceList.supplierClassificationsList.find(f=>f.value == this.form.supplierClassification);
        return find || { color: '#45CB7F', label: this.form.supplierClassificationName };
      }
    },
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    },
    logoUrl(){
      if(this.form.supplierLogoFileList && this.form.supplierLogoFileList.length) {
        return this.form.supplierLogoFileList[0]?.url ?? '';
      }
      return null
    },
    getColorAndName(){
      return (item, list) => {
        const find = list.find(f=>f.value ==this.form[item.field]);
        return find || { color: '#45CB7F', label:'未知'};
      }
    },
    bindView() {
      return row => {
        return [
          "bankList",
          "contactList",
          "qualificationsList",
          "authUserFileList",
          "businessLicenseFileList",
          "confirmFileList",
          "detailList",
          "contactRecordsList",
        ].includes(row.changeField);
      };
    },
    bindTableData() {
      const oldRest = {
        bankList: { value: this.oldForm.bankList && this.oldForm.bankList.length ? "查看变更前开户信息" : "" },
        detailList: { value: this.oldForm.detailList && this.oldForm.detailList.length ? "查看变更前产品信息" : "" },
        contactList: { value: this.oldForm.contactList && this.oldForm.contactList.length ? "查看变更前联系人信息" : "" },
        contactRecordsList: { value: this.oldForm.contactRecordsList && this.oldForm.contactRecordsList.length ? "查看变更前联系备忘录" : "" },
        qualificationsList: { value: this.oldForm.qualificationsList && this.oldForm.qualificationsList.length ? "查看变更前企业资质" : "" },
        authUserFileList: { value: this.oldForm.authUserFileList && this.oldForm.authUserFileList.length ? "查看变更前授权人信息-身份证正反面" : "" },
        businessLicenseFileList: { value: this.oldForm.businessLicenseFileList && this.oldForm.businessLicenseFileList.length ? "查看变更前营业执照-附件" : "" },
        confirmFileList: { value: this.oldForm.confirmFileList && this.oldForm.confirmFileList.length ? "查看变更前营业执照-确认函附件" : "" },
        businessLicenseValidityEndDate: {
          value: this.oldForm.businessLicenseAutoRenewalFlag
            ? "长期有效"
            : this.oldForm.businessLicenseValidityEndDate
        },
        confirmValidityEndDate: {
          value: this.oldForm.confirmAutoRenewalFlag
            ? "长期有效"
            : this.oldForm.confirmValidityEndDate
        },
        authUserValidityEndDate: {
          value: this.oldForm.authUserAutoRenewalFlag
            ? "长期有效"
            : this.oldForm.authUserValidityEndDate
        },
        validityEndDate: {
          value: this.oldForm.autoRenewalFlag ? "长期有效" : this.oldForm.validityEndDate
        },
        areaCodeList: { value: this.oldForm.areaCodeListName }
      };
      const newRest = {
        bankList: { value: this.newForm.bankList && this.newForm.bankList.length ? "查看变更后开户信息" : "" },
        detailList: { value: this.newForm.detailList && this.newForm.detailList.length ? "查看变更后产品信息" : "" },
        contactList: { value: this.newForm.contactList && this.newForm.contactList.length ? "查看变更后联系人信息" : "" },
        contactRecordsList: { value: this.newForm.contactRecordsList && this.newForm.contactRecordsList.length ? "查看变更后联系备忘录" : "" },
        qualificationsList: { value: this.newForm.qualificationsList && this.newForm.qualificationsList.length ? "查看变更后企业资质" : "" },
        authUserFileList: { value: this.newForm.authUserFileList && this.newForm.authUserFileList.length ? "查看变更后授权人信息-身份证正反面" : "" },
        businessLicenseFileList: { value: this.newForm.businessLicenseFileList && this.newForm.businessLicenseFileList.length ? "查看变更后营业执照-附件" : "" },
        confirmFileList: { value: this.newForm.confirmFileList && this.newForm.confirmFileList.length ? "查看变更后营业执照-确认函附件" : "" },
        businessLicenseValidityEndDate: {
          value: this.newForm.businessLicenseAutoRenewalFlag
            ? "长期有效"
            : this.newForm.businessLicenseValidityEndDate
        },
        confirmValidityEndDate: {
          value: this.newForm.confirmAutoRenewalFlag
            ? "长期有效"
            : this.newForm.confirmValidityEndDate
        },
        authUserValidityEndDate: {
          value: this.newForm.authUserAutoRenewalFlag
            ? "长期有效"
            : this.newForm.authUserValidityEndDate
        },
        validityEndDate: {
          value: this.newForm.autoRenewalFlag ? "长期有效" : this.newForm.validityEndDate
        },
        areaCodeList: { value: this.newForm.areaCodeListName }
      };
      const list = this.fieldList.reduce((acc, item) => {
        const find = this.fileds.find(i => i.field === item);
        const readValue = (descItem, data) => {
          if(descItem.fieldName) return data[descItem.fieldName];
          return data[descItem.field];
        }
        if (find) {
          if(find.type === 'number' && parseFloat(this.oldForm[item]) === parseFloat(this.newForm[item])) return acc;
          const obj = {
            type: !this.oldForm[item] && this.newForm[item] ? "添加" : this.oldForm[item] && !this.newForm[item] ? "删除" :"修改",
            changeField: item,
            changeFieldName: find?.label,
            oldValue: oldRest[item] ? oldRest[item].value : readValue(find, this.oldForm),
            newValue: newRest[item] ? newRest[item].value : readValue(find, this.newForm)
          };
          acc.push(obj);
        }
        return acc;
      }, []);
      return list;
    },
    bindList() {
      const { changeField, old } = this.fieldObj;
      return old === "old" ? this.oldForm[changeField] : this.newForm[changeField];
    },
    bindColumns() {
      return (this.columnsObj[this.fieldObj.changeField] || []).filter(
        x => x.field != "action"
      );
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "supplier_supplierChange",
      editState: false,
      backForm: {},
      moment,
      columns: [],
      columns1: [],
      columns2: [],
      billDescItems: [],
      descItems: [],
      descItems2: [],
      descItems3: [],
      descItems4: [],
      descItems5: [],
      tableColumns: [],
      tableColumns1: [],
      tableColumns2: [],
      tableColumns3: [],
      tableColumns5: [],
      defaultColumns: [],
      defaultColumns1: [],
      defaultColumns2: [],
      defaultColumns3: [],
      defaultColumns5: [],
      id: null,
      form: {},
      billForm: {},
      oldForm: {},
      newForm: {},
      fieldList: [],
      formDataShow: {
        jbxx: true,
        lxrxx: true,
        skxx: true,
        qyzz: true,
        cpxx: true,
        fjcz: true,
        lxxx: true,
        yyzz: true,
        sqrxx: true,
        dlxx: true,
        gysglxx: true,
        bgjl: true,
      },
      rules: {
        supplierType: [{ required: true, message: '请选择供应商类型', trigger: 'blur' },],
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' },],
        areaCodeList: [{ required: true, message: '请选择公司所在地区', trigger: 'change' },],
        enterpriseType: [{ required: true, message: '请选择企业类型', trigger: 'blur' },],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            const phoneRegex = /^1[3456789]\d{9}$/;
            if (phoneRegex.test(value)) {
              callback();
            } else {
              callback(new Error('请输入正确的手机号码'));
            }
          }, trigger: "blur" }
        ],
        materialMsg: [{ required: true, message: '请输入主供物料', trigger: 'blur' },],
        legalRepresentative: [{ required: true, message: '请输入法人代表', trigger: 'blur' },],
        supplierAmount: [
          { required: true, message: '请输入注册资本', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (parseFloat(value)) {
              callback();
            } else {
              callback(new Error('请输入注册资本'));
            }
          }, trigger: "blur" }
        ],
        bornDate: [{ required: true, message: '请选择注册时间', trigger: 'blur' },],
        registerAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' },],
        inviteUserId: [{ required: true, message: '请选择负责人', trigger: 'blur' },],
        validityEndDate: [{ required: true, message: '请选择供应商有效期', trigger: 'blur' },],
        invoiceType: [{ required: true, message: '请选择发票类型', trigger: 'blur' },],
        taxRate: [{ required: true, message: '请选择税率', trigger: 'blur' },],
        retentionMoney: [{ required: true, message: '请输入质保金', trigger: 'blur' },],
        paymentTerm: [{ required: true, message: '请选择付款条件', trigger: 'blur' },],
        paymentMethod: [{ required: true, message: '请选择付款方式', trigger: 'blur' },],
        accountPeriod: [{ required: true, message: '请输入账期', trigger: 'blur' },],
      },
      descSourceList: {
        supplierTypeList: (dict["supplier_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        enterpriseTypeList: (dict["ENTERPRISE_TYPE"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        linkerGenderList: [
          { label: "未知", value: 0 },
          { label: "先生", value: 1 },
          { label: "女士", value: 2 },
        ],
        authStatusList: (dict["supplier_auth_status"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
        fileList: [],
        certificateTypeList: (dict["certificate_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        taxRateList: (dict["tax_rate"]??[]).map(d=>{
          return {label: d.dictLabel, value: Number(d.dictValue)}
        }),
        invoiceTypeList: (dict["invoice_type"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictValue}
        }),
        supplyCassificationList: (dict["supply_classification"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictValue}
        }),
        supplierClassificationsList: (dict["supplier_classification"]??[]).map(d=>{
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
        paymentTermList: (dict["payment_terms"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictLabel}
        }),
        accountPeriodList: (dict["account_period"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictLabel}
        }),
        paymentMethodList: (dict["payment_method"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictLabel}
        }),
        supplierLevelList: (dict["supplier_level"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictValue}
        }),
        inviteUserList: [],
        flagList: [{label: '启用', value: 1},{label: '禁用', value: 0}],
      },
      visible: {
        papersVisible: false,
        paymentVisible: false,
        addListVisible: false,
        detailVisible: false,
      },
      paymentForm: {},
      papersForm: {},
      papersIndex: '',
      previewImg: false,
      previewIndex: 0,
      imgs: [],
      allBtnControlList: [],
      activeName: 'jbxx',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      readOnly: false, // 只读
      changeColumns: [
        { title: "变更类型", field: "type", align: "left", width: 100 },
        { title: "变更字段", field: "changeFieldName", align: "left", minWidth: 150 },
        { title: "变更旧值", field: "oldValue", align: "left", minWidth: 150, slots: { default: "oldValue" }},
        { title: "变更新值", field: "newValue", align: "left", minWidth: 150, slots: { default: "newValue" }}
      ],
      fileds: [],
      modaltitle: "变更记录",
      fieldObj: {},
      columnsObj: {},
    };
  },
  created() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
    }
    this.setColumn();
    this.getSelectList();
  },
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '供应商变更'}详情`;
    this.init();
  },
  methods: {
    openView(row, old = "old") {
      this.fieldObj = {
        changeField: row.changeField,
        old
      };
      this.visible.detailVisible = true;
      this.modaltitle = `${old == "old" ? "变更前" : "变更后"}${row.changeFieldName}`;
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
      if(!flag) return;
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiBasic
          .putAccessEdit(this.form)
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
    getSelectList(){
      apiSystem.getOrderUsersList().then(res=>{
        let descSourceList = { ...this.descSourceList };
        descSourceList.inviteUserList = (res.data?.inquiryUser ?? []).map((i) => {
          return {
            ...i,
            label: i.nickName,
            value: i.userId,
          };
        });
        this.descSourceList = { ...descSourceList };
      })
    },
    addlinker(){
      let contactList = XEUtils.clone(this.form.contactList||[], true);
      contactList.push({defaultFlag: 0});
      this.$set(this.form, 'contactList', contactList)
    },
    delLinker(index){
      let contactList = [...this.form.contactList];
      contactList.splice(index, 1);
      if(contactList && contactList.length === 1) {
        contactList[0].defaultFlag = 1;
      }
      this.$set(this.form, 'contactList', contactList)
    },
    linkerCheckChange(e, row, rowIndex, column){
      let contactList = this.form.contactList.map(x=>({...x, defaultFlag: 0 }));
      contactList[rowIndex][column.field] = e;
      this.form.contactList = contactList;
    },
    addBank(){
      let bankList =  XEUtils.clone(this.form.bankList||[], true);
      bankList.push({defaultFlag: 0});
      this.$set(this.form, 'bankList', bankList)
    },
    delBank(index){
      let bankList = [...this.form.bankList];
      bankList.splice(index, 1);
      if(bankList && bankList.length === 1) {
        bankList[0].defaultFlag = 1;
      }
      this.$set(this.form, 'bankList', bankList)
    },
    backCheckChange(e, row, rowIndex, column){
      let bankList = this.form.bankList.map(x=>({...x, defaultFlag: 0 }));
      bankList[rowIndex][column.field] = e;
      this.form.bankList = bankList;
    },
    async closePage() {
      const res = await VXETable.modal.confirm({
        title: "提示",
        content: "存在修改状态页面，请确认是否保存！",
        mask: true,
        confirmButtonText: "保存",
      });
      if (res === "confirm") {}
      if (res === "cancel") {
        this.cancel();
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
      if(e && e.item && e.item.field === 'inviteUserId'){
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.userId === this.form[e.item.field])
        this.$set(this.form, 'inviteUserName', find?.nickName ?? '');
        this.$set(this.form, 'inviteUser', find?.userName ?? '');
      }
      if(e && e.item && e.item.field === 'mobile'){
        if(!this.backForm.userName) this.$set(this.form, 'userName', this.form[e.item.field]);
      }
    },
    viewFile(item, fileList=[]){
      let fileName = item.fileName ?? "";
      let ext = fileName && fileName.split(".")[fileName.split(".").length - 1].toLowerCase();
      if(IMG_EXT.includes(ext)){
        this.onImgClick(item, fileList);
        return;
      }
      previewFile(item.url)
    },
    selectChange(value, objfield, list, field) {
      const val = (list || []).find(d => d.value == value)?.label ?? ''
      this.$set(this[objfield], field, val);
    },
    delLogo(field){
      this.$set(this.form, field, []);
    },
    onUploadLogoSuccess(e, field, num = 1) {
      const list = this.form[field] || [];
      if(list && list.length >= num) {
        this.$message.warning(`只能上传 ${num} 张图片`);
        return;
      }
      this.$set(this.form, field, num === 1 ? [{ ...e[0] }] : [...list, { ...e[0] }]);
    },
    onUploadSuccess(e, field) {
      const fileList = XEUtils.clone(this[field].fileList || [], true);
      this.$set(this[field], "fileList", fileList.concat([{ ...e[0] }]));
    },
    onImgClick(item, fileList=[]) {
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
    onDelete(item, index) {
      let fileList = XEUtils.clone(this.papersForm.fileList || [], true);
      fileList.splice(index, 1);
      this.papersForm.fileList = [...fileList];
    },
    savePapers() {
      this.$refs.papersForm.validate((valid) => {
        if (valid) {
          const qualificationsList = XEUtils.clone(this.form.qualificationsList || []);
          if (this.papersIndex === '') {
            qualificationsList.push({ ...this.papersForm });
          } else {
            qualificationsList.splice(this.papersIndex, 1, { ...this.papersForm })
          }
          this.$set(this.form, 'qualificationsList', qualificationsList)
          this.visible.papersVisible = false;
        } else {
          this.$message.error('请检查必填项');
          return false;
        }
      });
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
      apiBasic.getSupplierChangeDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data?.newData??{};
          this.billForm = res.data;
          this.oldForm = res.data?.oldData??{};
          this.newForm = res.data?.newData??{};
          // this.fieldList = res.data?.changeData??[];
          this.fieldList = Array.from(new Set(this.findDifferences(this.oldForm, this.newForm).map(x => x.path.split('.')[0])));
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(() => {
        loading.close();
      });
    },
    findDifferences(obj1, obj2, path = '', seen = new Map()) {
      const differences = [];
      // 检查对象是否为 null 或 undefined
      if (obj1 === obj2) return differences;
      if (obj1 == null || obj2 == null) {
        differences.push({ path, obj1, obj2 });
        return differences;
      }
      // 检查对象类型是否相同
      if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        differences.push({ path, obj1, obj2 });
        return differences;
      }
      // 检查是否已经比较过这两个对象
      if (seen.has(obj1) && seen.get(obj1) === obj2) return differences;
      // 记录已经比较过的对象
      seen.set(obj1, obj2);
      // 获取对象的所有键
      const keys1 = new Set(Object.keys(obj1));
      const keys2 = new Set(Object.keys(obj2));
      // 合并所有键
      const allKeys = new Set([...keys1, ...keys2]);
      // 比较每个键的值
      for (let key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (value1 === value2) continue;
        if (typeof value1 === 'object' && typeof value2 === 'object') {
          // 递归比较嵌套对象
          const nestedDifferences = this.findDifferences(value1, value2, currentPath, seen);
          differences.push(...nestedDifferences);
        } else {
          differences.push({ path: currentPath, obj1: value1, obj2: value2 });
        }
      }
      return differences;
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
      // this.showBtnConfig();
    },
    initTableConfig() {
      const { skxxtable, qyzztable, cpxxtable, skxxtoolbar, qyzztoolbar, cpxxtoolbar, lxxxtoolbar, lxxxtable } = this.$refs;
      if (skxxtable) {
        skxxtable.connect(skxxtoolbar);
        this.initTable('columns1', 'tableColumns1', skxxtable.id);
      }
      if (qyzztable) {
        qyzztable.connect(qyzztoolbar);
        this.initTable('columns2', 'tableColumns2', qyzztable.id);
      }
      if (cpxxtable) {
        cpxxtable.connect(cpxxtoolbar);
        this.initTable('columns', 'tableColumns', cpxxtable.id);
      }
      if(lxxxtable){
        lxxxtable.connect(lxxxtoolbar);
        this.initTable('columns3', 'tableColumns3', lxxxtable.id);
      }
      this.initTable('columns5', 'tableColumns5');
      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultColumns1 = XEUtils.clone(this.columns1, true);
      this.defaultColumns2 = XEUtils.clone(this.columns2, true);
      this.defaultColumns3 = XEUtils.clone(this.columns3, true);
      this.defaultColumns5 = XEUtils.clone(this.columns5, true);
      this.columnsObj = {
        detailList: this.tableColumns,
        bankList: this.tableColumns1,
        qualificationsList: this.tableColumns2,
        contactList: this.tableColumns3,
        contactRecordsList: this.tableColumns5,
      }
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
      tableId ? this[tableColumn] = this[tableColumn] = handleStorageColumns(tableColumns, tableId) : this[tableColumn] = [...tableColumns];
    },
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "detailList,detailList1,detailList2,detailList3,detailList5",corpCode: this.businessCode ?? "LX"});
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm,detailForm1,detailForm3,billDescItems",corpCode: this.businessCode ?? "LX"});
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.columns1 = res.data.detailList1?.columns ?? [];
        this.columns2 = res.data.detailList2?.columns ?? [];
        this.columns3 = res.data.detailList3?.columns ?? [];
        this.columns5 = res.data.detailList5?.columns ?? [];
        this.initTableConfig();
      }
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItems2 = resForm.data.detailForm1?.columns ?? [];
        // this.descItems3 = resForm.data.detailForm2?.columns ?? [];
        this.descItems4 = resForm.data.detailForm3?.columns ?? [];
        this.billDescItems = resForm.data.billDescItems?.columns ?? [];
        this.fileds = [
          ...this.descItems, ...this.descItems2, ...this.descItems4,
          {'label':'产品信息', "field": 'detailList'},
          {'label':'开户信息', "field": 'bankList'},
          {'label':'联系人信息', "field": 'contactList'},
          {'label':'联系备忘录', "field": 'contactRecordsList'},
          {'label':'营业执照-统一社会信用代码', "field": 'businessLicense'},
          {'label':'营业执照-到期日期', "field": 'businessLicenseValidityEndDate'},
          {'label':'营业执照-附件', "field": 'businessLicenseFileList'},
          {'label':'营业执照-确认函', "field": 'confirmTitle'},
          {'label':'营业执照-到期日期', "field": 'confirmValidityEndDate'},
          {'label':'营业执照-确认函附件', "field": 'confirmFileList'},
          {'label':'授权人信息-身份证号码', "field": 'authUserIdCard'},
          {'label':'授权人信息-到期日期', "field": 'authUserValidityEndDate'},
          {'label':'授权人信息-身份证正反面', "field": 'authUserFileList'},
          {'label':'企业资质', "field": 'qualificationsList'},
        ]
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

import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiBasic, ApiQuotation, ApiSystem } from "@/apis";
import { previewFile } from '@/utils/utils';
import { handleStorageColumns } from "@/utils/vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import productList from "@/pages-components/productList/index.vue";
import materialList from "@/pages-components/materialList/index.vue";
import VXETable from "vxe-table";
import ChangeRequest from './scripts/ChangeRequest/index.vue'
const apiBasic = new ApiBasic()
const apiQuotation = new ApiQuotation()
const apiSystem = new ApiSystem()
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];

export default {
  name: "supplier_supplierRegister_detail",
  components: { VueEasyLightbox, productList, ChangeRequest, materialList },
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
    getSupplierState(){
      return () => {
        const find = this.descSourceList.supplierClassificationsList.find(f=>f.value == this.form.supplierClassification);
        return find || { color: '#45CB7F', label: find?.label??this.form.supplierClassificationName };
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
    bindBillDescItems(){
      if(this.userInfo.userType === '03'){
        return this.billDescItems.filter(x=>x.field==='authStatus');
      }
      return this.billDescItems;
    },
    bindDescItems2(){
      if (this.id) {
        return this.descItems2.map(x=>{
          if(x.field==='mobile'){
            return { ...x, disabled: true }
          }
          return x;
        })
      }
      return this.descItems2
    },
    getColorAndName(){
      return (item, list) => {
        const find = list.find(f=>f.value ==this.form[item.field]);
        return find || { color: '#45CB7F', label:'未知'};
      }
    },
    bindFileds(){
      const fileds = [
        ...this.descItems, ...this.descItems1, ...this.descItems2, ...this.descItems3, ...this.descItems4,
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
      ];
      return fileds;
    },
    bindFiledColumns(){
      return {
        detailList: this.tableColumns,
        bankList: this.tableColumns1,
        qualificationsList: this.tableColumns2,
        contactList: this.tableColumns3,
        contactRecordsList: this.tableColumns5,
      }
    }
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "supplier_supplierRegister",
      editState: false,
      backForm: {},
      moment,
      columns: [],
      columns1: [],
      columns2: [],
      billDescItems: [],
      descItems: [],
      descItems1: [],
      descItems2: [],
      descItems3: [],
      descItems4: [],
      descItems5: [],
      tableColumns: [],
      tableColumns1: [],
      tableColumns2: [],
      tableColumns3: [],
      tableColumns4: [],
      tableColumns5: [],
      defaultColumns: [],
      defaultColumns1: [],
      defaultColumns2: [],
      defaultColumns3: [],
      defaultColumns4: [],
      id: null,
      form: {
        areaCodeList: '',
        areaCodeListName: '',
        countryCode: '',
        linkerGender: 0,
        bankList: [{defaultFlag: 1,}],
        contactList: [{defaultFlag: 1,}],
        createUserFlag: 1,
        businessLicenseAutoRenewalFlag: 1,
        authUserAutoRenewalFlag: 1,
        autoRenewalFlag: 1,
        confirmAutoRenewalFlag: 1,
        confirmTitle: '供应商信息确认函',
        paymentTerm: '',
        paymentMethod: '',
        accountPeriod: '',
        validityEndDate: '9999-12-31',
        businessLicenseValidityEndDate: '9999-12-31',
        authUserValidityEndDate: '9999-12-31',
        confirmValidityEndDate: '9999-12-31',
      },
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
        memoVisible: false,
      },
      paymentDataGather: [
        {
          config: [
            { label: "账户名称", field: "paymentName", type: "input" },
            { label: "开户行", field: "paymentDepositBank", type: "input", },
            { label: "账号", field: "paymentDepositAccount", type: "input", },
            { label: "电话", field: "paymentTel", type: "input", },
            {
              label: "地址",
              field: "areaCodeList",
              type: "pca",
              pcaTextField: "areaCodeListName",
              pcaRegionField: 'countryCode',
              output: "string",
            },
            {
              label: "详细地址",
              field: "deliveryAddress",
              type: "input",
            },
          ],
        },
      ],
      memoRules: {
        linkerName: [{ required: true, message: '请输入联系人', trigger: 'blur' },],
        linkerPhone: [
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
      },
      memoForm: {},
      memoIndex: '',
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
      isChage: false,   // 是否变更
      changeFieldList: [],
      readOnly: false, // 只读
      changeVisible: false,
      changeList: [],
      billForm: {},
      oldForm: {},
      newForm: {},
      fieldList: [],
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
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '供应商注册'}详情`;
    if (this.id) {
      this.init();
      this.activeName === 'bgxx' && this.getSupplierChangeList();
    }else{
      this.editState = true;
      this.showBtnConfig();
    }
  },
  methods: {
    tabClick(){
      if(this.id && this.activeName === 'bgxx'){
        this.getSupplierChangeList();
      }
    },
    getSupplierChangeList(){
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      apiBasic.getSupplierChangeList(this.id).then(res=>{
        if(res.code === 200) {
          this.changeList = res.data || [];
        }
      }).catch(err=>{
        this.$message.error(err?.message??'获取变更记录失败')
      }).finally(()=>{
        loading.close();
      })
    },
    openChange(row){
      const loading = this.loading('请求中');
      apiBasic.getSupplierChangeDetail(row.id).then((res) => {
        if (res.code === 200) {
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
      this.changeVisible = true;
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
    changeSubmit(){
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
      });
      const list = this.findDifferences(this.backForm, this.form);
      const fieldList = Array.from(new Set(list.map(x => x.path.split('.')[0])));
      const obj = {
        newData: this.form,
        changeData: fieldList,
      };
      apiBasic.postSupplierChangeSubmit(obj).then((res) => {
        if(res.code === 200){
          this.$message.success("修改信息已提交审核，通过后自动更新系统。");
          this.getSupplierChangeList();
          this.init();
          this.editState = false;
          this.isChage = false;
        }else{
          this.$message.error(res?.message??'提交失败');
        }
      }).catch(err=>{
        this.$message.error(err?.message??'提交失败');
      }).finally(()=>{
        loading.close();
      })
    },
    handleClose(done) {
      this.changeVisible = false;
    },
    memoSelectChange(){
      const find = (this.form.contactList||[]).find(x=>x.name === this.memoForm.name);
      if(find){
        this.memoForm={
          ...this.memoForm,
          mobile: find?.mobile ?? '',
          jobTitle: find?.jobTitle ?? '',
        }
      }
    },
    selectInputFilterMethod(value, field) {
      this.$set(this.memoForm, field, value);
    },
    saveMemo() {
      this.$refs.memoForm.validate((valid) => {
        if (valid) {
          const contactRecordsList = XEUtils.clone(this.form.contactRecordsList || []);
          if (this.memoIndex === '') {
            contactRecordsList.push({ ...this.memoForm });
          } else {
            contactRecordsList.splice(this.memoIndex, 1, { ...this.memoForm })
          }
          this.$set(this.form, 'contactRecordsList', contactRecordsList)
          this.visible.memoVisible = false;
          this.readOnly = false;
        } else {
          this.$message.error('请检查必填项');
          return false;
        }
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
      const flag = await this.validate();
      if(!flag) return;
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiBasic
          .putSupplierRegister(this.form)
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
      contactList.push({defaultFlag: contactList.length?0:1});
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
      bankList.push({defaultFlag: bankList.length?0:1});
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
    closePopup(){
      this.visible = {
        papersVisible: false,
        paymentVisible: false,
        addListVisible: false,
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
        const flag = await this.validate();
        if(!flag) return false;
        const loading = this.loading('保存中...');
        if (this.editState && this.id) {
          if(this.isChage){
            const list = this.findDifferences(this.backForm, this.form);
            const fieldList = Array.from(new Set(list.map(x => x.path.split('.')[0])));
            const obj = {
              newData: this.form,
              changeData: fieldList,
            };
            const res = await apiBasic.postSupplierChangeSubmit(obj);
            loading.close();
            if (res.code === 200) {
              this.editState = false;
              this.isChage = false;
              this.$message.success(res?.message ?? "提交成功");
              return true;
            } else {
              this.$message.error(res?.message??"提交失败");
              return false;
            }
          }else{
            const res = await apiBasic.putSupplierRegister(this.form);
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
        } else {
          const res = await apiBasic.postSupplierRegistert(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$tabs.close(null,`/supplier/supplierRegister-detail/detail/${res.data}`);
            this.$message.success(res?.message??"保存成功");
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
      this.isChage = false;
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
      if(e && e.item && e.item.field === 'taxRate'){
        const { taxRate } = this.form;
        // 不含税价 = 含税价 ÷ (1 + 税率)
        let detailList = (this.form.detailList||[]).map(x=>{
          x.taxRate = taxRate || 0;
          x.untaxPrice = XEUtils.toFixed(parseFloat(x.price||0) / (1 + (taxRate||0) / 100), 4);
          return x;
        })
        this.form.detailList = [...detailList];
      }
    },
    numberChange(e, row, column, rowIndex){
      let detailList = [...this.form.detailList]
      /**
       * 不含税价 = 含税价 ÷ (1 + 税率)
       * 含税价=不含税价×(1+税率)
       */
      if(column.field === 'untaxPrice'){
        row.price = XEUtils.toFixed(parseFloat(e) * (1 + (row.taxRate||0) / 100), 4);
      }else if(['price', 'taxRate'].includes(column.field)){
        row.untaxPrice = XEUtils.toFixed(parseFloat(e) / (1 + (row.taxRate||0) / 100), 4);
      }
      detailList[rowIndex] = {...row};
      this.form.detailList = [...detailList];
    },
    // 添加产品
    addProductData(data) {
      const dataClone = XEUtils.clone(data, true);
      let list = (dataClone ?? []).map((item) => {
        delete item.id;
        delete item._X_ROW_KEY;
        return {...item, taxRate: this.form?.taxRate ?? 0, price: 0, untaxPrice: 0};
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
    viewFile(item, fileList=[]){
      let fileName = item.fileName ?? "";
      let ext = fileName && fileName.split(".")[fileName.split(".").length - 1].toLowerCase();
      if(IMG_EXT.includes(ext)){
        this.onImgClick(item, fileList);
        return;
      }
      previewFile(item.url)
    },
    validate(){
      let flag = true;
      for(let key in this.$refs){
        if(['dataForm','dataForm1','dataForm2','dataForm3'].includes(key)){
          this.$refs[key].validate && this.$refs[key].validate(valid=>{
            if (!valid){
              flag = false;
            } 
          })
        }
      }
      if (!flag) {
        this.$message.warning('请填写必填字段');
      }else if(!this.form.businessLicense){
        flag = false;
        this.$message.warning('请填写统一社会信用代码');
      }else if(!this.form.businessLicenseValidityEndDate && this.form.businessLicenseAutoRenewalFlag !== 1){
        flag = false;
        this.$message.warning('请选择营业执照到期日期');
      }else if(!(this.form.businessLicenseFileList && this.form.businessLicenseFileList.length)){
        flag = false;
        this.$message.warning('请上传营业执照');
      }else if(!(this.form.bankList && this.form.bankList.length)){
        flag = false;
        this.$message.warning('请填写开户银行信息');
      }else if(!(this.form.contactList && this.form.contactList.length)){
        flag = false;
        this.$message.warning('请填写联系人信息');
      }else if(this.form.bankList && this.form.bankList.length && this.form.bankList.some(x=>!x.bankName || !x.accountNo || !x.accountName || !x.branchCode)){
        flag = false;
        this.$message.warning('请填写开户银行信息');
      }else if(this.form.contactList && this.form.contactList.length && this.form.contactList.some(x=>!x.name || !x.mobile)){
        flag = false;
        this.$message.warning('请填写联系人信息');
      }else if(!(this.form.confirmFileList && this.form.confirmFileList.length)){
        flag = false;
        this.$message.warning('请上传确认函');
      }
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    },
    async editSave(){
      const flag = await this.validate();
      if(!flag) return;
      const loading = this.loading('保存中...');
      // {...this.form, detailList: []}
      apiBasic.putSupplierRegister({...this.form}).then(res=>{
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
    async addSave(){
      const flag = await this.validate();
      if(!flag) return;
      const loading = this.loading('保存中...');
      apiBasic.postSupplierRegistert(this.form).then(res=>{
        if(res.code === 200 && res.data){
          this.$tabs.close(null,`/supplier/supplierRegister-detail/detail/${res.data}`);
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
    editpayment(row, index){
      this.visible.paymentVisible = true;
      this.paymentIndex = index,
      this.paymentForm = index!=='' ? {...row}:{
        areaCodeList: '',
        areaCodeListName: '',
        countryCode: '',
      };
    },
    paymentOk(data){
      const invoiceTitleList = this.form?.invoiceTitleList ?? [];
      if (this.paymentIndex === "") {
        invoiceTitleList.push(data);
      } else {
        invoiceTitleList.splice(this.paymentIndex, 1, data);
      }
      this.visible.paymentVisible = false;
      this.$set(this.form, 'invoiceTitleList', invoiceTitleList)
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
    onDelete(item, index, filed="papersForm") {
      let fileList = XEUtils.clone(this[filed].fileList || [], true);
      fileList.splice(index, 1);
      this[filed].fileList = [...fileList];
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
          this.readOnly = false;
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
      this.isChage = false;
      this.backForm = XEUtils.clone(this.form, true);
    },
    changeEditClick(){
      this.editState = true;
      this.isChage = true;
      this.backForm = XEUtils.clone(this.form, true);
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiBasic.getSupplierRegister(this.id).then((res) => {
        if (res.code === 200) {
          this.form = { ...(res.data || {}), countryCode: res.data?.countryCode ?? '', confirmTitle: res.data.confirmTitle || '供应商信息确认函', };
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
      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultColumns1 = XEUtils.clone(this.columns1, true);
      this.defaultColumns2 = XEUtils.clone(this.columns2, true);
      this.defaultColumns3 = XEUtils.clone(this.columns3, true);
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
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "detailList,detailList1,detailList2,detailList3,detailList4,detailList5",corpCode: this.businessCode ?? "LX"});
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm,detailForm1,detailForm2,detailForm3,billDescItems",corpCode: this.businessCode ?? "LX"});
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.columns1 = res.data.detailList1?.columns ?? [];
        this.columns2 = res.data.detailList2?.columns ?? [];
        this.columns3 = res.data.detailList3?.columns ?? [];
        this.tableColumns4 = res.data.detailList4?.columns ?? [];
        this.tableColumns5 = res.data.detailList5?.columns ?? [];
        this.initTableConfig();
      }
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItems2 = resForm.data.detailForm1?.columns ?? [];
        this.descItems3 = resForm.data.detailForm2?.columns ?? [];
        this.descItems4 = resForm.data.detailForm3?.columns ?? [];
        this.billDescItems = resForm.data.billDescItems?.columns ?? [];
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

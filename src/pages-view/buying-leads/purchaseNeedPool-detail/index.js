import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy, ApiBasic,ApiSystem } from "@/apis";
import VXETable from "vxe-table";
const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
const apiBasic = new ApiBasic();
const apiSystem = new ApiSystem();
export default {
  components: {},
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
      menuCode: "buyingLead_purchaseNeedPool",
      fileBillTpye: "PC",
      activeName: 'jbxx',
      id: null,
      allBtnControlList: [],
      editState: false,
      form: {},
      formDataShow: {
        cgmx: true,
        xyxx: true,
        cgzx: true,
        fjcz: true,
      },
      rulesobj: {},
      descItems: [],
      rulesobj1: {},
      descItems1: [],
      rulesobj2: {},
      descItems2: [],
      rulesobj3: {},
      descItems3: [],
      descSourceList: {
        fileList: [],
        applicantList: [],//申请人
        adepartmentList: [],//采购部门
        sourcingMethodList:(dict["sourcing_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),//寻源方式
        sourcingStateList:(dict["sourcing_state"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),//寻源进度
        confirmedSupplierList:[],//供应商
      },
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
  created() {},
  mounted() {},
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
    }
    this.setColumn();
  },
  methods: {
    getSelectList() {
      apiBasic.getQualifiedSupplierList().then((res) => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.confirmedSupplierList =  (res.data?.records ?? []).map((i) => {
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
          const submitRes = await  apiBuy.putPurchasePool(this.form);
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
        this.editPurchase();
    },
    editPurchase() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiBuy
        .putPurchasePool(this.form)
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
        .getPurchasePoolDetail({ id })
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.form = {  ...res.data,};
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
      let dataForm = {
        code: "detailForm,detailForm1,detailForm2,detailForm3",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfigMulti(
        this.menuCode,
        dataForm
      );
      if (resform.code === 200 && resform.data) {
        this.descItems = resform.data.detailForm?.columns ?? [];
        this.descItems1 = resform.data.detailForm1?.columns ?? [];
        this.descItems2 = resform.data.detailForm2?.columns ?? []
        this.descItems3 = resform.data.detailForm3?.columns ?? []
      }

      setTimeout(() => {
        loading.close();
      }, 1000);
    },
    validFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.dataForm.validate((valid) => {
          resolve(valid);
        });
      });
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

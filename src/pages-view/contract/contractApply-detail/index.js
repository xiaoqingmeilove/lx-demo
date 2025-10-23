import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiContract, ApiQuotation, ApiBasic, ApiCommon } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import VXETable from "vxe-table";
import productList from "./coms/productList/index.vue"
import "@wangeditor/editor/dist/css/style.css";
import mixin_table from "./scripts/mixins/table";
import supplierList from "@/pages-components/supplierList/index.vue";


const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation()
const apiBasic = new ApiBasic()
export default {
  name: "contract_contractApply_detail",
  components: { Editor, Toolbar, productList,supplierList },
  mixins: [mixin_table],
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
      menuCode: "contract_contractApply",
      editState: false,
      backForm: {},
      moment,
      descItems: [],
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      id: null,
      form: {
        templateContent: '',
      },
      formDataShow: {
        lxrxx: true,
        cpxx: true,
      },
      rules: {
        contractType: [{ required: true, message: "请选择合同类型" }],
        contractDate: [{ required: true, message: "请选择合同日期" }],
        contractStartDate: [{ required: true, message: "请选择合同开始时间" }],
        contractEndDate: [{ required: true, message: "请选择合同结束时间" }],
        purchaseType: [{ required: true, message: "请选择采购类型" }],
        businessEntity: [{ required: true, message: "请选择业务主体" }],
        supplierId: [{ required: true, message: "请选择供应商" }],
        contractAmount: [{ required: true, message: "请输入合同金额" }],
        paymentMethod: [{ required: true, message: "请输入付款方式" }],
      },
      descSourceList: {
        contractTypeList: (dict["contract_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        purchaseTypeList: (dict["contract_purchase_type"]?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue } 
        }),
        businessSubjectList: (dict["business_entity"]?? []).map(d => {
          return { label: d.dictLabel, value: d.dictLabel } 
        }),
        supplierList: [],
        contractTemplateList: [],
        fileList: [],
      },
      allBtnControlList: [],
      activeName: 'jbxx',
      editor: null,
      toolbarConfig: {
        excludeKeys: ["fullScreen", "group-video", "emotion"],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        readOnly: true,
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            customUpload: this.updateImage,
          },
        },
      }, // 编辑器的配置对象
      mode: "default", // or 'simple'
      addListVisible: false,
      visible: {
        addSupplierVisible: false,
      },
    };
  },
  created() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
    }
    this.setColumn();
    this.getSelect();
  },
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '合同'}详情`;
    if (this.id) {
      this.init();
    }else{
      this.editState = true;
      this.showBtnConfig();
    }
  },
  methods: {
    addSupplierData(data){
      if(data.length !== 1){
        this.$message.warning("请选择一个供应商");
        return;
      }
      const obj = data[0] || {};
      let form = { ...this.form };
      this.form = {...form, supplierName: obj?.supplierName ?? '', supplierId: obj?.id ?? '', supplierBillNo: obj?.billNo ?? '', taxRate: obj?.taxRate ?? 0};
      this.visible.addSupplierVisible = false;
    },
    addProduct(){
      const { supplierId, businessLicense } = this.form;
      if(!supplierId) {
        this.$message.error("请先选择供应商");
        return;
      }
      this.addListVisible = true
    },
    getSelect(){
      apiContract.getTemplateList().then(res => {
        if(res.code === 200 && res.data) {
          let descSourceList = { ...this.descSourceList };
          descSourceList.contractTemplateList = (res.data||[]).map(x=>{
            return { ...x, label: x.templateName, value: x.templateId }
          });
          this.descSourceList = { ...descSourceList };
        }
      })
      apiBasic.getQualifiedSupplierList().then((res) => {
        if(res.code === 200 && res.data) {
          let descSourceList = { ...this.descSourceList };
          descSourceList.supplierList = (res.data?.records ?? []).map((x) => {
            return {
              label: x.businessLicense,
              value: x.id,
            };
          });
          this.descSourceList = { ...descSourceList };
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
        apiContract.putContractBillEdit(this.form).then((res) => {
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
    async onSubmitExamine() {
      const { workflow } = this.$refs;
      const { workflow: workflowComponent } = workflow?.$refs;
      workflowComponent && workflowComponent.submitWorkflow();
    },
    // 添加产品
    addProductData(data) {
      const dataClone = XEUtils.clone(data, true);
      let list = (dataClone ?? []).map((item) => {
        delete item.id;
        delete item._X_ROW_KEY;
        return item;
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
    updateImage(file, insertFn) {
      ApiCommon.uploadFile(file).then(res => {
        if (res.code === 200) {
          const { url } = res.data;
          insertFn(url);
        } else {
          this.$message.error(res.message || '上传失败');
        }
      }).catch(err => {
        this.$message.error(err.message || '上传失败');
      })
    },
    //富文本
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      this.$nextTick(()=>{
        if (!this.editState) {
          this.editor.disable();
        } else {
          this.editor.enable();
        }
      });
    },
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
      if(e && e.item && e.item.field === 'templateId') {
        const find = (this.descSourceList.contractTemplateList||[]).find(x=>x.value === this.form.templateId);
        this.form = {
          ...this.form,
          templateNo:find?.templateNo??'',
          templateName:find?.templateName??'',
          templateContent:find?.templateContent??'',
        }
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
        if (this.editState && this.id) {
          const res = await apiContract.putContractBillEdit(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.editor && this.editor.disable();
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message??"修改失败系统异常");
            return false;
          }
        } else {
          const res = await apiContract.postContractBillAdd(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$tabs.close(null,`/contract/contractApply-detail/detail/${res.data.id}`);
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
      this.form = { ...this.backForm };
      this.editor.disable();     //设置为只读，不可编辑 
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
    async editSave(){
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return false;
      }
      const loading = this.loading('保存中...');
      apiContract.putContractBillEdit(this.form).then(res=>{
        if(res.code === 200){
          this.getDetail();
          this.editState=false;
          this.editor.disable();
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
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return false;
      }
      const loading = this.loading('保存中...');
      apiContract.postContractBillAdd(this.form).then(res=>{
        if(res.code === 200 && res.data){
          this.$tabs.close(null,`/contract/contractApply-detail/detail/${res.data.id}`);
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
    editClick() {
      this.editState = true;
      this.backForm = XEUtils.clone(this.form, true);
      this.editor.enable();   //取消只读， 可编辑
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiContract.getContractBillDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = { ...(res.data || {}), countryCode: res.data?.countryCode ?? '' };
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
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "detailList",corpCode: this.businessCode ?? "LX"});
      if(res.code === 200 && res.data){
        this.columns = res.data.detailList?.columns?? [];
        this.initTableConfig();
      }
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm",corpCode: this.businessCode ?? "LX"});
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
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
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时 销毁编辑器
  },
};

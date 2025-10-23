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
import BecomeInvalidRemind from "@/pages-components/becomeInvalidRemind/index.vue";
import VXETable from "vxe-table";

const apiBasic = new ApiBasic()
const apiQuotation = new ApiQuotation()
const apiSystem = new ApiSystem()
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: "material_sourceList_detail",
  components: { VueEasyLightbox, materialList, supplierList, BecomeInvalidRemind },
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
    getColorAndName(){
      return (item, list) => {
        const find = list.find(f=>f.value ==this.form[item.field]);
        return find || { color: '#45CB7F', label:'未知'};
      }
    },
    formatDate(){
      return (date) =>{
        return date ? moment(date).format("YYYY-MM-DD") : '';
      }
    },
    pickerOptions() {
      return {
        validityStartDate: {
          disabledDate: (current) => {
            return current < moment().subtract(1, "day") || current > moment(this.form.validityEndDate||'');
          }
        },
        validityEndDate: {
          disabledDate: (current) => {
            return current <= moment(this.form.validityStartDate||'').subtract(1, "day");
          }
        }
      }
    },
    bindTableData(){
      if(!this.form.materialCode) return [];
      let obj = {}; 
      this.tableColumns.map(x=>{
        obj[x.field] = this.form[x.field] || null;
        return x;
      })
      console.log(obj, "obj");
      
      return [obj];
    }
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "material_sourceList",
      editState: false,
      backForm: {},
      moment,
      columns: [],
      columns1: [],
      descItems: [],
      tableColumns: [],
      tableColumns1: [],
      defaultColumns: [],
      defaultColumns1: [],
      id: null,
      form: {
        type: 0,
        typeName: '固定',
        validityStartDate: moment().format("YYYY-MM-DD"),
        validityEndDate: moment().add(1, 'year').format("YYYY-MM-DD"),
        supplierList: [],
      },
      effectiveValue: '',
      formDataShow: {
        jbxx: true,
        cpxx: true,
        pelb: true,
      },
      rules: {
        type: [{ required: true, message: '请选择货源类型', trigger: 'blur' },],
        validityStartDate: [{ required: true, message: '请选择生效日期', trigger: 'blur' },],
        validityEndDate: [{ required: true, message: '请选择失效日期', trigger: 'blur' },],
      },
      descSourceList: {
        fileList: [],
        sourceTypeList: [{ label: '固定', value: 0 }, { label: '比例', value: 1 }],
      },
      visible: {
        addSupplierVisible: false,
        addProductList: false,
        zfVisible: false
      },
      previewImg: false,
      previewIndex: 0,
      imgs: [],
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
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '价目表'}详情`;
    if(this.id) {
      this.init();
    }else{
      this.editState = true;
      this.showBtnConfig();
    }
  },
  methods: {
    async becomeInvalid() {
      const res = await apiBasic.getSourceCancel(this.id);
      if (res.code === 200) {
        this.$message.success(res.message || "操作成功");
        this.init();
        this.visible.zfVisible = false;
      } else {
        this.$message.error(res.message || "操作异常");
      }
    },
    delRow(row, rowIndex, field){
      let detailList = [...this.form[field]];
      detailList.splice(rowIndex, 1);
      this.form[field] = [...detailList];
      if(field === 'detailList' && !(this.form.detailList && this.form.detailList.length)){
        this.form.supplierList = [];
      }
    },
    numberChange(e, row, column, rowIndex){
      let supplierList = [...this.form.supplierList]
      if(column.field === 'price'){
        row.untaxPrice = XEUtils.toFixed(parseFloat(e) / (1 + (row?.taxRate??0) / 100), 4);
      }
      supplierList[rowIndex] = {...row};
      this.form.supplierList = [...supplierList];
    },
    addMaterialData(data){
      if(data.length !== 1){
        this.$message.warning("请选择一个物料");
        return;
      }
      const fields = ['accountPrice','attribute','basicPrice','conductorFlag','dishFlag','highestStock','makeProductFlag','materialCode','materialName','materialTypeCode','materialTypeId','materialTypeName','minimumStock','mnemonicCode','model','packSpecial','planPrice','priceAccuracy','purchaseUnit','purchaseUnitConversion','qtyAccuracy','quoteUseFlag','remark','safeStock','standard','standardType','status','unit','virtualFlag','voltageLevel','wireProductFlag'];
      const obj = data[0] || {};
      const objValue = fields.reduce((acc, cur) => {
        acc[cur] = obj[cur] || null;
        return acc
      }, {});
      const form = {...this.form};
      this.form = { ...form, ...objValue };  
      // this.$set(this.form, 'detailList', [{...objValue}]);
      this.visible.addProductList = false;
    },
    addSupplier(){
      if(!this.form.materialCode){
        this.$message.warning("请选择物料");
        return;
      }
      this.visible.addSupplierVisible = true;
    },
    addSupplierData(data){
      if(data.length !== 1 && this.form.type === 0){
        this.$message.warning("请选择一个供应商");
        return;
      }
      if(this.form.type === 0){
        let obj = data[0] || {};
        const supplierList = [{
          supplierName: obj.supplierName,
          supplierBillNo: obj.billNo,
          supplierId: obj.id,
          validityStartDate: moment(obj.auditDate||obj.updateTime).format("YYYY-MM-DD"),
          validityEndDate: obj.autoRenewalFlag ? '2099-12-30' : obj.validityEndDate,
          taxRate: obj?.taxRate??0,
          ratio: 100,
          price: 0,
          untaxPrice: 0,
        }];
        this.$set(this.form, 'supplierList', supplierList);
      }else{
        let supplierList = XEUtils.clone(this.form.supplierList || [], true);
        supplierList = data.reduce((acc, cur) => {
          if(this.form.supplierList.findIndex(item => item.supplierId === cur.id) === -1){
            const obj = {
              supplierName: cur.supplierName,
              supplierBillNo: cur.billNo,
              supplierId: cur.id,
              validityStartDate: moment(cur.auditDate||cur.updateTime).format("YYYY-MM-DD"),
              validityEndDate: cur.autoRenewalFlag ? '2099-12-30' : cur.validityEndDate,
              taxRate: cur?.taxRate??0,
              ratio: 0,
              price: 0,
              untaxPrice: 0,
            };
            acc.push(obj);
          }
          return acc;
        }, supplierList);
        this.$set(this.form, 'supplierList', supplierList);
      }
      this.visible.addSupplierVisible = false;
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
      const valid = await this.validateTable();
      if(valid) return;
      if (this.editState) {
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        apiBasic
          .putSourceEdit(this.form)
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
    closePopup(){
      this.visible = {
        addSupplierVisible: false,
        addProductList: false,
        zfVisible: false,
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
        if(this.id){
          const loading = this.loading('保存中...');
          const res = await apiBasic.putSourceEdit(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message??"修改失败系统异常");
            return false;
          }
        }else{
          const loading = this.loading('保存中...');
          const res = await apiBasic.postSourceSave(this.form);
          loading.close();
          if (res.code === 200) {
            this.$tabs.close(null, `/material/sourceList-detail/detail/${res.data.id}`)
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message??"修改失败系统异常");
            return false;
          }
        }
      }
      if (res === "cancel") {
        if(this.id){
          this.cancel();
        }else{
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
      if(e && e.item && e.item.field === 'type'){
        this.$set(this.form , 'supplierList', []);
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
    validateTable(){
      let flag = false;
      const str = (this.form.supplierList||[]).reduce((acc, item, index) =>{
        if(!parseFloat(item.price) || !parseFloat(item.ratio)){
          acc += `第${index+1}行 ${!parseFloat(item.price)?'含税单价不能为0':''}  ${!parseFloat(item.ratio)?'配额不能为0':''}\n`
        }
        return acc;
      }, '')
      if(str){
        this.$message.error(str);
        flag = true;
      }else{
        const ratio = (this.form.supplierList||[]).reduce((sum, item) =>{
          sum += parseFloat(item.ratio||0);
          return sum;
        }, 0);
        if(ratio > 100){
          this.$message.error('请检查配额，配额合计小于等于100');
          flag = true;
        }
      }
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    },
    async addSave(){
      const loading = this.loading('保存中...');
      apiBasic.postSourceSave(this.form).then(res=>{
        if(res.code === 200 && res.data){
          this.$tabs.close(null, `/material/sourceList-detail/detail/${res.data.id}`)
          this.$message.success(res?.message || '保持成功');
        }else{
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err=>{
        this.$message.error(err?.message || '保存失败')
      }).finally(()=>{
        loading.close()
      })
    },
    async editSave(){
      const loading = this.loading('保存中...');
      apiBasic.putSourceEdit(this.form).then(res=>{
        if(res.code === 200){
          this.getDetail();
          this.editState=false;
          this.$message.success(res?.message || '保持成功');
        }else{
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err=>{
        this.$message.error(err?.message || '保存失败')
      }).finally(()=>{
        loading.close()
      })
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
    editClick() {
      this.editState = true;
      this.backForm = XEUtils.clone(this.form, true);
    },
    getDetail() {
      if(!this.id) return;
      const loading = this.loading('请求中');
      apiBasic.getSourceDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data || {};
          const {validityStartDate, validityEndDate} = this.form;
          this.effectiveValue = [validityStartDate||'', validityEndDate||''];
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
      const { cpxxtable, pelbtable, pelbtoolbar, cpxxtoolbar } = this.$refs;
      if (cpxxtable) {
        cpxxtable.connect(cpxxtoolbar);
        this.initTable('columns', 'tableColumns', cpxxtable.id);
      }
      if (pelbtable) {
        pelbtable.connect(pelbtoolbar);
        this.initTable('columns1', 'tableColumns1', pelbtable.id);
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultColumns1 = XEUtils.clone(this.columns1, true);
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
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "detailList,detailList1",corpCode: this.businessCode ?? "LX"});
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm",corpCode: this.businessCode ?? "LX"});
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.columns1 = res.data.detailList1?.columns ?? [];
        this.initTableConfig();
      }
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
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
